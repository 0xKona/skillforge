import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StageConfig } from './config/stage-config';
import { applyStandardTags } from './utils/tagging';
import { AuthConstruct } from './constructs/auth';
import { DatabaseConstruct } from './constructs/database';
import { StorageConstruct } from './constructs/storage';

export interface SkillForgeStackProps extends StackProps {
    stageConfig: StageConfig;
}

/**
 * Main stack for the SkillForge application.
 * Composes Auth, Database, and Storage constructs with stage-aware configuration.
 */
export class SkillForgeStack extends Stack {
    public readonly stageConfig: StageConfig;
    public readonly auth: AuthConstruct;
    public readonly database: DatabaseConstruct;
    public readonly storage: StorageConstruct;

    constructor(scope: Construct, id: string, props: SkillForgeStackProps) {
        super(scope, id, props);

        this.stageConfig = props.stageConfig;

        // Apply standard tags to all resources in this stack
        applyStandardTags(this, this.stageConfig.stage);

        // --- Auth (Cognito User Pool, Client, Identity Pool) ---
        this.auth = new AuthConstruct(this, 'Auth', {
            stageConfig: this.stageConfig,
        });

        // --- Database (DynamoDB tables) ---
        this.database = new DatabaseConstruct(this, 'Database', {
            stageConfig: this.stageConfig,
        });

        // --- Storage (S3 bucket for avatars) ---
        this.storage = new StorageConstruct(this, 'Storage', {
            stageConfig: this.stageConfig,
            authenticatedRole: this.auth.authenticatedRole,
        });
    }
}
