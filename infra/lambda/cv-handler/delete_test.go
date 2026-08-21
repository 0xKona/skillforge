package main

import (
	"context"
	"net/http"
	"testing"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

func TestDelete_Success(t *testing.T) {
	db = &mockDB{
		deleteItemFunc: func(ctx context.Context, params *dynamodb.DeleteItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.DeleteItemOutput, error) {
			return &dynamodb.DeleteItemOutput{
				Attributes: mockCVItem("cv-1", "user-123", "Deleted CV"),
			}, nil
		},
	}

	req := makeRequest("DELETE", map[string]string{"id": "cv-1"}, "", "user-123")
	resp, err := remove(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}
}

func TestDelete_Forbidden_WrongOwner(t *testing.T) {
	db = &mockDB{
		deleteItemFunc: func(ctx context.Context, params *dynamodb.DeleteItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.DeleteItemOutput, error) {
			return nil, errConditionalCheck
		},
	}

	req := makeRequest("DELETE", map[string]string{"id": "cv-1"}, "", "user-123")
	resp, err := remove(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusForbidden {
		t.Errorf("expected 403, got %d", resp.StatusCode)
	}
}

func TestDelete_MissingID(t *testing.T) {
	req := makeRequest("DELETE", map[string]string{}, "", "user-123")
	resp, err := remove(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", resp.StatusCode)
	}
}
