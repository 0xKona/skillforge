package main

import (
	"context"
	"errors"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func init() {
	os.Setenv("TABLE_NAME", "test-ingot-table")
	db = &mockDB{}
}

type mockDB struct {
	putItemFunc    func(ctx context.Context, params *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error)
	getItemFunc    func(ctx context.Context, params *dynamodb.GetItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error)
	deleteItemFunc func(ctx context.Context, params *dynamodb.DeleteItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.DeleteItemOutput, error)
	updateItemFunc func(ctx context.Context, params *dynamodb.UpdateItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.UpdateItemOutput, error)
	queryFunc      func(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error)
}

func (m *mockDB) PutItem(ctx context.Context, params *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
	if m.putItemFunc != nil {
		return m.putItemFunc(ctx, params, optFns...)
	}
	return &dynamodb.PutItemOutput{}, nil
}

func (m *mockDB) GetItem(ctx context.Context, params *dynamodb.GetItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error) {
	if m.getItemFunc != nil {
		return m.getItemFunc(ctx, params, optFns...)
	}
	return &dynamodb.GetItemOutput{}, nil
}

func (m *mockDB) DeleteItem(ctx context.Context, params *dynamodb.DeleteItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.DeleteItemOutput, error) {
	if m.deleteItemFunc != nil {
		return m.deleteItemFunc(ctx, params, optFns...)
	}
	return &dynamodb.DeleteItemOutput{}, nil
}

func (m *mockDB) UpdateItem(ctx context.Context, params *dynamodb.UpdateItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.UpdateItemOutput, error) {
	if m.updateItemFunc != nil {
		return m.updateItemFunc(ctx, params, optFns...)
	}
	return &dynamodb.UpdateItemOutput{}, nil
}

func (m *mockDB) Query(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
	if m.queryFunc != nil {
		return m.queryFunc(ctx, params, optFns...)
	}
	return &dynamodb.QueryOutput{}, nil
}

func mockIngotItem(id, owner, name, ingotType string) map[string]types.AttributeValue {
	return map[string]types.AttributeValue{
		"id":        &types.AttributeValueMemberS{Value: id},
		"owner":     &types.AttributeValueMemberS{Value: owner},
		"name":      &types.AttributeValueMemberS{Value: name},
		"type":      &types.AttributeValueMemberS{Value: ingotType},
		"createdAt": &types.AttributeValueMemberS{Value: "2025-01-01T00:00:00Z"},
		"updatedAt": &types.AttributeValueMemberS{Value: "2025-01-01T00:00:00Z"},
	}
}

var errConditionalCheck = &types.ConditionalCheckFailedException{
	Message: strPtr("condition not met"),
}

func strPtr(s string) *string { return &s }

var errDynamo = errors.New("dynamodb error")

func makeRequest(method string, pathParams map[string]string, body string, owner string) events.APIGatewayProxyRequest {
	authorizer := map[string]interface{}{}
	if owner != "" {
		authorizer["claims"] = map[string]interface{}{
			"sub": owner,
		}
	}
	return events.APIGatewayProxyRequest{
		HTTPMethod:           method,
		PathParameters:       pathParams,
		Body:                 body,
		QueryStringParameters: map[string]string{},
		RequestContext: events.APIGatewayProxyRequestContext{
			Authorizer: authorizer,
		},
	}
}
