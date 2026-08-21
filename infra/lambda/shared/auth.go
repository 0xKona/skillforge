package shared

import (
	"errors"

	"github.com/aws/aws-lambda-go/events"
)

// GetOwner extracts the authenticated user's sub (unique ID) from the
// API Gateway request context. This is populated by the Cognito authorizer.
func GetOwner(req events.APIGatewayProxyRequest) (string, error) {
	claims, ok := req.RequestContext.Authorizer["claims"]
	if !ok {
		return "", errors.New("no claims in request context")
	}

	claimsMap, ok := claims.(map[string]interface{})
	if !ok {
		return "", errors.New("claims is not a map")
	}

	sub, ok := claimsMap["sub"].(string)
	if !ok || sub == "" {
		return "", errors.New("sub claim not found")
	}

	return sub, nil
}
