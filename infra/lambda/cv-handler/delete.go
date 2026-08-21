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

func remove(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	owner, err := shared.GetOwner(req)
	if err != nil {
		return shared.Unauthorized("unable to identify user")
	}

	id := req.PathParameters["id"]
	if id == "" {
		return shared.BadRequest("id is required")
	}

	names := map[string]string{"#owner": "owner"}
	values := map[string]types.AttributeValue{
		":owner": &types.AttributeValueMemberS{Value: owner},
	}

	result, err := shared.DynamoClient().DeleteItem(ctx, &dynamodb.DeleteItemInput{
		TableName: shared.StringPtr(tableName()),
		Key: map[string]types.AttributeValue{
			"id": &types.AttributeValueMemberS{Value: id},
		},
		ConditionExpression:       aws.String("#owner = :owner"),
		ExpressionAttributeNames:  names,
		ExpressionAttributeValues: values,
		ReturnValues:              types.ReturnValueAllOld,
	})
	if err != nil {
		return shared.Forbidden("CV not found or access denied")
	}

	var cv shared.CV
	if err := attributevalue.UnmarshalMap(result.Attributes, &cv); err != nil {
		return shared.InternalError("failed to unmarshal deleted CV")
	}

	return shared.Success(cv)
}
