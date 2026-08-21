package main

import (
	"context"

	"github.com/0xKona/skillforge/infra/lambda/shared"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func get(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	owner, err := shared.GetOwner(req)
	if err != nil {
		return shared.Unauthorized("unable to identify user")
	}

	id := req.PathParameters["id"]
	if id == "" {
		return shared.BadRequest("id is required")
	}

	result, err := shared.DynamoClient().GetItem(ctx, &dynamodb.GetItemInput{
		TableName: shared.StringPtr(tableName()),
		Key: map[string]types.AttributeValue{
			"id": &types.AttributeValueMemberS{Value: id},
		},
	})
	if err != nil {
		return shared.InternalError("failed to get ingot")
	}

	if result.Item == nil {
		return shared.NotFound("ingot not found")
	}

	var ingot shared.Ingot
	if err := attributevalue.UnmarshalMap(result.Item, &ingot); err != nil {
		return shared.InternalError("failed to unmarshal ingot")
	}

	if ingot.Owner != owner {
		return shared.Forbidden("access denied")
	}

	return shared.Success(ingot)
}
