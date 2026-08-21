#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { PipelineStack } from '../lib/pipeline-stack';

const app = new App();

const config = app.node.tryGetContext('pipeline');

new PipelineStack(app, 'SkillForge-Pipeline', {
    connectionArn: config.connectionArn,
    repoOwner: config.repoOwner,
    repoName: config.repoName,
    triggerBranch: config.triggerBranch,
    githubTokenSecretName: config.githubTokenSecretName,
    env: {
        account: config.account,
        region: config.region,
    },
});

app.synth();
