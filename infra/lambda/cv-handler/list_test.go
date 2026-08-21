package main

import (
	"context"
	"encoding/json"
	"net/http"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func TestList_Success_EmptyResults(t *testing.T) {
	db = &mockDB{
		queryFunc: func(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
			return &dynamodb.QueryOutput{
				Items: []map[string]types.AttributeValue{},
			}, nil
		},
	}

	req := makeRequest("GET", nil, "", "user-123")
	resp, err := list(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}

	var result listResponse
	json.Unmarshal([]byte(resp.Body), &result)
	if len(result.Items) != 0 {
		t.Errorf("expected 0 items, got %d", len(result.Items))
	}
}

func TestList_Success_WithItems(t *testing.T) {
	db = &mockDB{
		queryFunc: func(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
			return &dynamodb.QueryOutput{
				Items: []map[string]types.AttributeValue{
					mockCVItem("cv-1", "user-123", "CV One"),
					mockCVItem("cv-2", "user-123", "CV Two"),
				},
			}, nil
		},
	}

	req := makeRequest("GET", nil, "", "user-123")
	resp, err := list(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}

	var result listResponse
	json.Unmarshal([]byte(resp.Body), &result)
	if len(result.Items) != 2 {
		t.Errorf("expected 2 items, got %d", len(result.Items))
	}
}

func TestList_WithNextToken(t *testing.T) {
	var capturedStartKey map[string]types.AttributeValue
	db = &mockDB{
		queryFunc: func(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
			capturedStartKey = params.ExclusiveStartKey
			return &dynamodb.QueryOutput{
				Items: []map[string]types.AttributeValue{
					mockCVItem("cv-3", "user-123", "CV Three"),
				},
			}, nil
		},
	}

	req := events.APIGatewayProxyRequest{
		HTTPMethod:            "GET",
		QueryStringParameters: map[string]string{"nextToken": "cv-2"},
		RequestContext: events.APIGatewayProxyRequestContext{
			Authorizer: map[string]interface{}{
				"claims": map[string]interface{}{"sub": "user-123"},
			},
		},
	}

	resp, err := list(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}

	// Verify the ExclusiveStartKey was set from the nextToken
	if capturedStartKey == nil {
		t.Fatal("expected ExclusiveStartKey to be set")
	}
	if v, ok := capturedStartKey["id"].(*types.AttributeValueMemberS); !ok || v.Value != "cv-2" {
		t.Errorf("expected ExclusiveStartKey id to be 'cv-2', got %v", capturedStartKey["id"])
	}
}

func TestList_ReturnsNextToken(t *testing.T) {
	db = &mockDB{
		queryFunc: func(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
			return &dynamodb.QueryOutput{
				Items: []map[string]types.AttributeValue{
					mockCVItem("cv-1", "user-123", "CV One"),
				},
				LastEvaluatedKey: map[string]types.AttributeValue{
					"id":    &types.AttributeValueMemberS{Value: "cv-1"},
					"owner": &types.AttributeValueMemberS{Value: "user-123"},
				},
			}, nil
		},
	}

	req := makeRequest("GET", nil, "", "user-123")
	resp, err := list(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	var result listResponse
	json.Unmarshal([]byte(resp.Body), &result)
	if result.NextToken == nil {
		t.Fatal("expected nextToken to be present")
	}
	if *result.NextToken != "cv-1" {
		t.Errorf("expected nextToken 'cv-1', got '%s'", *result.NextToken)
	}
}

func TestList_DynamoError(t *testing.T) {
	db = &mockDB{
		queryFunc: func(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
			return nil, errDynamo
		},
	}

	req := makeRequest("GET", nil, "", "user-123")
	resp, err := list(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusInternalServerError {
		t.Errorf("expected 500, got %d", resp.StatusCode)
	}
}
