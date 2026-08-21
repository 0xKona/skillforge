import { Construct } from 'constructs';
import { CfnOutput, SecretValue } from 'aws-cdk-lib';
import * as amplify from '@aws-cdk/aws-amplify-alpha';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import { StageConfig } from '../config/stage-config';
import { resourceName } from '../utils/naming';

export interface HostingConstructProps {
    stageConfig: StageConfig;
    /**
     * GitHub OAuth token stored in Secrets Manager.
     * Used by Amplify to access the repository.
     */
    githubTokenSecretName: string;
    /** GitHub owner (user or org) */
    repoOwner: string;
    /** GitHub repository name */
    repoName: string;
    /** Branch to deploy */
    branchName: string;
    /** Backend environment variables to inject into the build */
    environmentVariables: Record<string, string>;
    /**
     * Custom domain configuration (optional).
     * When provided, maps a subdomain to the Amplify branch.
     */
    customDomain?: {
        /** Root domain name (e.g., 'konarobinson.com') */
        domainName: string;
        /** Subdomain prefix (e.g., 'skillforge' or 'test-skillforge') */
        subDomain: string;
    };
    /**
     * Basic auth credentials (optional).
     * When provided, enables HTTP Basic Auth on the branch.
     * Useful for protecting test environments.
     */
    basicAuth?: {
        username: string;
        password: string;
    };
}

/**
 * Hosting construct that defines an Amplify Hosting app for the Next.js
 * static export frontend.
 *
 * - Builds from the frontend/ subfolder in the monorepo
 * - Static export (output: 'export') -> artifact dir: out/
 * - Auto-build disabled (pipeline triggers builds)
 * - SPA rewrite rules for client-side routing
 * - Optional custom domain (Route 53 managed)
 * - Optional basic auth for non-prod environments
 */
export class HostingConstruct extends Construct {
    public readonly app: amplify.App;
    public readonly branch: amplify.Branch;
    public readonly appId: CfnOutput;

    constructor(scope: Construct, id: string, props: HostingConstructProps) {
        super(scope, id);

        const {
            stageConfig,
            githubTokenSecretName,
            repoOwner,
            repoName,
            branchName,
            environmentVariables,
            customDomain,
            basicAuth,
        } = props;

        // --- Amplify App ---
        this.app = new amplify.App(this, 'AmplifyApp', {
            appName: resourceName(stageConfig.stage, 'frontend'),
            sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
                owner: repoOwner,
                repository: repoName,
                oauthToken: SecretValue.secretsManager(githubTokenSecretName),
            }),
            autoBranchDeletion: false,
            environmentVariables: {
                ...environmentVariables,
                AMPLIFY_MONOREPO_APP_ROOT: 'frontend',
            },
            buildSpec: codebuild.BuildSpec.fromObjectToYaml({
                version: 1,
                applications: [
                    {
                        appRoot: 'frontend',
                        frontend: {
                            phases: {
                                preBuild: {
                                    commands: [
                                        'npm install -g bun',
                                        'bun install',
                                    ],
                                },
                                build: {
                                    commands: ['bun run build'],
                                },
                            },
                            artifacts: {
                                baseDirectory: 'out',
                                files: ['**/*'],
                            },
                            cache: {
                                paths: ['node_modules/**/*'],
                            },
                        },
                    },
                ],
            }),
            customRules: [
                // SPA fallback: serve index.html for all non-file routes
                new amplify.CustomRule({
                    source:
                        '</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>',
                    target: '/index.html',
                    status: amplify.RedirectStatus.REWRITE,
                }),
            ],
        });

        // --- Branch ---
        this.branch = this.app.addBranch(branchName, {
            autoBuild: false,
            stage: stageConfig.stage === 'prod' ? 'PRODUCTION' : 'DEVELOPMENT',
            basicAuth: basicAuth
                ? amplify.BasicAuth.fromCredentials(
                      basicAuth.username,
                      SecretValue.unsafePlainText(basicAuth.password)
                  )
                : undefined,
        });

        // --- Custom Domain ---
        if (customDomain) {
            const domain = this.app.addDomain(customDomain.domainName);
            domain.mapSubDomain(this.branch, customDomain.subDomain);

            new CfnOutput(this, 'CustomDomainUrl', {
                value: `https://${customDomain.subDomain}.${customDomain.domainName}`,
                description: 'Custom domain URL',
            });
        }

        // --- Outputs ---
        this.appId = new CfnOutput(this, 'AmplifyAppId', {
            value: this.app.appId,
            description: 'Amplify App ID',
        });

        new CfnOutput(this, 'AmplifyAppUrl', {
            value: `https://${branchName}.${this.app.defaultDomain}`,
            description: 'Amplify App URL (default domain)',
        });
    }
}
