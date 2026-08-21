package main

import (
	"context"
	"encoding/json"

	"github.com/0xKona/skillforge/infra/lambda/shared"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/google/uuid"
)

func create(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	owner, err := shared.GetOwner(req)
	if err != nil {
		return shared.Unauthorized("unable to identify user")
	}

	var input shared.CreateCVInput
	if err := json.Unmarshal([]byte(req.Body), &input); err != nil {
		return shared.BadRequest("invalid request body")
	}

	if input.Title == "" {
		return shared.BadRequest("title is required")
	}

	now := shared.NowISO()
	cv := shared.CV{
		ID:          uuid.New().String(),
		Title:       input.Title,
		Description: input.Description,
		Version:     input.Version,
		CvContent:   input.CvContent,
		Owner:       owner,
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	item, err := attributevalue.MarshalMap(cv)
	if err != nil {
		return shared.InternalError("failed to marshal item")
	}

	_, err = shared.DynamoClient().PutItem(ctx, &dynamodb.PutItemInput{
		TableName: shared.StringPtr(tableName()),
		Item:      item,
	})
	if err != nil {
		return shared.InternalError("failed to create CV")
	}

	return shared.Created(cv)
}
