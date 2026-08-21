import { RemovalPolicy } from 'aws-cdk-lib';
import { stageConfigs } from './stage-config';

describe('stageConfigs', () => {
    describe('dev', () => {
        const config = stageConfigs.dev;

        it('has stage set to dev', () => {
            expect(config.stage).toBe('dev');
        });

        it('uses DESTROY removal policy', () => {
            expect(config.removalPolicy).toBe(RemovalPolicy.DESTROY);
        });

        it('has deletion protection disabled', () => {
            expect(config.deletionProtection).toBe(false);
        });
    });

    describe('test', () => {
        const config = stageConfigs.test;

        it('has stage set to test', () => {
            expect(config.stage).toBe('test');
        });

        it('uses DESTROY removal policy', () => {
            expect(config.removalPolicy).toBe(RemovalPolicy.DESTROY);
        });

        it('has deletion protection disabled', () => {
            expect(config.deletionProtection).toBe(false);
        });
    });

    describe('prod', () => {
        const config = stageConfigs.prod;

        it('has stage set to prod', () => {
            expect(config.stage).toBe('prod');
        });

        it('uses RETAIN removal policy', () => {
            expect(config.removalPolicy).toBe(RemovalPolicy.RETAIN);
        });

        it('has deletion protection enabled', () => {
            expect(config.deletionProtection).toBe(true);
        });
    });

    it('defines all three stages', () => {
        expect(Object.keys(stageConfigs)).toEqual(['dev', 'test', 'prod']);
    });
});
