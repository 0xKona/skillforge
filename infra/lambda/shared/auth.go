package shared

import (
	"errors"
	"strings"

	"github.com/aws/aws-lambda-go/events"
)

func claimsMap(req events.APIGatewayProxyRequest) (map[string]interface{}, error) {
	if req.RequestContext.Authorizer == nil {
		return nil, errors.New("no claims in request context")
	}
	claims, ok := req.RequestContext.Authorizer["claims"]
	if !ok {
		return nil, errors.New("no claims in request context")
	}

	mapped, ok := claims.(map[string]interface{})
	if !ok {
		return nil, errors.New("claims is not a map")
	}
	return mapped, nil
}

func getClaim(req events.APIGatewayProxyRequest, key string) (string, error) {
	claims, err := claimsMap(req)
	if err != nil {
		return "", err
	}
	value, ok := claims[key].(string)
	if !ok || value == "" {
		return "", errors.New(key + " claim not found")
	}
	return value, nil
}

// GetOwner extracts the authenticated user's sub (unique ID) from the
// API Gateway request context. This is populated by the Cognito authorizer.
func GetOwner(req events.APIGatewayProxyRequest) (string, error) {
	return getClaim(req, "sub")
}

// GetUsername returns the Cognito username, falling back to email.
func GetUsername(req events.APIGatewayProxyRequest) (string, error) {
	if username, err := getClaim(req, "cognito:username"); err == nil {
		return username, nil
	}
	return getClaim(req, "email")
}

// BearerToken returns the raw ID token from the Authorization header.
func BearerToken(req events.APIGatewayProxyRequest) string {
	header := req.Headers["Authorization"]
	if header == "" {
		header = req.Headers["authorization"]
	}
	return strings.TrimPrefix(header, "Bearer ")
}
