import { App, Stack } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { HostingConstruct, HostingConstructProps } from './hosting';
import { stageConfigs } from '../config/stage-config';

const baseProps: Omit<HostingConstructProps, 'stageConfig' | 'customDomain' | 'basicAuth'> = {
    githubTokenSecretName: 'test/github-token',
    repoOwner: '0xKona',
    repoName: 'skillforge',
    branchName: 'main',
    environmentVariables: {
        NEXT_PUBLIC_API_URL: 'https://api.example.com/test',
        NEXT_PUBLIC_USER_POOL_ID: 'eu-west-2_test123',
        NEXT_PUBLIC_USER_POOL_CLIENT_ID: 'testclientid',
        NEXT_PUBLIC_IDENTITY_POOL_ID: 'eu-west-2:test-identity-pool',
        NEXT_PUBLIC_S3_BUCKET: 'test-bucket',
        NEXT_PUBLIC_AWS_REGION: 'eu-west-2',
    },
};

function createStack(options?: {
    stage?: 'dev' | 'test' | 'prod';
    customDomain?: { domainName: string; subDomain: string };
    basicAuth?: { username: string; password: string };
}) {
    const stage = options?.stage ?? 'test';
    const app = new App();
    const stack = new Stack(app, `${stage}-hosting-Stack`);
    new HostingConstruct(stack, 'Hosting', {
        ...baseProps,
        stageConfig: stageConfigs[stage],
        customDomain: options?.customDomain,
        basicAuth: options?.basicAuth,
    });
    return Template.fromStack(stack);
}

describe('HostingConstruct', () => {
    describe('base configuration', () => {
        const template = createStack();

        it('creates an Amplify App', () => {
            template.resourceCountIs('AWS::Amplify::App', 1);
        });

        it('creates an Amplify Branch', () => {
            template.resourceCountIs('AWS::Amplify::Branch', 1);
        });

        it('sets the correct app name', () => {
            template.hasResourceProperties('AWS::Amplify::App', {
                Name: 'skillforge-test-frontend',
            });
        });

        it('sets environment variables including monorepo root', () => {
            template.hasResourceProperties('AWS::Amplify::App', {
                EnvironmentVariables: Match.arrayWith([
                    Match.objectLike({
                        Name: 'AMPLIFY_MONOREPO_APP_ROOT',
                        Value: 'frontend',
                    }),
                ]),
            });
        });

        it('sets branch stage to DEVELOPMENT for test', () => {
            template.hasResourceProperties('AWS::Amplify::Branch', {
                Stage: 'DEVELOPMENT',
            });
        });

        it('disables auto-build', () => {
            template.hasResourceProperties('AWS::Amplify::Branch', {
                EnableAutoBuild: false,
            });
        });
    });

    describe('prod stage', () => {
        const template = createStack({ stage: 'prod' });

        it('sets branch stage to PRODUCTION', () => {
            template.hasResourceProperties('AWS::Amplify::Branch', {
                Stage: 'PRODUCTION',
            });
        });
    });

    describe('custom domain', () => {
        const template = createStack({
            customDomain: {
                domainName: 'konarobinson.com',
                subDomain: 'test-skillforge',
            },
        });

        it('creates an Amplify Domain', () => {
            template.resourceCountIs('AWS::Amplify::Domain', 1);
        });

        it('configures the correct domain name', () => {
            template.hasResourceProperties('AWS::Amplify::Domain', {
                DomainName: 'konarobinson.com',
            });
        });

        it('maps the subdomain to the branch', () => {
            template.hasResourceProperties('AWS::Amplify::Domain', {
                SubDomainSettings: Match.arrayWith([
                    Match.objectLike({
                        Prefix: 'test-skillforge',
                    }),
                ]),
            });
        });

        it('outputs the custom domain URL', () => {
            const outputs = template.findOutputs('*');
            const outputValues = Object.values(outputs).map(
                (o) => (o as { Value: string }).Value
            );
            expect(outputValues).toContain(
                'https://test-skillforge.konarobinson.com'
            );
        });
    });

    describe('without custom domain', () => {
        const template = createStack();

        it('does not create an Amplify Domain', () => {
            template.resourceCountIs('AWS::Amplify::Domain', 0);
        });
    });

    describe('basic auth', () => {
        const template = createStack({
            basicAuth: {
                username: 'skilltester',
                password: 'skilltester',
            },
        });

        it('enables basic auth on the branch via BasicAuthConfig', () => {
            template.hasResourceProperties('AWS::Amplify::Branch', {
                BasicAuthConfig: Match.objectLike({
                    EnableBasicAuth: true,
                }),
            });
        });

        it('sets the basic auth credentials', () => {
            template.hasResourceProperties('AWS::Amplify::Branch', {
                BasicAuthConfig: Match.objectLike({
                    EnableBasicAuth: true,
                    Username: 'skilltester',
                    Password: 'skilltester',
                }),
            });
        });
    });

    describe('without basic auth', () => {
        const template = createStack();

        it('does not enable basic auth on the branch', () => {
            template.hasResourceProperties('AWS::Amplify::Branch', {
                EnableBasicAuth: Match.absent(),
            });
        });
    });

    describe('prod with custom domain and no basic auth', () => {
        const template = createStack({
            stage: 'prod',
            customDomain: {
                domainName: 'konarobinson.com',
                subDomain: 'skillforge',
            },
        });

        it('maps skillforge subdomain', () => {
            template.hasResourceProperties('AWS::Amplify::Domain', {
                SubDomainSettings: Match.arrayWith([
                    Match.objectLike({
                        Prefix: 'skillforge',
                    }),
                ]),
            });
        });

        it('does not enable basic auth', () => {
            template.hasResourceProperties('AWS::Amplify::Branch', {
                EnableBasicAuth: Match.absent(),
            });
        });
    });
});
