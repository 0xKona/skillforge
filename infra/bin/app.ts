#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { SkillForgeStack } from '../lib/skillforge-stack';
import { stageConfigs } from '../lib/config/stage-config';

const app = new App();

// Dev stack — local development sandbox, deployed manually
new SkillForgeStack(app, 'skillforge-dev', {
    stageConfig: stageConfigs.dev,
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION ?? 'eu-west-2',
    },
});

// Test stack — pipeline deploys here automatically
new SkillForgeStack(app, 'skillforge-test', {
    stageConfig: stageConfigs.test,
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION ?? 'eu-west-2',
    },
});

// Prod stack — pipeline deploys here after approval
new SkillForgeStack(app, 'skillforge-prod', {
    stageConfig: stageConfigs.prod,
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION ?? 'eu-west-2',
    },
});

app.synth();
