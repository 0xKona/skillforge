import { App, Stack } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { StorageConstruct } from './storage';
import { stageConfigs } from '../config/stage-config';

function createStack(stage: 'dev' | 'test' | 'prod') {
    const app = new App();
    const stack = new Stack(app, `${stage}-Stack`);
    const authenticatedRole = new iam.Role(stack, 'AuthRole', {
        assumedBy: new iam.ServicePrincipal('cognito-identity.amazonaws.com'),
    });
    new StorageConstruct(stack, 'Storage', {
        stageConfig: stageConfigs[stage],
        authenticatedRole,
    });
    return Template.fromStack(stack);
}

describe('StorageConstruct', () => {
    describe('test stage', () => {
        const template = createStack('test');

        it('creates an S3 bucket with correct name', () => {
            template.hasResourceProperties('AWS::S3::Bucket', {
                BucketName: 'skillforge-test-avatars',
            });
        });

        it('sets removal policy to destroy on test', () => {
            template.hasResource('AWS::S3::Bucket', {
                DeletionPolicy: 'Delete',
            });
        });

        it('does not create a KMS key on test', () => {
            template.resourceCountIs('AWS::KMS::Key', 0);
        });

        it('configures CORS for browser uploads', () => {
            template.hasResourceProperties('AWS::S3::Bucket', {
                CorsConfiguration: {
                    CorsRules: [
                        Match.objectLike({
                            AllowedHeaders: ['*'],
                            AllowedMethods: Match.arrayWith([
                                'GET',
                                'PUT',
                                'POST',
                                'DELETE',
                            ]),
                            AllowedOrigins: ['*'],
                        }),
                    ],
                },
            });
        });

        it('allows public read on avatars/* via bucket policy', () => {
            template.hasResourceProperties('AWS::S3::BucketPolicy', {
                PolicyDocument: {
                    Statement: Match.arrayWith([
                        Match.objectLike({
                            Sid: 'AllowPublicReadForAvatars',
                            Effect: 'Allow',
                            Principal: { AWS: '*' },
                            Action: 's3:GetObject',
                        }),
                    ]),
                },
            });
        });

        it('blocks public ACLs but allows bucket policies', () => {
            template.hasResourceProperties('AWS::S3::Bucket', {
                PublicAccessBlockConfiguration: {
                    BlockPublicAcls: true,
                    IgnorePublicAcls: true,
                    BlockPublicPolicy: false,
                    RestrictPublicBuckets: false,
                },
            });
        });
    });

    describe('prod stage', () => {
        const template = createStack('prod');

        it('creates a KMS Customer Managed Key on prod', () => {
            template.hasResourceProperties('AWS::KMS::Key', {
                EnableKeyRotation: true,
                Description:
                    'Customer managed key for SkillForge S3 encryption',
            });
        });

        it('sets removal policy to retain on prod', () => {
            template.hasResource('AWS::S3::Bucket', {
                DeletionPolicy: 'Retain',
            });
        });

        it('encrypts bucket with KMS on prod', () => {
            template.hasResourceProperties('AWS::S3::Bucket', {
                BucketName: 'skillforge-prod-avatars',
                BucketEncryption: {
                    ServerSideEncryptionConfiguration: [
                        Match.objectLike({
                            ServerSideEncryptionByDefault: {
                                SSEAlgorithm: 'aws:kms',
                            },
                            BucketKeyEnabled: true,
                        }),
                    ],
                },
            });
        });

        it('uses prod naming', () => {
            template.hasResourceProperties('AWS::S3::Bucket', {
                BucketName: 'skillforge-prod-avatars',
            });
        });
    });
});
