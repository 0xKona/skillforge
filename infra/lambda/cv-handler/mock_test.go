package main

import (
	"context"
	"errors"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

// mockDB implements shared.DynamoAPI for testing.
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

// Helper to create a request with auth claims
func authedRequest(method, body string, pathParams map[string]string, queryParams map[string]string) testRequest {
	return testRequest{
		method:      method,
		body:        body,
		pathParams:  pathParams,
		queryParams: queryParams,
		owner:       "user-123",
	}
}

type testRequest struct {
	method      string
	body        string
	pathParams  map[string]string
	queryParams map[string]string
	owner       string
}

// mockItem returns a DynamoDB item map for a CV.
func mockCVItem(id, owner, title string) map[string]types.AttributeValue {
	return map[string]types.AttributeValue{
		"id":        &types.AttributeValueMemberS{Value: id},
		"owner":     &types.AttributeValueMemberS{Value: owner},
		"title":     &types.AttributeValueMemberS{Value: title},
		"version":   &types.AttributeValueMemberN{Value: "1"},
		"createdAt": &types.AttributeValueMemberS{Value: "2025-01-01T00:00:00Z"},
		"updatedAt": &types.AttributeValueMemberS{Value: "2025-01-01T00:00:00Z"},
	}
}

var errConditionalCheck = &types.ConditionalCheckFailedException{
	Message: strPtr("condition not met"),
}

func strPtr(s string) *string { return &s }

var errDynamo = errors.New("dynamodb error")
