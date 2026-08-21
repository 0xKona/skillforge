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
}

/**
 * Hosting construct that defines an Amplify Hosting app for the Next.js
 * static export frontend.
 *
 * - Builds from the frontend/ subfolder in the monorepo
 * - Static export (output: 'export') → artifact dir: out/
 * - Auto-build disabled (pipeline triggers builds)
 * - SPA rewrite rules for client-side routing
 */
export class HostingConstruct extends Construct {
    public readonly app: amplify.App;
    public readonly branch: amplify.Branch;

    constructor(scope: Construct, id: string, props: HostingConstructProps) {
        super(scope, id);

        const {
            stageConfig,
            githubTokenSecretName,
            repoOwner,
            repoName,
            branchName,
            environmentVariables,
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
                                    commands: ['npm ci'],
                                },
                                build: {
                                    commands: ['npm run build'],
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

        // --- Branch (auto-build disabled — pipeline triggers) ---
        this.branch = this.app.addBranch(branchName, {
            autoBuild: false,
            stage: stageConfig.stage === 'prod' ? 'PRODUCTION' : 'DEVELOPMENT',
        });

        // --- Outputs ---
        new CfnOutput(this, 'AmplifyAppId', {
            value: this.app.appId,
            description: 'Amplify App ID',
        });

        new CfnOutput(this, 'AmplifyAppUrl', {
            value: `https://${branchName}.${this.app.defaultDomain}`,
            description: 'Amplify App URL',
        });
    }
}
