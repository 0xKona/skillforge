package main

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/service/cognitoidentity"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type identityAPI interface {
	GetId(ctx context.Context, params *cognitoidentity.GetIdInput, optFns ...func(*cognitoidentity.Options)) (*cognitoidentity.GetIdOutput, error)
}

type s3API interface {
	ListObjectsV2(ctx context.Context, params *s3.ListObjectsV2Input, optFns ...func(*s3.Options)) (*s3.ListObjectsV2Output, error)
	DeleteObjects(ctx context.Context, params *s3.DeleteObjectsInput, optFns ...func(*s3.Options)) (*s3.DeleteObjectsOutput, error)
}

type cognitoAPI interface {
	AdminDeleteUser(ctx context.Context, params *cognitoidentityprovider.AdminDeleteUserInput, optFns ...func(*cognitoidentityprovider.Options)) (*cognitoidentityprovider.AdminDeleteUserOutput, error)
}
