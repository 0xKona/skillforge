import { App } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { PipelineStack } from './pipeline-stack';

describe('PipelineStack', () => {
    const app = new App();
    const stack = new PipelineStack(app, 'TestPipeline', {
        connectionArn:
            'arn:aws:codestar-connections:eu-west-2:123456789:connection/test-id',
        repoOwner: '0xKona',
        repoName: 'skillforge',
        triggerBranch: 'main',
        githubTokenSecretName: 'skillforge/github-token',
        env: { account: '123456789', region: 'eu-west-2' },
    });
    const template = Template.fromStack(stack);

    it('creates a CodePipeline', () => {
        template.resourceCountIs('AWS::CodePipeline::Pipeline', 1);
    });

    it('does not create a KMS key (uses AWS-managed)', () => {
        template.resourceCountIs('AWS::KMS::Key', 0);
    });

    it('creates CodeBuild projects for synth and asset builds', () => {
        const projects = template.findResources(
            'AWS::CodeBuild::Project'
        );
        expect(Object.keys(projects).length).toBeGreaterThanOrEqual(1);
    });

    it('references the correct GitHub repository', () => {
        template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
            Stages: Match.arrayWith([
                Match.objectLike({
                    Name: 'Source',
                    Actions: Match.arrayWith([
                        Match.objectLike({
                            Configuration: Match.objectLike({
                                FullRepositoryId: '0xKona/skillforge',
                                BranchName: 'main',
                            }),
                        }),
                    ]),
                }),
            ]),
        });
    });

    it('includes a Build stage', () => {
        template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
            Stages: Match.arrayWith([
                Match.objectLike({ Name: 'Build' }),
            ]),
        });
    });

    it('includes test and prod deployment stages', () => {
        template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
            Stages: Match.arrayWith([
                Match.objectLike({ Name: 'Test' }),
                Match.objectLike({ Name: 'Prod' }),
            ]),
        });
    });

    it('includes a manual approval step before prod', () => {
        template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
            Stages: Match.arrayWith([
                Match.objectLike({
                    Name: 'Prod',
                    Actions: Match.arrayWith([
                        Match.objectLike({
                            ActionTypeId: Match.objectLike({
                                Category: 'Approval',
                                Provider: 'Manual',
                            }),
                        }),
                    ]),
                }),
            ]),
        });
    });

    it('pipeline stages are in correct order', () => {
        const resources = template.findResources(
            'AWS::CodePipeline::Pipeline'
        );
        const pipeline = Object.values(resources)[0];
        const stageNames = pipeline.Properties.Stages.map(
            (s: { Name: string }) => s.Name
        );

        const sourceIndex = stageNames.indexOf('Source');
        const buildIndex = stageNames.indexOf('Build');
        const testIndex = stageNames.indexOf('Test');
        const prodIndex = stageNames.indexOf('Prod');

        expect(sourceIndex).toBeLessThan(buildIndex);
        expect(buildIndex).toBeLessThan(testIndex);
        expect(testIndex).toBeLessThan(prodIndex);
    });
});
