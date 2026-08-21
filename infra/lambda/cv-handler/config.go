package main

import (
	"os"

	"github.com/0xKona/skillforge/infra/lambda/shared"
)

// db holds the DynamoDB client. Set in main() for production,
// overridden in tests with a mock.
var db shared.DynamoAPI

func tableName() string {
	return os.Getenv("TABLE_NAME")
}
