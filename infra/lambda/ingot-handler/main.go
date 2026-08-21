package main

import (
	"context"

	"github.com/0xKona/skillforge/infra/lambda/shared"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	switch req.HTTPMethod {
	case "OPTIONS":
		return shared.Success(nil)
	case "POST":
		return create(ctx, req)
	case "GET":
		if id := req.PathParameters["id"]; id != "" {
			return get(ctx, req)
		}
		return list(ctx, req)
	case "PUT":
		return update(ctx, req)
	case "DELETE":
		return remove(ctx, req)
	default:
		return shared.MethodNotAllowed()
	}
}

func main() {
	lambda.Start(handler)
}
