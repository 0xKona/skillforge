import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SkillForgeStack } from './skillforge-stack';
import { HostingConstruct } from './constructs/hosting';
import { StageConfig } from './config/stage-config';

export interface SkillForgeStageProps extends StageProps {
    stageConfig: StageConfig;
    githubTokenSecretName: string;
    repoOwner: string;
    repoName: string;
    branchName: string;
}

/**
 * A CDK Stage that deploys the full SkillForge environment:
 * - Backend (Cognito, DynamoDB, S3, API Gateway, Lambda)
 * - Frontend hosting (Amplify)
 *
 * Used by CDK Pipelines to deploy test and prod as separate stages.
 */
export class SkillForgeStage extends Stage {
    public readonly backendStack: SkillForgeStack;

    constructor(scope: Construct, id: string, props: SkillForgeStageProps) {
        super(scope, id, props);

        const {
            stageConfig,
            githubTokenSecretName,
            repoOwner,
            repoName,
            branchName,
        } = props;

        // --- Backend Stack ---
        this.backendStack = new SkillForgeStack(this, `skillforge-${stageConfig.stage}`, {
            stageConfig,
        });

        // --- Frontend Hosting (within the same stack) ---
        new HostingConstruct(this.backendStack, 'Hosting', {
            stageConfig,
            githubTokenSecretName,
            repoOwner,
            repoName,
            branchName,
            environmentVariables: {
                NEXT_PUBLIC_API_URL: this.backendStack.api.api.url,
                NEXT_PUBLIC_USER_POOL_ID: this.backendStack.auth.userPool.userPoolId,
                NEXT_PUBLIC_USER_POOL_CLIENT_ID:
                    this.backendStack.auth.userPoolClient.userPoolClientId,
                NEXT_PUBLIC_IDENTITY_POOL_ID:
                    this.backendStack.auth.identityPool.ref,
                NEXT_PUBLIC_S3_BUCKET: this.backendStack.storage.bucket.bucketName,
                NEXT_PUBLIC_AWS_REGION: this.backendStack.region,
            },
        });
    }
}
