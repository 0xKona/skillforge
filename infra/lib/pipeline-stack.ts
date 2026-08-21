import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { SkillForgeStage } from './skillforge-stage';
import { stageConfigs } from './config/stage-config';

export interface PipelineStackProps extends StackProps {
    /** CodeStar connection ARN for GitHub access */
    connectionArn: string;
    /** GitHub owner (user or org) */
    repoOwner: string;
    /** GitHub repository name */
    repoName: string;
    /** Branch to trigger pipeline on */
    triggerBranch: string;
    /** Secrets Manager secret name containing GitHub OAuth token for Amplify */
    githubTokenSecretName: string;
}

/**
 * Self-mutating CDK Pipeline that deploys SkillForge to test and prod.
 *
 * Flow:
 *   Source (GitHub) → Synth (CDK) → Test Deploy → Manual Approval → Prod Deploy
 *
 * Uses AWS-managed encryption (no CMK) to minimise costs.
 */
export class PipelineStack extends Stack {
    constructor(scope: Construct, id: string, props: PipelineStackProps) {
        super(scope, id, props);

        const {
            connectionArn,
            repoOwner,
            repoName,
            triggerBranch,
            githubTokenSecretName,
        } = props;

        // --- Pipeline ---
        const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
            pipelineName: 'skillforge-pipeline',
            crossAccountKeys: false, // Uses AWS-managed key (free) instead of CMK ($1/month)
            synth: new pipelines.ShellStep('Synth', {
                input: pipelines.CodePipelineSource.connection(
                    `${repoOwner}/${repoName}`,
                    triggerBranch,
                    { connectionArn }
                ),
                commands: [
                    // Install infra dependencies
                    'cd infra',
                    'npm ci',
                    // Build Go Lambda binaries
                    'cd lambda/cv-handler && GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -tags lambda.norpc -o bootstrap . && cd ../..',
                    'cd lambda/ingot-handler && GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -tags lambda.norpc -o bootstrap . && cd ../..',
                    // Synth
                    'npx cdk synth',
                ],
                primaryOutputDirectory: 'infra/cdk.out',
            }),
        });

        // --- Test Stage (automatic deployment) ---
        pipeline.addStage(
            new SkillForgeStage(this, 'Test', {
                stageConfig: stageConfigs.test,
                githubTokenSecretName,
                repoOwner,
                repoName,
                branchName: triggerBranch,
                customDomain: {
                    domainName: 'konarobinson.com',
                    subDomain: 'test-skillforge',
                },
                basicAuth: {
                    username: 'skilltester',
                    password: 'skilltester',
                },
                env: {
                    account: process.env.CDK_DEFAULT_ACCOUNT,
                    region: process.env.CDK_DEFAULT_REGION ?? 'eu-west-2',
                },
            })
        );

        // --- Prod Stage (manual approval required) ---
        pipeline.addStage(
            new SkillForgeStage(this, 'Prod', {
                stageConfig: stageConfigs.prod,
                githubTokenSecretName,
                repoOwner,
                repoName,
                branchName: triggerBranch,
                customDomain: {
                    domainName: 'konarobinson.com',
                    subDomain: 'skillforge',
                },
                env: {
                    account: process.env.CDK_DEFAULT_ACCOUNT,
                    region: process.env.CDK_DEFAULT_REGION ?? 'eu-west-2',
                },
            }),
            {
                pre: [
                    new pipelines.ManualApprovalStep('PromoteToProd', {
                        comment:
                            'Review test environment before deploying to production.',
                    }),
                ],
            }
        );
    }
}
