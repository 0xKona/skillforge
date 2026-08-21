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
                    // Install bun (not available in standard CodeBuild image)
                    'npm install -g bun',
                    // Install Go 1.22 (CodeBuild default is 1.20, our deps need 1.21+)
                    'curl -sL https://go.dev/dl/go1.22.5.linux-amd64.tar.gz | tar -C /usr/local -xzf -',
                    'export PATH=/usr/local/go/bin:$PATH',
                    'go version',
                    // Install infra dependencies
                    'cd infra',
                    'bun install',
                    // Build Go Lambda binaries
                    'cd lambda/cv-handler && GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -tags lambda.norpc -o bootstrap . && cd ../..',
                    'cd lambda/ingot-handler && GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -tags lambda.norpc -o bootstrap . && cd ../..',
                    // Synth (must use pipeline entry point, not default app.ts)
                    'npx cdk synth --app "npx ts-node --prefer-ts-exts bin/pipeline.ts"',
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

        // Build the pipeline to materialise all constructs
        pipeline.buildPipeline();

        // Fix IAM policy: CDK generates codestar-connections:UseConnection but IAM
        // now requires codeconnections:UseConnection for policy writes.
        // Override the source action role policy to use the correct action prefix.
        const sourcePolicy = this.node.tryFindChild('Pipeline')
            ?.node.tryFindChild('Pipeline')
            ?.node.tryFindChild('Source')
            ?.node.tryFindChild('0xKona_skillforge')
            ?.node.tryFindChild('CodePipelineActionRole')
            ?.node.tryFindChild('DefaultPolicy')
            ?.node.tryFindChild('Resource') as import('aws-cdk-lib').CfnResource | undefined;

        if (sourcePolicy) {
            sourcePolicy.addOverride(
                'Properties.PolicyDocument.Statement.0.Action',
                'codeconnections:UseConnection'
            );
        }
    }
}
