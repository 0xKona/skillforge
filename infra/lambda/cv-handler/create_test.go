package main

import (
	"context"
	"net/http"
	"testing"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func TestCreate_Success(t *testing.T) {
	var capturedItem map[string]types.AttributeValue
	db = &mockDB{
		putItemFunc: func(ctx context.Context, params *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
			capturedItem = params.Item
			return &dynamodb.PutItemOutput{}, nil
		},
	}

	req := makeRequest("POST", nil, `{"title":"My CV","version":1,"cvContent":"{\"sections\":[{\"id\":\"section-1\"}]}"}`, "user-123")
	resp, err := create(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusCreated {
		t.Errorf("expected 201, got %d", resp.StatusCode)
	}
	content, ok := capturedItem["cvContent"].(*types.AttributeValueMemberS)
	if !ok {
		t.Fatal("expected cvContent to be stored as a string")
	}
	if content.Value != `{"sections":[{"id":"section-1"}]}` {
		t.Errorf("unexpected cvContent: %s", content.Value)
	}
}

func TestCreate_MissingTitle(t *testing.T) {
	req := makeRequest("POST", nil, `{"version":1}`, "user-123")
	resp, err := create(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", resp.StatusCode)
	}
}

func TestCreate_InvalidJSON(t *testing.T) {
	req := makeRequest("POST", nil, `not json`, "user-123")
	resp, err := create(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", resp.StatusCode)
	}
}

func TestCreate_DynamoError(t *testing.T) {
	db = &mockDB{
		putItemFunc: func(ctx context.Context, params *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
			return nil, errDynamo
		},
	}

	req := makeRequest("POST", nil, `{"title":"My CV","version":1}`, "user-123")
	resp, err := create(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusInternalServerError {
		t.Errorf("expected 500, got %d", resp.StatusCode)
	}
}
