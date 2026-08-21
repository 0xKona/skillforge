package main

import (
	"context"
	"net/http"
	"os"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func init() {
	os.Setenv("TABLE_NAME", "test-cv-table")
	db = &mockDB{}
}

func makeRequest(method string, pathParams map[string]string, body string, owner string) events.APIGatewayProxyRequest {
	authorizer := map[string]interface{}{}
	if owner != "" {
		authorizer["claims"] = map[string]interface{}{
			"sub": owner,
		}
	}
	return events.APIGatewayProxyRequest{
		HTTPMethod:     method,
		PathParameters: pathParams,
		Body:           body,
		RequestContext: events.APIGatewayProxyRequestContext{
			Authorizer: authorizer,
		},
	}
}

func TestHandler_MethodNotAllowed(t *testing.T) {
	req := makeRequest("PATCH", nil, "", "user-123")
	resp, err := handler(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusMethodNotAllowed {
		t.Errorf("expected 405, got %d", resp.StatusCode)
	}
}

func TestHandler_OPTIONS(t *testing.T) {
	req := makeRequest("OPTIONS", nil, "", "")
	resp, err := handler(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}
}

func TestHandler_POST_RoutesToCreate(t *testing.T) {
	db = &mockDB{
		putItemFunc: func(ctx context.Context, params *dynamodb.PutItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.PutItemOutput, error) {
			return &dynamodb.PutItemOutput{}, nil
		},
	}

	req := makeRequest("POST", nil, `{"title":"Test CV","version":1}`, "user-123")
	resp, err := handler(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusCreated {
		t.Errorf("expected 201, got %d", resp.StatusCode)
	}
}

func TestHandler_GET_WithID_RoutesToGet(t *testing.T) {
	db = &mockDB{
		getItemFunc: func(ctx context.Context, params *dynamodb.GetItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.GetItemOutput, error) {
			return &dynamodb.GetItemOutput{
				Item: mockCVItem("cv-1", "user-123", "Test CV"),
			}, nil
		},
	}

	req := makeRequest("GET", map[string]string{"id": "cv-1"}, "", "user-123")
	resp, err := handler(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}
}

func TestHandler_GET_WithoutID_RoutesToList(t *testing.T) {
	db = &mockDB{
		queryFunc: func(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
			return &dynamodb.QueryOutput{Items: []map[string]types.AttributeValue{}}, nil
		},
	}

	req := makeRequest("GET", nil, "", "user-123")
	resp, err := handler(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}
}

func TestHandler_Unauthorized_NoAuth(t *testing.T) {
	req := makeRequest("POST", nil, `{"title":"Test","version":1}`, "")
	resp, err := handler(context.Background(), req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("expected 401, got %d", resp.StatusCode)
	}
}
