import { App, Stack } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
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

    new ApiConstruct(stack, 'Api', {
        stageConfig: stageConfigs[stage],
        userPool,
        cvTable,
        ingotTable,
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

        it('creates two Lambda functions', () => {
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

        it('creates API Gateway resources for /cv and /ingot', () => {
            template.hasResourceProperties('AWS::ApiGateway::Resource', {
                PathPart: 'cv',
            });
            template.hasResourceProperties('AWS::ApiGateway::Resource', {
                PathPart: 'ingot',
            });
            template.hasResourceProperties('AWS::ApiGateway::Resource', {
                PathPart: '{id}',
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
        });

        it('deploys to prod stage', () => {
            template.hasResourceProperties('AWS::ApiGateway::Stage', {
                StageName: 'prod',
            });
        });
    });
});
