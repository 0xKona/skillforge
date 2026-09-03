package main

import (
	"context"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentity"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func init() {
	os.Setenv("CV_TABLE_NAME", "test-cv-table")
	os.Setenv("INGOT_TABLE_NAME", "test-ingot-table")
	os.Setenv("USER_POOL_ID", "eu-west-2_testpool")
	os.Setenv("IDENTITY_POOL_ID", "eu-west-2:identity")
	os.Setenv("AVATAR_BUCKET", "test-avatars")
	os.Setenv("AWS_REGION", "eu-west-2")
}

type mockDB struct {
	queryFunc          func(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error)
	batchWriteItemFunc func(ctx context.Context, params *dynamodb.BatchWriteItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.BatchWriteItemOutput, error)
}

func (m *mockDB) PutItem(ctx context.Context, params *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
	return &dynamodb.PutItemOutput{}, nil
}
func (m *mockDB) GetItem(ctx context.Context, params *dynamodb.GetItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error) {
	return &dynamodb.GetItemOutput{}, nil
}
func (m *mockDB) DeleteItem(ctx context.Context, params *dynamodb.DeleteItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.DeleteItemOutput, error) {
	return &dynamodb.DeleteItemOutput{}, nil
}
func (m *mockDB) UpdateItem(ctx context.Context, params *dynamodb.UpdateItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.UpdateItemOutput, error) {
	return &dynamodb.UpdateItemOutput{}, nil
}
func (m *mockDB) Query(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
	if m.queryFunc != nil {
		return m.queryFunc(ctx, params, optFns...)
	}
	return &dynamodb.QueryOutput{}, nil
}
func (m *mockDB) BatchWriteItem(ctx context.Context, params *dynamodb.BatchWriteItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.BatchWriteItemOutput, error) {
	if m.batchWriteItemFunc != nil {
		return m.batchWriteItemFunc(ctx, params, optFns...)
	}
	return &dynamodb.BatchWriteItemOutput{}, nil
}

type mockIdentity struct {
	getIdFunc func(ctx context.Context, params *cognitoidentity.GetIdInput, optFns ...func(*cognitoidentity.Options)) (*cognitoidentity.GetIdOutput, error)
}

func (m *mockIdentity) GetId(ctx context.Context, params *cognitoidentity.GetIdInput, optFns ...func(*cognitoidentity.Options)) (*cognitoidentity.GetIdOutput, error) {
	if m.getIdFunc != nil {
		return m.getIdFunc(ctx, params, optFns...)
	}
	return &cognitoidentity.GetIdOutput{IdentityId: aws.String("eu-west-2:abc")}, nil
}

type mockS3 struct {
	listFunc   func(ctx context.Context, params *s3.ListObjectsV2Input, optFns ...func(*s3.Options)) (*s3.ListObjectsV2Output, error)
	deleteFunc func(ctx context.Context, params *s3.DeleteObjectsInput, optFns ...func(*s3.Options)) (*s3.DeleteObjectsOutput, error)
}

func (m *mockS3) ListObjectsV2(ctx context.Context, params *s3.ListObjectsV2Input, optFns ...func(*s3.Options)) (*s3.ListObjectsV2Output, error) {
	if m.listFunc != nil {
		return m.listFunc(ctx, params, optFns...)
	}
	return &s3.ListObjectsV2Output{}, nil
}
func (m *mockS3) DeleteObjects(ctx context.Context, params *s3.DeleteObjectsInput, optFns ...func(*s3.Options)) (*s3.DeleteObjectsOutput, error) {
	if m.deleteFunc != nil {
		return m.deleteFunc(ctx, params, optFns...)
	}
	return &s3.DeleteObjectsOutput{}, nil
}

type mockCognito struct {
	deleteFunc func(ctx context.Context, params *cognitoidentityprovider.AdminDeleteUserInput, optFns ...func(*cognitoidentityprovider.Options)) (*cognitoidentityprovider.AdminDeleteUserOutput, error)
}

func (m *mockCognito) AdminDeleteUser(ctx context.Context, params *cognitoidentityprovider.AdminDeleteUserInput, optFns ...func(*cognitoidentityprovider.Options)) (*cognitoidentityprovider.AdminDeleteUserOutput, error) {
	if m.deleteFunc != nil {
		return m.deleteFunc(ctx, params, optFns...)
	}
	return &cognitoidentityprovider.AdminDeleteUserOutput{}, nil
}

func makeRequest(method, owner, username string) events.APIGatewayProxyRequest {
	authorizer := map[string]interface{}{}
	if owner != "" {
		claims := map[string]interface{}{"sub": owner}
		if username != "" {
			claims["cognito:username"] = username
		}
		authorizer["claims"] = claims
	}
	return events.APIGatewayProxyRequest{
		HTTPMethod: method,
		Headers: map[string]string{
			"Authorization": "Bearer test-token",
		},
		RequestContext: events.APIGatewayProxyRequestContext{
			Authorizer: authorizer,
		},
	}
}

func idItem(id string) map[string]types.AttributeValue {
	return map[string]types.AttributeValue{
		"id": &types.AttributeValueMemberS{Value: id},
	}
}
