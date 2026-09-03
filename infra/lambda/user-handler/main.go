package main

import (
	"context"

	"github.com/0xKona/skillforge/infra/lambda/shared"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentity"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	switch req.HTTPMethod {
	case "OPTIONS":
		return shared.Success(nil)
	case "DELETE":
		return deleteUserData(ctx, req)
	default:
		return shared.MethodNotAllowed()
	}
}

func main() {
	db = shared.DynamoClient()

	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		panic("unable to load AWS config: " + err.Error())
	}
	identity = cognitoidentity.NewFromConfig(cfg)
	s3c = s3.NewFromConfig(cfg)
	idp = cognitoidentityprovider.NewFromConfig(cfg)

	lambda.Start(handler)
}
