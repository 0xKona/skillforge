import { Construct } from 'constructs';
import { CfnOutput } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as kms from 'aws-cdk-lib/aws-kms';
import { StageConfig } from '../config/stage-config';
import { resourceName } from '../utils/naming';

export interface DatabaseConstructProps {
    stageConfig: StageConfig;
}

/**
 * Database construct providing DynamoDB tables for CV and Ingot models.
 *
 * Both tables use owner-based access patterns with GSIs for:
 * - Listing all items for a user (by owner)
 * - Filtering ingots by owner + type
 *
 * Prod tables are encrypted with a Customer Managed Key (CMK) for:
 * - CloudTrail audit of all data access
 * - Ability to revoke access by disabling the key
 * - Key rotation control
 */
export class DatabaseConstruct extends Construct {
    public readonly cvTable: dynamodb.Table;
    public readonly ingotTable: dynamodb.Table;
    public readonly encryptionKey?: kms.Key;

    constructor(scope: Construct, id: string, props: DatabaseConstructProps) {
        super(scope, id);

        const { stageConfig } = props;

        // --- CMK for prod encryption ---
        if (stageConfig.stage === 'prod') {
            this.encryptionKey = new kms.Key(this, 'DataEncryptionKey', {
                alias: resourceName(stageConfig.stage, 'data-key'),
                description:
                    'Customer managed key for SkillForge DynamoDB encryption',
                enableKeyRotation: true,
                removalPolicy: stageConfig.removalPolicy,
            });
        }

        // --- CV Table ---
        this.cvTable = new dynamodb.Table(this, 'CvTable', {
            tableName: resourceName(stageConfig.stage, 'cv-table'),
            partitionKey: {
                name: 'id',
                type: dynamodb.AttributeType.STRING,
            },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: stageConfig.removalPolicy,
            pointInTimeRecoverySpecification: {
                pointInTimeRecoveryEnabled: stageConfig.stage === 'prod',
            },
            encryption: this.encryptionKey
                ? dynamodb.TableEncryption.CUSTOMER_MANAGED
                : dynamodb.TableEncryption.AWS_MANAGED,
            encryptionKey: this.encryptionKey,
        });

        // GSI: Query CVs by owner
        this.cvTable.addGlobalSecondaryIndex({
            indexName: 'by-owner',
            partitionKey: {
                name: 'owner',
                type: dynamodb.AttributeType.STRING,
            },
            sortKey: {
                name: 'updatedAt',
                type: dynamodb.AttributeType.STRING,
            },
            projectionType: dynamodb.ProjectionType.ALL,
        });

        // --- Ingot Table ---
        this.ingotTable = new dynamodb.Table(this, 'IngotTable', {
            tableName: resourceName(stageConfig.stage, 'ingot-table'),
            partitionKey: {
                name: 'id',
                type: dynamodb.AttributeType.STRING,
            },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: stageConfig.removalPolicy,
            pointInTimeRecoverySpecification: {
                pointInTimeRecoveryEnabled: stageConfig.stage === 'prod',
            },
            encryption: this.encryptionKey
                ? dynamodb.TableEncryption.CUSTOMER_MANAGED
                : dynamodb.TableEncryption.AWS_MANAGED,
            encryptionKey: this.encryptionKey,
        });

        // GSI: Query Ingots by owner
        this.ingotTable.addGlobalSecondaryIndex({
            indexName: 'by-owner',
            partitionKey: {
                name: 'owner',
                type: dynamodb.AttributeType.STRING,
            },
            sortKey: {
                name: 'updatedAt',
                type: dynamodb.AttributeType.STRING,
            },
            projectionType: dynamodb.ProjectionType.ALL,
        });

        // GSI: Query Ingots by owner and type (for filtered listing)
        this.ingotTable.addGlobalSecondaryIndex({
            indexName: 'by-owner-type',
            partitionKey: {
                name: 'owner',
                type: dynamodb.AttributeType.STRING,
            },
            sortKey: {
                name: 'type',
                type: dynamodb.AttributeType.STRING,
            },
            projectionType: dynamodb.ProjectionType.ALL,
        });

        // --- Outputs ---
        new CfnOutput(this, 'CvTableName', {
            value: this.cvTable.tableName,
            description: 'DynamoDB CV table name',
        });

        new CfnOutput(this, 'CvTableArn', {
            value: this.cvTable.tableArn,
            description: 'DynamoDB CV table ARN',
        });

        new CfnOutput(this, 'IngotTableName', {
            value: this.ingotTable.tableName,
            description: 'DynamoDB Ingot table name',
        });

        new CfnOutput(this, 'IngotTableArn', {
            value: this.ingotTable.tableArn,
            description: 'DynamoDB Ingot table ARN',
        });
    }
}
