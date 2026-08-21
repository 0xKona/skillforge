package main

import (
	"context"
	"encoding/json"
	"fmt"

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

	var input shared.UpdateCVInput
	if err := json.Unmarshal([]byte(req.Body), &input); err != nil {
		return shared.BadRequest("invalid request body")
	}

	// Build update expression dynamically
	expr := "SET #updatedAt = :updatedAt"
	names := map[string]string{"#updatedAt": "updatedAt"}
	values := map[string]types.AttributeValue{
		":updatedAt": &types.AttributeValueMemberS{Value: shared.NowISO()},
		":owner":     &types.AttributeValueMemberS{Value: owner},
	}

	if input.Title != nil {
		expr += ", #title = :title"
		names["#title"] = "title"
		values[":title"] = &types.AttributeValueMemberS{Value: *input.Title}
	}
	if input.Description != nil {
		expr += ", #description = :description"
		names["#description"] = "description"
		values[":description"] = &types.AttributeValueMemberS{Value: *input.Description}
	}
	if input.Version != nil {
		expr += ", #version = :version"
		names["#version"] = "version"
		values[":version"] = &types.AttributeValueMemberN{Value: fmt.Sprintf("%d", *input.Version)}
	}
	if input.CvContent != nil {
		expr += ", #cvContent = :cvContent"
		names["#cvContent"] = "cvContent"
		values[":cvContent"] = &types.AttributeValueMemberS{Value: *input.CvContent}
	}

	result, err := shared.DynamoClient().UpdateItem(ctx, &dynamodb.UpdateItemInput{
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
		return shared.Forbidden("CV not found or access denied")
	}

	var cv shared.CV
	if err := attributevalue.UnmarshalMap(result.Attributes, &cv); err != nil {
		return shared.InternalError("failed to unmarshal updated CV")
	}

	return shared.Success(cv)
}
