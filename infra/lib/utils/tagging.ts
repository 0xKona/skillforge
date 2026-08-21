import { Tags } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Stage } from '../config/stage-config';

interface StandardTags {
    Project: string;
    Stage: Stage;
    ManagedBy: string;
    Owner: string;
}

const BASE_TAGS: Omit<StandardTags, 'Stage'> = {
    Project: 'skillforge',
    ManagedBy: 'cdk',
    Owner: 'skillforge-team',
};

/**
 * Apply standard tags to a construct and all its children.
 * Call this on the stack to tag every resource within it.
 *
 * Tags applied:
 * - Project: skillforge
 * - Stage: test | prod
 * - ManagedBy: cdk
 * - Owner: skillforge-team
 */
export function applyStandardTags(scope: Construct, stage: Stage): void {
    const tags = Tags.of(scope);

    tags.add('Project', BASE_TAGS.Project);
    tags.add('Stage', stage);
    tags.add('ManagedBy', BASE_TAGS.ManagedBy);
    tags.add('Owner', BASE_TAGS.Owner);
}
