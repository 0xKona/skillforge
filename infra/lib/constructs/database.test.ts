import { App, Stack } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { DatabaseConstruct } from './database';
import { stageConfigs } from '../config/stage-config';

describe('DatabaseConstruct', () => {
    describe('test stage', () => {
        const app = new App();
        const stack = new Stack(app, 'TestStack');
        new DatabaseConstruct(stack, 'Database', {
            stageConfig: stageConfigs.test,
        });
        const template = Template.fromStack(stack);

        it('creates CV table with correct name and key', () => {
            template.hasResourceProperties('AWS::DynamoDB::Table', {
                TableName: 'skillforge-test-cv-table',
                KeySchema: [
                    { AttributeName: 'id', KeyType: 'HASH' },
                ],
                BillingMode: 'PAY_PER_REQUEST',
            });
        });

        it('creates Ingot table with correct name and key', () => {
            template.hasResourceProperties('AWS::DynamoDB::Table', {
                TableName: 'skillforge-test-ingot-table',
                KeySchema: [
                    { AttributeName: 'id', KeyType: 'HASH' },
                ],
                BillingMode: 'PAY_PER_REQUEST',
            });
        });

        it('creates two DynamoDB tables', () => {
            template.resourceCountIs('AWS::DynamoDB::Table', 2);
        });

        it('does not create a KMS key on test', () => {
            template.resourceCountIs('AWS::KMS::Key', 0);
        });

        it('sets removal policy to destroy on test', () => {
            const tables = template.findResources('AWS::DynamoDB::Table');
            for (const [, resource] of Object.entries(tables)) {
                expect(resource.DeletionPolicy).toBe('Delete');
            }
        });

        it('disables point-in-time recovery on test', () => {
            template.hasResourceProperties('AWS::DynamoDB::Table', {
                TableName: 'skillforge-test-cv-table',
                PointInTimeRecoverySpecification: {
                    PointInTimeRecoveryEnabled: false,
                },
            });
        });

        it('creates by-owner GSI on CV table', () => {
            template.hasResourceProperties('AWS::DynamoDB::Table', {
                TableName: 'skillforge-test-cv-table',
                GlobalSecondaryIndexes: Match.arrayWith([
                    Match.objectLike({
                        IndexName: 'by-owner',
                        KeySchema: [
                            { AttributeName: 'owner', KeyType: 'HASH' },
                            { AttributeName: 'updatedAt', KeyType: 'RANGE' },
                        ],
                    }),
                ]),
            });
        });

        it('creates by-owner and by-owner-type GSIs on Ingot table', () => {
            template.hasResourceProperties('AWS::DynamoDB::Table', {
                TableName: 'skillforge-test-ingot-table',
                GlobalSecondaryIndexes: Match.arrayWith([
                    Match.objectLike({ IndexName: 'by-owner' }),
                    Match.objectLike({ IndexName: 'by-owner-type' }),
                ]),
            });
        });
    });

    describe('prod stage', () => {
        const app = new App();
        const stack = new Stack(app, 'ProdStack');
        new DatabaseConstruct(stack, 'Database', {
            stageConfig: stageConfigs.prod,
        });
        const template = Template.fromStack(stack);

        it('creates a KMS Customer Managed Key on prod', () => {
            template.hasResourceProperties('AWS::KMS::Key', {
                EnableKeyRotation: true,
                Description:
                    'Customer managed key for SkillForge DynamoDB encryption',
            });
        });

        it('sets removal policy to retain on prod', () => {
            const tables = template.findResources('AWS::DynamoDB::Table');
            for (const [, resource] of Object.entries(tables)) {
                expect(resource.DeletionPolicy).toBe('Retain');
            }
        });

        it('enables point-in-time recovery on prod', () => {
            template.hasResourceProperties('AWS::DynamoDB::Table', {
                TableName: 'skillforge-prod-cv-table',
                PointInTimeRecoverySpecification: {
                    PointInTimeRecoveryEnabled: true,
                },
            });
        });

        it('encrypts tables with customer managed key', () => {
            template.hasResourceProperties('AWS::DynamoDB::Table', {
                TableName: 'skillforge-prod-cv-table',
                SSESpecification: {
                    SSEEnabled: true,
                    SSEType: 'KMS',
                },
            });
        });

        it('uses prod naming', () => {
            template.hasResourceProperties('AWS::DynamoDB::Table', {
                TableName: 'skillforge-prod-cv-table',
            });
            template.hasResourceProperties('AWS::DynamoDB::Table', {
                TableName: 'skillforge-prod-ingot-table',
            });
        });
    });
});
