package shared

import (
	"encoding/json"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
)

var corsHeaders = map[string]string{
	"Access-Control-Allow-Origin":  "*",
	"Access-Control-Allow-Headers": "Content-Type,Authorization",
	"Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
	"Content-Type":                 "application/json",
}

// Success returns a 200 response with a JSON body.
func Success(body interface{}) (events.APIGatewayProxyResponse, error) {
	data, err := json.Marshal(body)
	if err != nil {
		return InternalError("failed to marshal response")
	}
	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Headers:    corsHeaders,
		Body:       string(data),
	}, nil
}

// Created returns a 201 response with a JSON body.
func Created(body interface{}) (events.APIGatewayProxyResponse, error) {
	data, err := json.Marshal(body)
	if err != nil {
		return InternalError("failed to marshal response")
	}
	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusCreated,
		Headers:    corsHeaders,
		Body:       string(data),
	}, nil
}

// BadRequest returns a 400 response.
func BadRequest(message string) (events.APIGatewayProxyResponse, error) {
	return errorResponse(http.StatusBadRequest, message)
}

// Unauthorized returns a 401 response.
func Unauthorized(message string) (events.APIGatewayProxyResponse, error) {
	return errorResponse(http.StatusUnauthorized, message)
}

// Forbidden returns a 403 response.
func Forbidden(message string) (events.APIGatewayProxyResponse, error) {
	return errorResponse(http.StatusForbidden, message)
}

// NotFound returns a 404 response.
func NotFound(message string) (events.APIGatewayProxyResponse, error) {
	return errorResponse(http.StatusNotFound, message)
}

// MethodNotAllowed returns a 405 response.
func MethodNotAllowed() (events.APIGatewayProxyResponse, error) {
	return errorResponse(http.StatusMethodNotAllowed, "method not allowed")
}

// InternalError returns a 500 response.
func InternalError(message string) (events.APIGatewayProxyResponse, error) {
	return errorResponse(http.StatusInternalServerError, message)
}

func errorResponse(status int, message string) (events.APIGatewayProxyResponse, error) {
	body, _ := json.Marshal(map[string]string{"error": message})
	return events.APIGatewayProxyResponse{
		StatusCode: status,
		Headers:    corsHeaders,
		Body:       string(body),
	}, nil
}
