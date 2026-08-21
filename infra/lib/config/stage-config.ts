import { RemovalPolicy } from 'aws-cdk-lib';

export type Stage = 'dev' | 'test' | 'prod';

export interface StageConfig {
    stage: Stage;
    removalPolicy: RemovalPolicy;
    deletionProtection: boolean;
}

export const stageConfigs: Record<Stage, StageConfig> = {
    dev: {
        stage: 'dev',
        removalPolicy: RemovalPolicy.DESTROY,
        deletionProtection: false,
    },
    test: {
        stage: 'test',
        removalPolicy: RemovalPolicy.DESTROY,
        deletionProtection: false,
    },
    prod: {
        stage: 'prod',
        removalPolicy: RemovalPolicy.RETAIN,
        deletionProtection: true,
    },
};
