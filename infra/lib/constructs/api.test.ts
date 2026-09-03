import { App, Stack } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { ApiConstruct } from './api';
import { stageConfigs } from '../config/stage-config';

function createStack(stage: 'dev' | 'test' | 'prod') {
    const app = new App();
    const stack = new Stack(app, `${stage}-Stack`);

    const userPool = new cognito.UserPool(stack, 'UserPool');
    const cvTable = new dynamodb.Table(stack, 'CvTable', {
        partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    });
    const ingotTable = new dynamodb.Table(stack, 'IngotTable', {
        partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    });
    const avatarBucket = new s3.Bucket(stack, 'AvatarBucket');

    new ApiConstruct(stack, 'Api', {
        stageConfig: stageConfigs[stage],
        userPool,
        identityPoolId: 'eu-west-2:test-identity-pool',
        cvTable,
        ingotTable,
        avatarBucket,
    });

    return Template.fromStack(stack);
}

describe('ApiConstruct', () => {
    describe('test stage', () => {
        const template = createStack('test');

        it('creates a REST API with correct name', () => {
            template.hasResourceProperties('AWS::ApiGateway::RestApi', {
                Name: 'skillforge-test-api',
            });
        });

        it('creates a Cognito authorizer', () => {
            template.hasResourceProperties('AWS::ApiGateway::Authorizer', {
                Type: 'COGNITO_USER_POOLS',
                Name: 'skillforge-test-authorizer',
            });
        });

        it('creates three Lambda functions', () => {
            template.hasResourceProperties('AWS::Lambda::Function', {
                FunctionName: 'skillforge-test-cv-handler',
                Runtime: 'provided.al2023',
                Architectures: ['arm64'],
            });
            template.hasResourceProperties('AWS::Lambda::Function', {
                FunctionName: 'skillforge-test-ingot-handler',
                Runtime: 'provided.al2023',
                Architectures: ['arm64'],
            });
            template.hasResourceProperties('AWS::Lambda::Function', {
                FunctionName: 'skillforge-test-user-handler',
                Runtime: 'provided.al2023',
                Architectures: ['arm64'],
                Timeout: 30,
                MemorySize: 256,
            });
        });

        it('sets TABLE_NAME environment variable on CV handler', () => {
            template.hasResourceProperties('AWS::Lambda::Function', {
                FunctionName: 'skillforge-test-cv-handler',
                Environment: {
                    Variables: Match.objectLike({
                        TABLE_NAME: Match.anyValue(),
                    }),
                },
            });
        });

        it('sets TABLE_NAME environment variable on Ingot handler', () => {
            template.hasResourceProperties('AWS::Lambda::Function', {
                FunctionName: 'skillforge-test-ingot-handler',
                Environment: {
                    Variables: Match.objectLike({
                        TABLE_NAME: Match.anyValue(),
                    }),
                },
            });
        });

        it('sets user-handler environment variables', () => {
            template.hasResourceProperties('AWS::Lambda::Function', {
                FunctionName: 'skillforge-test-user-handler',
                Environment: {
                    Variables: Match.objectLike({
                        CV_TABLE_NAME: Match.anyValue(),
                        INGOT_TABLE_NAME: Match.anyValue(),
                        USER_POOL_ID: Match.anyValue(),
                        IDENTITY_POOL_ID: 'eu-west-2:test-identity-pool',
                        AVATAR_BUCKET: Match.anyValue(),
                    }),
                },
            });
        });

        it('creates API Gateway resources for /cv, /ingot, and /user/data', () => {
            template.hasResourceProperties('AWS::ApiGateway::Resource', {
                PathPart: 'cv',
            });
            template.hasResourceProperties('AWS::ApiGateway::Resource', {
                PathPart: 'ingot',
            });
            template.hasResourceProperties('AWS::ApiGateway::Resource', {
                PathPart: '{id}',
            });
            template.hasResourceProperties('AWS::ApiGateway::Resource', {
                PathPart: 'user',
            });
            template.hasResourceProperties('AWS::ApiGateway::Resource', {
                PathPart: 'data',
            });
        });

        it('configures CORS on the REST API', () => {
            template.hasResourceProperties('AWS::ApiGateway::Method', {
                HttpMethod: 'OPTIONS',
            });
        });

        it('deploys to the correct stage', () => {
            template.hasResourceProperties('AWS::ApiGateway::Stage', {
                StageName: 'test',
            });
        });

        it('grants DynamoDB read/write to Lambda functions', () => {
            template.hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: Match.arrayWith([
                        Match.objectLike({
                            Action: Match.arrayWith([
                                'dynamodb:BatchGetItem',
                                'dynamodb:GetItem',
                                'dynamodb:PutItem',
                            ]),
                            Effect: 'Allow',
                        }),
                    ]),
                },
            });
        });
    });

    describe('prod stage', () => {
        const template = createStack('prod');

        it('uses prod naming', () => {
            template.hasResourceProperties('AWS::ApiGateway::RestApi', {
                Name: 'skillforge-prod-api',
            });
            template.hasResourceProperties('AWS::Lambda::Function', {
                FunctionName: 'skillforge-prod-cv-handler',
            });
            template.hasResourceProperties('AWS::Lambda::Function', {
                FunctionName: 'skillforge-prod-ingot-handler',
            });
            template.hasResourceProperties('AWS::Lambda::Function', {
                FunctionName: 'skillforge-prod-user-handler',
            });
        });

        it('deploys to prod stage', () => {
            template.hasResourceProperties('AWS::ApiGateway::Stage', {
                StageName: 'prod',
            });
        });
    });
});
