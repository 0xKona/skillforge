package main

import (
	"context"

	"github.com/0xKona/skillforge/infra/lambda/shared"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type listResponse struct {
	Items     []shared.CV `json:"items"`
	NextToken *string     `json:"nextToken,omitempty"`
}

func list(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	owner, err := shared.GetOwner(req)
	if err != nil {
		return shared.Unauthorized("unable to identify user")
	}

	input := &dynamodb.QueryInput{
		TableName:              shared.StringPtr(tableName()),
		IndexName:              aws.String("by-owner"),
		KeyConditionExpression: aws.String("#owner = :owner"),
		ExpressionAttributeNames: map[string]string{
			"#owner": "owner",
		},
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":owner": &types.AttributeValueMemberS{Value: owner},
		},
		ScanIndexForward: aws.Bool(false),
		Limit:            aws.Int32(50),
	}

	// Handle pagination token
	if token := req.QueryStringParameters["nextToken"]; token != "" {
		input.ExclusiveStartKey = map[string]types.AttributeValue{
			"nextToken": &types.AttributeValueMemberS{Value: token},
		}
	}

	result, err := shared.DynamoClient().Query(ctx, input)
	if err != nil {
		return shared.InternalError("failed to list CVs")
	}

	var cvs []shared.CV
	if err := attributevalue.UnmarshalListOfMaps(result.Items, &cvs); err != nil {
		return shared.InternalError("failed to unmarshal CVs")
	}

	resp := listResponse{Items: cvs}
	if result.LastEvaluatedKey != nil {
		// Simplified: in production, encode the full key as a token
		if v, ok := result.LastEvaluatedKey["id"].(*types.AttributeValueMemberS); ok {
			resp.NextToken = &v.Value
		}
	}

	return shared.Success(resp)
}
