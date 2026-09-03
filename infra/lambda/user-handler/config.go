package main

import (
	"os"

	"github.com/0xKona/skillforge/infra/lambda/shared"
)

var (
	db       shared.DynamoAPI
	identity identityAPI
	s3c      s3API
	idp      cognitoAPI
)

func cvTableName() string {
	return os.Getenv("CV_TABLE_NAME")
}

func ingotTableName() string {
	return os.Getenv("INGOT_TABLE_NAME")
}

func userPoolID() string {
	return os.Getenv("USER_POOL_ID")
}

func identityPoolID() string {
	return os.Getenv("IDENTITY_POOL_ID")
}

func avatarBucket() string {
	return os.Getenv("AVATAR_BUCKET")
}

func awsRegion() string {
	if region := os.Getenv("AWS_REGION"); region != "" {
		return region
	}
	return os.Getenv("AWS_DEFAULT_REGION")
}
