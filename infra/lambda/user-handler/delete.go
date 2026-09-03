package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"strings"

	"github.com/0xKona/skillforge/infra/lambda/shared"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentity"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	cidpTypes "github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider/types"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	s3types "github.com/aws/aws-sdk-go-v2/service/s3/types"
)

func deleteUserData(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	owner, err := shared.GetOwner(req)
	if err != nil {
		return shared.Unauthorized("unable to identify user")
	}

	if err := deleteOwnerItems(ctx, cvTableName(), owner); err != nil {
		log.Printf("failed to delete CVs for %s: %v", owner, err)
		return shared.InternalError("failed to delete CV data")
	}

	if err := deleteOwnerItems(ctx, ingotTableName(), owner); err != nil {
		log.Printf("failed to delete ingots for %s: %v", owner, err)
		return shared.InternalError("failed to delete ingot data")
	}

	if err := deleteAvatars(ctx, req); err != nil {
		log.Printf("avatar cleanup failed for %s: %v", owner, err)
	}

	username, err := shared.GetUsername(req)
	if err != nil {
		return shared.InternalError("unable to identify username")
	}
	if err := deleteCognitoUser(ctx, username); err != nil {
		log.Printf("failed to delete cognito user %s: %v", username, err)
		return shared.InternalError("failed to delete account")
	}

	return shared.Success(map[string]bool{"deleted": true})
}

func deleteOwnerItems(ctx context.Context, tableName, owner string) error {
	if tableName == "" {
		return errors.New("table name is empty")
	}

	var startKey map[string]types.AttributeValue
	for {
		out, err := db.Query(ctx, &dynamodb.QueryInput{
			TableName:              aws.String(tableName),
			IndexName:              aws.String("by-owner"),
			KeyConditionExpression: aws.String("#owner = :owner"),
			ProjectionExpression:   aws.String("id"),
			ExpressionAttributeNames: map[string]string{
				"#owner": "owner",
			},
			ExpressionAttributeValues: map[string]types.AttributeValue{
				":owner": &types.AttributeValueMemberS{Value: owner},
			},
			ExclusiveStartKey: startKey,
		})
		if err != nil {
			return err
		}

		ids := make([]string, 0, len(out.Items))
		for _, item := range out.Items {
			if idAttr, ok := item["id"].(*types.AttributeValueMemberS); ok && idAttr.Value != "" {
				ids = append(ids, idAttr.Value)
			}
		}
		if err := batchDeleteIDs(ctx, tableName, ids); err != nil {
			return err
		}

		if len(out.LastEvaluatedKey) == 0 {
			return nil
		}
		startKey = out.LastEvaluatedKey
	}
}

func batchDeleteIDs(ctx context.Context, tableName string, ids []string) error {
	for i := 0; i < len(ids); i += 25 {
		end := i + 25
		if end > len(ids) {
			end = len(ids)
		}
		pending := make([]types.WriteRequest, 0, end-i)
		for _, id := range ids[i:end] {
			pending = append(pending, types.WriteRequest{
				DeleteRequest: &types.DeleteRequest{
					Key: map[string]types.AttributeValue{
						"id": &types.AttributeValueMemberS{Value: id},
					},
				},
			})
		}

		for len(pending) > 0 {
			out, err := db.BatchWriteItem(ctx, &dynamodb.BatchWriteItemInput{
				RequestItems: map[string][]types.WriteRequest{
					tableName: pending,
				},
			})
			if err != nil {
				return err
			}
			pending = out.UnprocessedItems[tableName]
		}
	}
	return nil
}

func deleteAvatars(ctx context.Context, req events.APIGatewayProxyRequest) error {
	if identity == nil || s3c == nil {
		return nil
	}
	token := shared.BearerToken(req)
	if token == "" || identityPoolID() == "" || userPoolID() == "" || avatarBucket() == "" {
		return nil
	}

	provider := fmt.Sprintf("cognito-idp.%s.amazonaws.com/%s", awsRegion(), userPoolID())
	idOut, err := identity.GetId(ctx, &cognitoidentity.GetIdInput{
		IdentityPoolId: aws.String(identityPoolID()),
		Logins: map[string]string{
			provider: token,
		},
	})
	if err != nil {
		return err
	}
	if idOut.IdentityId == nil || *idOut.IdentityId == "" {
		return errors.New("empty identity id")
	}

	prefix := "avatars/" + *idOut.IdentityId + "/"
	var continuation *string
	for {
		listed, err := s3c.ListObjectsV2(ctx, &s3.ListObjectsV2Input{
			Bucket:            aws.String(avatarBucket()),
			Prefix:            aws.String(prefix),
			ContinuationToken: continuation,
		})
		if err != nil {
			return err
		}
		if len(listed.Contents) > 0 {
			objects := make([]s3types.ObjectIdentifier, 0, len(listed.Contents))
			for _, obj := range listed.Contents {
				if obj.Key != nil {
					objects = append(objects, s3types.ObjectIdentifier{Key: obj.Key})
				}
			}
			if _, err := s3c.DeleteObjects(ctx, &s3.DeleteObjectsInput{
				Bucket: aws.String(avatarBucket()),
				Delete: &s3types.Delete{Objects: objects, Quiet: aws.Bool(true)},
			}); err != nil {
				return err
			}
		}
		if listed.IsTruncated == nil || !*listed.IsTruncated {
			return nil
		}
		continuation = listed.NextContinuationToken
	}
}

func deleteCognitoUser(ctx context.Context, username string) error {
	if idp == nil || userPoolID() == "" || strings.TrimSpace(username) == "" {
		return errors.New("cognito client not configured")
	}

	_, err := idp.AdminDeleteUser(ctx, &cognitoidentityprovider.AdminDeleteUserInput{
		UserPoolId: aws.String(userPoolID()),
		Username:   aws.String(username),
	})
	if err == nil {
		return nil
	}

	var notFound *cidpTypes.UserNotFoundException
	if errors.As(err, &notFound) {
		return nil
	}
	return err
}
