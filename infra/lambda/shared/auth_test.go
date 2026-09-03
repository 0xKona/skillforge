package shared

import (
	"testing"

	"github.com/aws/aws-lambda-go/events"
)

func TestGetOwner_ValidClaims(t *testing.T) {
	req := events.APIGatewayProxyRequest{
		RequestContext: events.APIGatewayProxyRequestContext{
			Authorizer: map[string]interface{}{
				"claims": map[string]interface{}{
					"sub":   "user-123-abc",
					"email": "test@example.com",
				},
			},
		},
	}

	owner, err := GetOwner(req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if owner != "user-123-abc" {
		t.Errorf("expected owner 'user-123-abc', got '%s'", owner)
	}
}

func TestGetOwner_MissingClaims(t *testing.T) {
	req := events.APIGatewayProxyRequest{
		RequestContext: events.APIGatewayProxyRequestContext{
			Authorizer: map[string]interface{}{},
		},
	}

	_, err := GetOwner(req)
	if err == nil {
		t.Fatal("expected error for missing claims, got nil")
	}
}

func TestGetOwner_MissingSub(t *testing.T) {
	req := events.APIGatewayProxyRequest{
		RequestContext: events.APIGatewayProxyRequestContext{
			Authorizer: map[string]interface{}{
				"claims": map[string]interface{}{
					"email": "test@example.com",
				},
			},
		},
	}

	_, err := GetOwner(req)
	if err == nil {
		t.Fatal("expected error for missing sub, got nil")
	}
}

func TestGetOwner_EmptySub(t *testing.T) {
	req := events.APIGatewayProxyRequest{
		RequestContext: events.APIGatewayProxyRequestContext{
			Authorizer: map[string]interface{}{
				"claims": map[string]interface{}{
					"sub": "",
				},
			},
		},
	}

	_, err := GetOwner(req)
	if err == nil {
		t.Fatal("expected error for empty sub, got nil")
	}
}

func TestGetUsername_PrefersCognitoUsername(t *testing.T) {
	req := events.APIGatewayProxyRequest{
		RequestContext: events.APIGatewayProxyRequestContext{
			Authorizer: map[string]interface{}{
				"claims": map[string]interface{}{
					"cognito:username": "ada@example.com",
					"email":            "other@example.com",
				},
			},
		},
	}

	username, err := GetUsername(req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if username != "ada@example.com" {
		t.Errorf("expected cognito username, got %s", username)
	}
}

func TestGetUsername_FallsBackToEmail(t *testing.T) {
	req := events.APIGatewayProxyRequest{
		RequestContext: events.APIGatewayProxyRequestContext{
			Authorizer: map[string]interface{}{
				"claims": map[string]interface{}{
					"email": "ada@example.com",
				},
			},
		},
	}

	username, err := GetUsername(req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if username != "ada@example.com" {
		t.Errorf("expected email fallback, got %s", username)
	}
}

func TestBearerToken(t *testing.T) {
	req := events.APIGatewayProxyRequest{
		Headers: map[string]string{
			"Authorization": "Bearer abc.def.ghi",
		},
	}
	if got := BearerToken(req); got != "abc.def.ghi" {
		t.Errorf("expected stripped token, got %s", got)
	}
}

func TestGetOwner_ClaimsWrongType(t *testing.T) {
	req := events.APIGatewayProxyRequest{
		RequestContext: events.APIGatewayProxyRequestContext{
			Authorizer: map[string]interface{}{
				"claims": "not-a-map",
			},
		},
	}

	_, err := GetOwner(req)
	if err == nil {
		t.Fatal("expected error for malformed claims, got nil")
	}
}
