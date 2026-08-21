#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { PipelineStack } from '../lib/pipeline-stack';

const app = new App();

/**
 * Pipeline stack — deploys the self-mutating CI/CD pipeline.
 *
 * Required context values (set in cdk.json or via -c flag):
 *   connectionArn         — CodeStar connection ARN for GitHub
 *   repoOwner             — GitHub user/org (e.g., '0xKona')
 *   repoName              — GitHub repo name (e.g., 'skillforge')
 *   githubTokenSecretName — Secrets Manager secret name for Amplify GitHub token
 */
new PipelineStack(app, 'SkillForge-Pipeline', {
    connectionArn: app.node.tryGetContext('connectionArn') ??
        'arn:aws:codestar-connections:eu-west-2:ACCOUNT:connection/PLACEHOLDER',
    repoOwner: app.node.tryGetContext('repoOwner') ?? '0xKona',
    repoName: app.node.tryGetContext('repoName') ?? 'skillforge',
    triggerBranch: app.node.tryGetContext('triggerBranch') ?? 'main',
    githubTokenSecretName:
        app.node.tryGetContext('githubTokenSecretName') ?? 'skillforge/github-token',
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION ?? 'eu-west-2',
    },
});

app.synth();
