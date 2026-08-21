package main

import "os"

// tableName returns the DynamoDB table name from environment variable.
func tableName() string {
	return os.Getenv("TABLE_NAME")
}
