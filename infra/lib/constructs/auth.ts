import { Construct } from 'constructs';
import {
    CfnOutput,
    Duration,
    RemovalPolicy,
} from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import { StageConfig } from '../config/stage-config';
import { resourceName } from '../utils/naming';

export interface AuthConstructProps {
    stageConfig: StageConfig;
}

/**
 * Auth construct providing Cognito User Pool, User Pool Client, and Identity Pool.
 *
 * Replicates the current Amplify auth configuration:
 * - Email sign-in with OTP verification
 * - Custom attributes: preferredUsername, picture, custom:bio
 * - SPA client (no secret)
 * - Identity Pool for S3 access
 */
export class AuthConstruct extends Construct {
    public readonly userPool: cognito.UserPool;
    public readonly userPoolClient: cognito.UserPoolClient;
    public readonly identityPool: cognito.CfnIdentityPool;
    public readonly authenticatedRole: iam.Role;
    public readonly unauthenticatedRole: iam.Role;

    constructor(scope: Construct, id: string, props: AuthConstructProps) {
        super(scope, id);

        const { stageConfig } = props;

        // --- User Pool ---
        this.userPool = new cognito.UserPool(this, 'UserPool', {
            userPoolName: resourceName(stageConfig.stage, 'user-pool'),
            selfSignUpEnabled: true,
            signInAliases: {
                email: true,
            },
            autoVerify: {
                email: true,
            },
            userVerification: {
                emailSubject: 'Welcome to SkillForge! Verify your email',
                emailBody: this.getVerificationEmailBody(),
                emailStyle: cognito.VerificationEmailStyle.CODE,
            },
            standardAttributes: {
                email: {
                    required: true,
                    mutable: true,
                },
                preferredUsername: {
                    required: false,
                    mutable: true,
                },
                profilePicture: {
                    required: false,
                    mutable: true,
                },
            },
            customAttributes: {
                bio: new cognito.StringAttribute({
                    mutable: true,
                    maxLen: 256,
                }),
            },
            passwordPolicy: {
                minLength: 8,
                requireUppercase: true,
                requireLowercase: true,
                requireDigits: true,
                requireSymbols: true,
                tempPasswordValidity: Duration.days(7),
            },
            accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
            deletionProtection: stageConfig.deletionProtection,
            removalPolicy: stageConfig.removalPolicy,
        });

        // --- User Pool Client (SPA — no secret) ---
        this.userPoolClient = this.userPool.addClient('AppClient', {
            userPoolClientName: resourceName(stageConfig.stage, 'app-client'),
            generateSecret: false,
            authFlows: {
                userSrp: true,
                custom: true,
                userPassword: true,
            },
            preventUserExistenceErrors: true,
            accessTokenValidity: Duration.hours(1),
            idTokenValidity: Duration.hours(1),
            refreshTokenValidity: Duration.days(30),
        });

        // --- Identity Pool ---
        this.identityPool = new cognito.CfnIdentityPool(this, 'IdentityPool', {
            identityPoolName: resourceName(stageConfig.stage, 'identity-pool'),
            allowUnauthenticatedIdentities: true,
            cognitoIdentityProviders: [
                {
                    clientId: this.userPoolClient.userPoolClientId,
                    providerName: this.userPool.userPoolProviderName,
                },
            ],
        });

        // --- IAM Roles for Identity Pool ---
        this.authenticatedRole = new iam.Role(this, 'AuthenticatedRole', {
            roleName: resourceName(stageConfig.stage, 'auth-role'),
            assumedBy: new iam.FederatedPrincipal(
                'cognito-identity.amazonaws.com',
                {
                    StringEquals: {
                        'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
                    },
                    'ForAnyValue:StringLike': {
                        'cognito-identity.amazonaws.com:amr': 'authenticated',
                    },
                },
                'sts:AssumeRoleWithWebIdentity'
            ),
        });

        this.unauthenticatedRole = new iam.Role(this, 'UnauthenticatedRole', {
            roleName: resourceName(stageConfig.stage, 'unauth-role'),
            assumedBy: new iam.FederatedPrincipal(
                'cognito-identity.amazonaws.com',
                {
                    StringEquals: {
                        'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
                    },
                    'ForAnyValue:StringLike': {
                        'cognito-identity.amazonaws.com:amr': 'unauthenticated',
                    },
                },
                'sts:AssumeRoleWithWebIdentity'
            ),
        });

        // Attach roles to Identity Pool
        new cognito.CfnIdentityPoolRoleAttachment(this, 'RoleAttachment', {
            identityPoolId: this.identityPool.ref,
            roles: {
                authenticated: this.authenticatedRole.roleArn,
                unauthenticated: this.unauthenticatedRole.roleArn,
            },
        });

        // --- Outputs ---
        new CfnOutput(this, 'UserPoolId', {
            value: this.userPool.userPoolId,
            description: 'Cognito User Pool ID',
        });

        new CfnOutput(this, 'UserPoolClientId', {
            value: this.userPoolClient.userPoolClientId,
            description: 'Cognito User Pool Client ID',
        });

        new CfnOutput(this, 'IdentityPoolId', {
            value: this.identityPool.ref,
            description: 'Cognito Identity Pool ID',
        });
    }

    private getVerificationEmailBody(): string {
        return `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #334155; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; }
    .header { background-color: #f97316; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 30px 20px; text-align: center; }
    .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #f97316; margin: 30px 0; padding: 15px; background-color: #fff7ed; border-radius: 4px; display: inline-block; }
    .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin:0;">SkillForge</h1>
    </div>
    <div class="content">
      <h2 style="margin-top:0;">Verify your email address</h2>
      <p>Thanks for starting your journey with SkillForge! Please use the following verification code to complete your registration:</p>
      <div class="code">{####}</div>
      <p>This code will expire in 24 hours.</p>
    </div>
    <div class="footer">
      <p>If you didn't create an account with SkillForge, you can safely ignore this email.</p>
    </div>
  </div>
</body>
</html>`;
    }
}
