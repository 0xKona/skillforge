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

	var result struct {
		Items []json.RawMessage `json:"items"`
	}
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
					mockIngotItem("ing-1", "user-123", "Education", "ingot_education"),
					mockIngotItem("ing-2", "user-123", "Skills", "ingot_skill"),
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

	var result struct {
		Items []json.RawMessage `json:"items"`
	}
	json.Unmarshal([]byte(resp.Body), &result)
	if len(result.Items) != 2 {
		t.Errorf("expected 2 items, got %d", len(result.Items))
	}
}

func TestList_WithTypeFilter(t *testing.T) {
	var capturedIndex *string
	db = &mockDB{
		queryFunc: func(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
			capturedIndex = params.IndexName
			return &dynamodb.QueryOutput{
				Items: []map[string]types.AttributeValue{},
			}, nil
		},
	}

	req := events.APIGatewayProxyRequest{
		HTTPMethod:            "GET",
		QueryStringParameters: map[string]string{"type": "ingot_education"},
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

	if capturedIndex == nil || *capturedIndex != "by-owner-type" {
		t.Errorf("expected by-owner-type GSI to be used, got %v", capturedIndex)
	}
}

func TestList_WithNextToken(t *testing.T) {
	var capturedStartKey map[string]types.AttributeValue
	db = &mockDB{
		queryFunc: func(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
			capturedStartKey = params.ExclusiveStartKey
			return &dynamodb.QueryOutput{
				Items: []map[string]types.AttributeValue{},
			}, nil
		},
	}

	req := events.APIGatewayProxyRequest{
		HTTPMethod:            "GET",
		QueryStringParameters: map[string]string{"nextToken": "ing-5"},
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

	if capturedStartKey == nil {
		t.Fatal("expected ExclusiveStartKey to be set")
	}
	if v, ok := capturedStartKey["id"].(*types.AttributeValueMemberS); !ok || v.Value != "ing-5" {
		t.Errorf("expected ExclusiveStartKey id 'ing-5', got %v", capturedStartKey["id"])
	}
}

func TestList_ReturnsNextToken(t *testing.T) {
	db = &mockDB{
		queryFunc: func(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
			return &dynamodb.QueryOutput{
				Items: []map[string]types.AttributeValue{
					mockIngotItem("ing-1", "user-123", "Education", "ingot_education"),
				},
				LastEvaluatedKey: map[string]types.AttributeValue{
					"id":    &types.AttributeValueMemberS{Value: "ing-1"},
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
	if *result.NextToken != "ing-1" {
		t.Errorf("expected nextToken 'ing-1', got '%s'", *result.NextToken)
	}
}

func TestList_WithFieldsFilter(t *testing.T) {
	db = &mockDB{
		queryFunc: func(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
			return &dynamodb.QueryOutput{
				Items: []map[string]types.AttributeValue{
					mockIngotItem("ing-1", "user-123", "Education", "ingot_education"),
				},
			}, nil
		},
	}

	req := events.APIGatewayProxyRequest{
		HTTPMethod:            "GET",
		QueryStringParameters: map[string]string{"fields": "id,name,type,updatedAt"},
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

	// Verify the response only contains the requested fields
	var raw map[string]json.RawMessage
	json.Unmarshal([]byte(resp.Body), &raw)

	var items []map[string]interface{}
	json.Unmarshal(raw["items"], &items)

	if len(items) != 1 {
		t.Fatalf("expected 1 item, got %d", len(items))
	}

	item := items[0]
	// Should have the requested fields
	if _, ok := item["id"]; !ok {
		t.Error("expected 'id' field")
	}
	if _, ok := item["name"]; !ok {
		t.Error("expected 'name' field")
	}
	if _, ok := item["type"]; !ok {
		t.Error("expected 'type' field")
	}
	if _, ok := item["updatedAt"]; !ok {
		t.Error("expected 'updatedAt' field")
	}
	// Should NOT have content or owner (not in fields param)
	if _, ok := item["content"]; ok {
		t.Error("expected 'content' field to be excluded")
	}
	if _, ok := item["owner"]; ok {
		t.Error("expected 'owner' field to be excluded")
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
