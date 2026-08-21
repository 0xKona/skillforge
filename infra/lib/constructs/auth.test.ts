import { App, Stack } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { AuthConstruct } from './auth';
import { stageConfigs } from '../config/stage-config';

describe('AuthConstruct', () => {
    describe('test stage', () => {
        const app = new App();
        const stack = new Stack(app, 'TestStack');
        new AuthConstruct(stack, 'Auth', {
            stageConfig: stageConfigs.test,
        });
        const template = Template.fromStack(stack);

        it('creates a User Pool with correct name', () => {
            template.hasResourceProperties('AWS::Cognito::UserPool', {
                UserPoolName: 'skillforge-test-user-pool',
            });
        });

        it('enables self sign-up', () => {
            template.hasResourceProperties('AWS::Cognito::UserPool', {
                AdminCreateUserConfig: {
                    AllowAdminCreateUserOnly: false,
                },
            });
        });

        it('configures email sign-in with code verification', () => {
            template.hasResourceProperties('AWS::Cognito::UserPool', {
                AutoVerifiedAttributes: ['email'],
                UsernameAttributes: ['email'],
            });
        });

        it('sets password policy', () => {
            template.hasResourceProperties('AWS::Cognito::UserPool', {
                Policies: {
                    PasswordPolicy: {
                        MinimumLength: 8,
                        RequireUppercase: true,
                        RequireLowercase: true,
                        RequireNumbers: true,
                        RequireSymbols: true,
                    },
                },
            });
        });

        it('does not enable deletion protection on test', () => {
            template.hasResourceProperties('AWS::Cognito::UserPool', {
                DeletionProtection: 'INACTIVE',
            });
        });

        it('sets removal policy to destroy on test', () => {
            template.hasResource('AWS::Cognito::UserPool', {
                DeletionPolicy: 'Delete',
            });
        });

        it('creates a User Pool Client with no secret', () => {
            template.hasResourceProperties(
                'AWS::Cognito::UserPoolClient',
                {
                    ClientName: 'skillforge-test-app-client',
                    GenerateSecret: false,
                }
            );
        });

        it('creates an Identity Pool', () => {
            template.hasResourceProperties(
                'AWS::Cognito::IdentityPool',
                {
                    IdentityPoolName: 'skillforge-test-identity-pool',
                    AllowUnauthenticatedIdentities: true,
                }
            );
        });

        it('creates authenticated and unauthenticated IAM roles', () => {
            template.resourceCountIs('AWS::IAM::Role', 2);
        });

        it('attaches roles to identity pool', () => {
            template.resourceCountIs(
                'AWS::Cognito::IdentityPoolRoleAttachment',
                1
            );
        });
    });

    describe('prod stage', () => {
        const app = new App();
        const stack = new Stack(app, 'ProdStack');
        new AuthConstruct(stack, 'Auth', {
            stageConfig: stageConfigs.prod,
        });
        const template = Template.fromStack(stack);

        it('enables deletion protection on prod', () => {
            template.hasResourceProperties('AWS::Cognito::UserPool', {
                DeletionProtection: 'ACTIVE',
            });
        });

        it('sets removal policy to retain on prod', () => {
            template.hasResource('AWS::Cognito::UserPool', {
                DeletionPolicy: 'Retain',
            });
        });

        it('uses prod naming', () => {
            template.hasResourceProperties('AWS::Cognito::UserPool', {
                UserPoolName: 'skillforge-prod-user-pool',
            });
        });
    });
});
