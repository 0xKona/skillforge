package shared

import (
	"context"
	"sync"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

var (
	dbClient *dynamodb.Client
	once     sync.Once
)

// DynamoClient returns a singleton DynamoDB client.
// Reused across invocations within the same Lambda execution context.
func DynamoClient() *dynamodb.Client {
	once.Do(func() {
		cfg, err := config.LoadDefaultConfig(context.Background())
		if err != nil {
			panic("unable to load AWS config: " + err.Error())
		}
		dbClient = dynamodb.NewFromConfig(cfg)
	})
	return dbClient
}

// NowISO returns the current time in ISO 8601 format.
func NowISO() string {
	return time.Now().UTC().Format(time.RFC3339)
}

// StringPtr returns a pointer to a string.
func StringPtr(s string) *string {
	return aws.String(s)
}
