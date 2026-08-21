import { App } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { SkillForgeStack } from './skillforge-stack';
import { stageConfigs } from './config/stage-config';

describe('SkillForgeStack', () => {
    describe('dev stage', () => {
        const app = new App();
        const stack = new SkillForgeStack(app, 'skillforge-dev', {
            stageConfig: stageConfigs.dev,
        });
        const template = Template.fromStack(stack);

        it('creates all expected resource types', () => {
            template.resourceCountIs('AWS::Cognito::UserPool', 1);
            template.resourceCountIs('AWS::Cognito::UserPoolClient', 1);
            template.resourceCountIs('AWS::Cognito::IdentityPool', 1);
            template.resourceCountIs('AWS::DynamoDB::Table', 2);
            template.resourceCountIs('AWS::S3::Bucket', 1);
            template.resourceCountIs('AWS::ApiGateway::RestApi', 1);
            template.resourceCountIs('AWS::Lambda::Function', 2);
        });

        it('does not create KMS keys on dev', () => {
            template.resourceCountIs('AWS::KMS::Key', 0);
        });

        it('applies standard tags to all resources', () => {
            template.hasResourceProperties('AWS::DynamoDB::Table', {
                Tags: Match.arrayWith([
                    Match.objectLike({ Key: 'Project', Value: 'skillforge' }),
                    Match.objectLike({ Key: 'Stage', Value: 'dev' }),
                ]),
            });
        });

        it('uses dev naming convention', () => {
            template.hasResourceProperties('AWS::Cognito::UserPool', {
                UserPoolName: 'skillforge-dev-user-pool',
            });
            template.hasResourceProperties('AWS::DynamoDB::Table', {
                TableName: 'skillforge-dev-cv-table',
            });
            template.hasResourceProperties('AWS::ApiGateway::RestApi', {
                Name: 'skillforge-dev-api',
            });
        });

        it('sets all DynamoDB tables to delete on removal', () => {
            const tables = template.findResources('AWS::DynamoDB::Table');
            for (const [, resource] of Object.entries(tables)) {
                expect(resource.DeletionPolicy).toBe('Delete');
            }
        });

        it('sets S3 bucket to delete on removal', () => {
            template.hasResource('AWS::S3::Bucket', {
                DeletionPolicy: 'Delete',
            });
        });
    });

    describe('prod stage', () => {
        const app = new App();
        const stack = new SkillForgeStack(app, 'skillforge-prod', {
            stageConfig: stageConfigs.prod,
        });
        const template = Template.fromStack(stack);

        it('creates KMS keys for encryption', () => {
            // One for DynamoDB, one for S3
            template.resourceCountIs('AWS::KMS::Key', 2);
        });

        it('enables deletion protection on User Pool', () => {
            template.hasResourceProperties('AWS::Cognito::UserPool', {
                DeletionProtection: 'ACTIVE',
            });
        });

        it('retains DynamoDB tables on removal', () => {
            const tables = template.findResources('AWS::DynamoDB::Table');
            for (const [, resource] of Object.entries(tables)) {
                expect(resource.DeletionPolicy).toBe('Retain');
            }
        });

        it('retains S3 bucket on removal', () => {
            template.hasResource('AWS::S3::Bucket', {
                DeletionPolicy: 'Retain',
            });
        });

        it('retains KMS keys on removal', () => {
            const keys = template.findResources('AWS::KMS::Key');
            for (const [, resource] of Object.entries(keys)) {
                expect(resource.DeletionPolicy).toBe('Retain');
            }
        });

        it('enables point-in-time recovery on prod tables', () => {
            template.hasResourceProperties('AWS::DynamoDB::Table', {
                TableName: 'skillforge-prod-cv-table',
                PointInTimeRecoverySpecification: {
                    PointInTimeRecoveryEnabled: true,
                },
            });
            template.hasResourceProperties('AWS::DynamoDB::Table', {
                TableName: 'skillforge-prod-ingot-table',
                PointInTimeRecoverySpecification: {
                    PointInTimeRecoveryEnabled: true,
                },
            });
        });

        it('applies prod stage tag', () => {
            template.hasResourceProperties('AWS::DynamoDB::Table', {
                Tags: Match.arrayWith([
                    Match.objectLike({ Key: 'Stage', Value: 'prod' }),
                ]),
            });
        });

        it('uses prod naming convention', () => {
            template.hasResourceProperties('AWS::Cognito::UserPool', {
                UserPoolName: 'skillforge-prod-user-pool',
            });
            template.hasResourceProperties('AWS::DynamoDB::Table', {
                TableName: 'skillforge-prod-cv-table',
            });
            template.hasResourceProperties('AWS::ApiGateway::RestApi', {
                Name: 'skillforge-prod-api',
            });
        });
    });

    describe('test stage matches dev protection policies', () => {
        const app = new App();
        const stack = new SkillForgeStack(app, 'skillforge-test', {
            stageConfig: stageConfigs.test,
        });
        const template = Template.fromStack(stack);

        it('does not create KMS keys on test', () => {
            template.resourceCountIs('AWS::KMS::Key', 0);
        });

        it('sets deletion policy to delete on test', () => {
            const tables = template.findResources('AWS::DynamoDB::Table');
            for (const [, resource] of Object.entries(tables)) {
                expect(resource.DeletionPolicy).toBe('Delete');
            }
        });

        it('does not enable deletion protection on test', () => {
            template.hasResourceProperties('AWS::Cognito::UserPool', {
                DeletionProtection: 'INACTIVE',
            });
        });
    });
});
