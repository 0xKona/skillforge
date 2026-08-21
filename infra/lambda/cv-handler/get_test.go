package main

import (
	"context"
	"net/http"
	"testing"

	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

func TestGet_Success(t *testing.T) {
	db = &mockDB{
		getItemFunc: func(ctx context.Context, params *dynamodb.GetItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error) {
			return &dynamodb.GetItemOutput{
				Item: mockCVItem("cv-1", "user-123", "Test CV"),
			}, nil
		},
	}

	req := makeRequest("GET", map[string]string{"id": "cv-1"}, "", "user-123")
	resp, err := get(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}
}

func TestGet_NotFound(t *testing.T) {
	db = &mockDB{
		getItemFunc: func(ctx context.Context, params *dynamodb.GetItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error) {
			return &dynamodb.GetItemOutput{Item: nil}, nil
		},
	}

	req := makeRequest("GET", map[string]string{"id": "cv-999"}, "", "user-123")
	resp, err := get(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusNotFound {
		t.Errorf("expected 404, got %d", resp.StatusCode)
	}
}

func TestGet_Forbidden_WrongOwner(t *testing.T) {
	db = &mockDB{
		getItemFunc: func(ctx context.Context, params *dynamodb.GetItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error) {
			return &dynamodb.GetItemOutput{
				Item: mockCVItem("cv-1", "other-user", "Their CV"),
			}, nil
		},
	}

	req := makeRequest("GET", map[string]string{"id": "cv-1"}, "", "user-123")
	resp, err := get(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusForbidden {
		t.Errorf("expected 403, got %d", resp.StatusCode)
	}
}

func TestGet_MissingID(t *testing.T) {
	req := makeRequest("GET", map[string]string{}, "", "user-123")
	resp, err := get(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", resp.StatusCode)
	}
}
