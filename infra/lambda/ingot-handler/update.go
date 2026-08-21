package main

import (
	"context"
	"encoding/json"

	"github.com/0xKona/skillforge/infra/lambda/shared"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func update(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	owner, err := shared.GetOwner(req)
	if err != nil {
		return shared.Unauthorized("unable to identify user")
	}

	id := req.PathParameters["id"]
	if id == "" {
		return shared.BadRequest("id is required")
	}

	var input shared.UpdateIngotInput
	if err := json.Unmarshal([]byte(req.Body), &input); err != nil {
		return shared.BadRequest("invalid request body")
	}

	// Build update expression dynamically
	expr := "SET #updatedAt = :updatedAt"
	names := map[string]string{"#updatedAt": "updatedAt", "#owner": "owner"}
	values := map[string]types.AttributeValue{
		":updatedAt": &types.AttributeValueMemberS{Value: shared.NowISO()},
		":owner":     &types.AttributeValueMemberS{Value: owner},
	}

	if input.Name != nil {
		expr += ", #name = :name"
		names["#name"] = "name"
		values[":name"] = &types.AttributeValueMemberS{Value: *input.Name}
	}
	if input.Type != nil {
		expr += ", #type = :type"
		names["#type"] = "type"
		values[":type"] = &types.AttributeValueMemberS{Value: *input.Type}
	}
	if input.Content != nil {
		expr += ", #content = :content"
		names["#content"] = "content"
		values[":content"] = &types.AttributeValueMemberS{Value: *input.Content}
	}

	result, err := db.UpdateItem(ctx, &dynamodb.UpdateItemInput{
		TableName: shared.StringPtr(tableName()),
		Key: map[string]types.AttributeValue{
			"id": &types.AttributeValueMemberS{Value: id},
		},
		UpdateExpression:          aws.String(expr),
		ExpressionAttributeNames:  names,
		ExpressionAttributeValues: values,
		ConditionExpression:       aws.String("#owner = :owner"),
		ReturnValues:              types.ReturnValueAllNew,
	})
	if err != nil {
		return shared.Forbidden("ingot not found or access denied")
	}

	var ingot shared.Ingot
	if err := attributevalue.UnmarshalMap(result.Attributes, &ingot); err != nil {
		return shared.InternalError("failed to unmarshal updated ingot")
	}

	return shared.Success(ingot)
}
