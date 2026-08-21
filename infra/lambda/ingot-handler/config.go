package main

import (
	"os"

	"github.com/0xKona/skillforge/infra/lambda/shared"
)

var db shared.DynamoAPI

func tableName() string {
	return os.Getenv("TABLE_NAME")
}
