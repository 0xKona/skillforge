package main

import (
	"context"
	"encoding/json"
	"strings"

	"github.com/0xKona/skillforge/infra/lambda/shared"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type listResponse struct {
	Items     interface{} `json:"items"`
	NextToken *string     `json:"nextToken,omitempty"`
}

func list(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	owner, err := shared.GetOwner(req)
	if err != nil {
		return shared.Unauthorized("unable to identify user")
	}

	typeFilter := req.QueryStringParameters["type"]
	fieldsParam := req.QueryStringParameters["fields"]

	var input *dynamodb.QueryInput

	if typeFilter != "" {
		// Use by-owner-type GSI for filtered listing
		input = &dynamodb.QueryInput{
			TableName:              shared.StringPtr(tableName()),
			IndexName:              aws.String("by-owner-type"),
			KeyConditionExpression: aws.String("#owner = :owner AND #type = :type"),
			ExpressionAttributeNames: map[string]string{
				"#owner": "owner",
				"#type":  "type",
			},
			ExpressionAttributeValues: map[string]types.AttributeValue{
				":owner": &types.AttributeValueMemberS{Value: owner},
				":type":  &types.AttributeValueMemberS{Value: typeFilter},
			},
			Limit: aws.Int32(50),
		}
	} else {
		// Query all ingots for this owner
		input = &dynamodb.QueryInput{
			TableName:              shared.StringPtr(tableName()),
			IndexName:              aws.String("by-owner"),
			KeyConditionExpression: aws.String("#owner = :owner"),
			ExpressionAttributeNames: map[string]string{
				"#owner": "owner",
			},
			ExpressionAttributeValues: map[string]types.AttributeValue{
				":owner": &types.AttributeValueMemberS{Value: owner},
			},
			ScanIndexForward: aws.Bool(false),
			Limit:            aws.Int32(50),
		}
	}

	// Pagination: accept nextToken to resume from a previous page
	if token := req.QueryStringParameters["nextToken"]; token != "" {
		input.ExclusiveStartKey = map[string]types.AttributeValue{
			"id":        &types.AttributeValueMemberS{Value: token},
			"owner":     &types.AttributeValueMemberS{Value: owner},
			"updatedAt": &types.AttributeValueMemberS{Value: "0"},
		}
	}

	result, err := db.Query(ctx, input)
	if err != nil {
		return shared.InternalError("failed to list ingots")
	}

	var ingots []shared.Ingot
	if err := attributevalue.UnmarshalListOfMaps(result.Items, &ingots); err != nil {
		return shared.InternalError("failed to unmarshal ingots")
	}

	// Build response with optional field filtering
	var items interface{}
	if fieldsParam != "" {
		items = filterFields(ingots, fieldsParam)
	} else {
		items = ingots
	}

	resp := listResponse{Items: items}
	if result.LastEvaluatedKey != nil {
		if v, ok := result.LastEvaluatedKey["id"].(*types.AttributeValueMemberS); ok {
			resp.NextToken = &v.Value
		}
	}

	return shared.Success(resp)
}

// filterFields returns a slice of maps containing only the requested fields.
func filterFields(ingots []shared.Ingot, fieldsParam string) []map[string]interface{} {
	requested := make(map[string]bool)
	for _, f := range strings.Split(fieldsParam, ",") {
		requested[strings.TrimSpace(f)] = true
	}

	result := make([]map[string]interface{}, 0, len(ingots))
	for _, ing := range ingots {
		// Marshal the full struct to a map, then pick only requested fields
		full := ingotToMap(ing)
		filtered := make(map[string]interface{})
		for key, val := range full {
			if requested[key] {
				filtered[key] = val
			}
		}
		result = append(result, filtered)
	}
	return result
}

// ingotToMap converts an Ingot struct to a map via JSON round-trip.
func ingotToMap(ing shared.Ingot) map[string]interface{} {
	data, _ := json.Marshal(ing)
	var m map[string]interface{}
	json.Unmarshal(data, &m)
	return m
}
