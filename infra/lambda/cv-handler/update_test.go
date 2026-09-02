package main

import (
	"context"
	"net/http"
	"testing"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func TestUpdate_PersistsCvContent(t *testing.T) {
	var capturedInput *dynamodb.UpdateItemInput
	db = &mockDB{
		updateItemFunc: func(ctx context.Context, params *dynamodb.UpdateItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.UpdateItemOutput, error) {
			capturedInput = params
			return &dynamodb.UpdateItemOutput{
				Attributes: mockCVItem("cv-1", "user-123", "Updated CV"),
			}, nil
		},
	}

	req := makeRequest(
		"PUT",
		map[string]string{"id": "cv-1"},
		`{"title":"Updated CV","version":2,"cvContent":"{\"sections\":[{\"id\":\"section-1\"}]}"}`,
		"user-123",
	)
	resp, err := update(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}
	if capturedInput == nil {
		t.Fatal("expected UpdateItemInput to be captured")
	}
	content, ok := capturedInput.ExpressionAttributeValues[":cvContent"].(*types.AttributeValueMemberS)
	if !ok {
		t.Fatal("expected cvContent update value to be a string")
	}
	if content.Value != `{"sections":[{"id":"section-1"}]}` {
		t.Errorf("unexpected cvContent: %s", content.Value)
	}
}
