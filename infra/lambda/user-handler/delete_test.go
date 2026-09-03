package main

import (
	"context"
	"errors"
	"net/http"
	"strconv"
	"testing"

	"github.com/aws/aws-sdk-go-v2/service/cognitoidentity"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	cidpTypes "github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider/types"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func TestHandler_Unauthorized(t *testing.T) {
	db = &mockDB{}
	idp = &mockCognito{}
	identity = &mockIdentity{}
	s3c = &mockS3{}

	resp, err := handler(context.Background(), makeRequest("DELETE", "", ""))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("expected 401, got %d", resp.StatusCode)
	}
}

func TestHandler_OPTIONS(t *testing.T) {
	resp, err := handler(context.Background(), makeRequest("OPTIONS", "", ""))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}
}

func TestHandler_MethodNotAllowed(t *testing.T) {
	resp, err := handler(context.Background(), makeRequest("GET", "user-123", "ada"))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusMethodNotAllowed {
		t.Errorf("expected 405, got %d", resp.StatusCode)
	}
}

func TestDeleteUserData_EmptyAccount(t *testing.T) {
	db = &mockDB{
		queryFunc: func(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
			return &dynamodb.QueryOutput{Items: nil}, nil
		},
	}
	idp = &mockCognito{}
	identity = &mockIdentity{getIdFunc: func(ctx context.Context, params *cognitoidentity.GetIdInput, optFns ...func(*cognitoidentity.Options)) (*cognitoidentity.GetIdOutput, error) {
		return nil, errors.New("no identity")
	}}
	s3c = &mockS3{}

	resp, err := handler(context.Background(), makeRequest("DELETE", "user-123", "ada@example.com"))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d body=%s", resp.StatusCode, resp.Body)
	}
}

func TestDeleteUserData_DeletesOwnedItemsOnly(t *testing.T) {
	var queriedOwners []string
	var deleted []string

	db = &mockDB{
		queryFunc: func(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
			owner := params.ExpressionAttributeValues[":owner"].(*types.AttributeValueMemberS).Value
			queriedOwners = append(queriedOwners, owner)
			if *params.TableName == "test-cv-table" {
				return &dynamodb.QueryOutput{Items: []map[string]types.AttributeValue{idItem("cv-1"), idItem("cv-2")}}, nil
			}
			return &dynamodb.QueryOutput{Items: []map[string]types.AttributeValue{idItem("ingot-1")}}, nil
		},
		batchWriteItemFunc: func(ctx context.Context, params *dynamodb.BatchWriteItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.BatchWriteItemOutput, error) {
			for _, reqs := range params.RequestItems {
				for _, req := range reqs {
					id := req.DeleteRequest.Key["id"].(*types.AttributeValueMemberS).Value
					deleted = append(deleted, id)
				}
			}
			return &dynamodb.BatchWriteItemOutput{}, nil
		},
	}
	idp = &mockCognito{}
	identity = &mockIdentity{getIdFunc: func(ctx context.Context, params *cognitoidentity.GetIdInput, optFns ...func(*cognitoidentity.Options)) (*cognitoidentity.GetIdOutput, error) {
		return nil, errors.New("skip s3")
	}}
	s3c = &mockS3{}

	resp, err := handler(context.Background(), makeRequest("DELETE", "user-123", "ada@example.com"))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d body=%s", resp.StatusCode, resp.Body)
	}
	if len(queriedOwners) != 2 {
		t.Fatalf("expected 2 owner queries, got %d", len(queriedOwners))
	}
	for _, owner := range queriedOwners {
		if owner != "user-123" {
			t.Errorf("queried unexpected owner %s", owner)
		}
	}
	if len(deleted) != 3 {
		t.Fatalf("expected 3 deletes, got %v", deleted)
	}
}

func TestDeleteUserData_BatchesOver25(t *testing.T) {
	items := make([]map[string]types.AttributeValue, 26)
	for i := 0; i < 26; i++ {
		items[i] = idItem("cv-" + strconv.Itoa(i))
	}
	batchCalls := 0

	db = &mockDB{
		queryFunc: func(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error) {
			if *params.TableName == "test-cv-table" {
				return &dynamodb.QueryOutput{Items: items}, nil
			}
			return &dynamodb.QueryOutput{}, nil
		},
		batchWriteItemFunc: func(ctx context.Context, params *dynamodb.BatchWriteItemInput, optFns ...func(*dynamodb.Options)) (*dynamodb.BatchWriteItemOutput, error) {
			batchCalls++
			return &dynamodb.BatchWriteItemOutput{}, nil
		},
	}
	idp = &mockCognito{}
	identity = &mockIdentity{getIdFunc: func(ctx context.Context, params *cognitoidentity.GetIdInput, optFns ...func(*cognitoidentity.Options)) (*cognitoidentity.GetIdOutput, error) {
		return nil, errors.New("skip s3")
	}}
	s3c = &mockS3{}

	resp, err := handler(context.Background(), makeRequest("DELETE", "user-123", "ada"))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}
	if batchCalls != 2 {
		t.Errorf("expected 2 batch writes for 26 items, got %d", batchCalls)
	}
}

func TestDeleteUserData_CognitoUserNotFoundIsSuccess(t *testing.T) {
	db = &mockDB{}
	idp = &mockCognito{
		deleteFunc: func(ctx context.Context, params *cognitoidentityprovider.AdminDeleteUserInput, optFns ...func(*cognitoidentityprovider.Options)) (*cognitoidentityprovider.AdminDeleteUserOutput, error) {
			return nil, &cidpTypes.UserNotFoundException{Message: awsString("missing")}
		},
	}
	identity = &mockIdentity{getIdFunc: func(ctx context.Context, params *cognitoidentity.GetIdInput, optFns ...func(*cognitoidentity.Options)) (*cognitoidentity.GetIdOutput, error) {
		return nil, errors.New("skip s3")
	}}
	s3c = &mockS3{}

	resp, err := handler(context.Background(), makeRequest("DELETE", "user-123", "ada"))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d body=%s", resp.StatusCode, resp.Body)
	}
}

func TestDeleteUserData_S3FailureDoesNotFailRequest(t *testing.T) {
	db = &mockDB{}
	idp = &mockCognito{}
	identity = &mockIdentity{getIdFunc: func(ctx context.Context, params *cognitoidentity.GetIdInput, optFns ...func(*cognitoidentity.Options)) (*cognitoidentity.GetIdOutput, error) {
		return nil, errors.New("identity boom")
	}}
	s3c = &mockS3{}

	resp, err := handler(context.Background(), makeRequest("DELETE", "user-123", "ada"))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}
}

func awsString(s string) *string { return &s }
