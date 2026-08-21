import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StageConfig } from './config/stage-config';
import { applyStandardTags } from './utils/tagging';

export interface SkillForgeStackProps extends StackProps {
    stageConfig: StageConfig;
}

/**
 * Base stack for the SkillForge application.
 * Accepts stage configuration to control resource protection and naming.
 *
 * Constructs (Auth, Database, Storage, API) will be added here as they are built.
 */
export class SkillForgeStack extends Stack {
    public readonly stageConfig: StageConfig;

    constructor(scope: Construct, id: string, props: SkillForgeStackProps) {
        super(scope, id, props);

        this.stageConfig = props.stageConfig;

        // Apply standard tags to all resources in this stack
        applyStandardTags(this, this.stageConfig.stage);
    }
}
