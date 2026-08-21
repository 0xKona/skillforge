import { Stage } from '../config/stage-config';

const PROJECT_PREFIX = 'skillforge';

/**
 * Generate a consistent resource name following the pattern:
 * skillforge-{stage}-{resource}
 *
 * @example resourceName('prod', 'user-pool') => 'skillforge-prod-user-pool'
 * @example resourceName('test', 'cv-table') => 'skillforge-test-cv-table'
 */
export function resourceName(stage: Stage, resource: string): string {
    return `${PROJECT_PREFIX}-${stage}-${resource}`;
}

/**
 * Generate a CDK construct ID (PascalCase, no hyphens).
 * Used for logical IDs within stacks.
 *
 * @example constructId('user-pool') => 'UserPool'
 * @example constructId('cv-table') => 'CvTable'
 */
export function constructId(resource: string): string {
    return resource
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
}
