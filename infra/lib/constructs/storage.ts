import { Construct } from 'constructs';
import { CfnOutput } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import { StageConfig } from '../config/stage-config';
import { resourceName } from '../utils/naming';

export interface StorageConstructProps {
    stageConfig: StageConfig;
    authenticatedRole: iam.Role;
}

/**
 * Storage construct providing an S3 bucket for user avatars.
 *
 * Access model:
 * - Public read on avatars/* (for displaying profile pictures)
 * - Authenticated users can read/write/delete their own folder: avatars/{identity_id}/*
 * - CORS enabled for browser uploads from the frontend
 */
export class StorageConstruct extends Construct {
    public readonly bucket: s3.Bucket;

    constructor(scope: Construct, id: string, props: StorageConstructProps) {
        super(scope, id);

        const { stageConfig, authenticatedRole } = props;

        // --- S3 Bucket ---
        this.bucket = new s3.Bucket(this, 'AvatarBucket', {
            bucketName: resourceName(stageConfig.stage, 'avatars'),
            removalPolicy: stageConfig.removalPolicy,
            autoDeleteObjects: stageConfig.stage === 'test',
            blockPublicAccess: new s3.BlockPublicAccess({
                blockPublicAcls: true,
                ignorePublicAcls: true,
                blockPublicPolicy: false,
                restrictPublicBuckets: false,
            }),
            cors: [
                {
                    allowedHeaders: ['*'],
                    allowedMethods: [
                        s3.HttpMethods.GET,
                        s3.HttpMethods.PUT,
                        s3.HttpMethods.POST,
                        s3.HttpMethods.DELETE,
                    ],
                    allowedOrigins: ['*'], // Tighten to specific domain in prod if desired
                    exposedHeaders: [
                        'ETag',
                        'x-amz-server-side-encryption',
                        'x-amz-request-id',
                        'x-amz-id-2',
                    ],
                    maxAge: 3000,
                },
            ],
        });

        // --- Public read policy for avatars/* ---
        this.bucket.addToResourcePolicy(
            new iam.PolicyStatement({
                sid: 'AllowPublicReadForAvatars',
                effect: iam.Effect.ALLOW,
                actions: ['s3:GetObject'],
                principals: [new iam.AnyPrincipal()],
                resources: [this.bucket.arnForObjects('avatars/*')],
            })
        );

        // --- Authenticated user policy: read/write/delete own folder ---
        authenticatedRole.addToPolicy(
            new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['s3:PutObject', 's3:GetObject', 's3:DeleteObject'],
                resources: [
                    this.bucket.arnForObjects(
                        'avatars/${cognito-identity.amazonaws.com:sub}/*'
                    ),
                ],
            })
        );

        // Allow authenticated users to list their own prefix
        authenticatedRole.addToPolicy(
            new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['s3:ListBucket'],
                resources: [this.bucket.bucketArn],
                conditions: {
                    StringLike: {
                        's3:prefix': [
                            'avatars/${cognito-identity.amazonaws.com:sub}/*',
                        ],
                    },
                },
            })
        );

        // --- Outputs ---
        new CfnOutput(this, 'BucketName', {
            value: this.bucket.bucketName,
            description: 'S3 avatar bucket name',
        });

        new CfnOutput(this, 'BucketArn', {
            value: this.bucket.bucketArn,
            description: 'S3 avatar bucket ARN',
        });
    }
}
