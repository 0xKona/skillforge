package main

import "os"

func tableName() string {
	return os.Getenv("TABLE_NAME")
}
