import { Construct } from 'constructs';
import { CfnOutput, Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as path from 'path';
import { StageConfig } from '../config/stage-config';
import { resourceName } from '../utils/naming';

export interface ApiConstructProps {
    stageConfig: StageConfig;
    userPool: cognito.UserPool;
    cvTable: dynamodb.Table;
    ingotTable: dynamodb.Table;
}

/**
 * API construct providing REST API Gateway with:
 * - Cognito User Pool authorizer
 * - Go Lambda handlers for CV and Ingot CRUD
 * - CORS enabled
 *
 * Routes:
 *   POST   /cv          → createCV
 *   GET    /cv          → listCVs
 *   GET    /cv/{id}     → getCV
 *   PUT    /cv/{id}     → updateCV
 *   DELETE /cv/{id}     → deleteCV
 *
 *   POST   /ingot       → createIngot
 *   GET    /ingot       → listIngots (?type=xxx)
 *   GET    /ingot/{id}  → getIngot
 *   PUT    /ingot/{id}  → updateIngot
 *   DELETE /ingot/{id}  → deleteIngot
 */
export class ApiConstruct extends Construct {
    public readonly api: apigateway.RestApi;
    public readonly cvHandler: lambda.Function;
    public readonly ingotHandler: lambda.Function;

    constructor(scope: Construct, id: string, props: ApiConstructProps) {
        super(scope, id);

        const { stageConfig, userPool, cvTable, ingotTable } = props;

        // --- Cognito Authorizer ---
        const authorizer = new apigateway.CognitoUserPoolsAuthorizer(
            this,
            'CognitoAuthorizer',
            {
                cognitoUserPools: [userPool],
                authorizerName: resourceName(stageConfig.stage, 'authorizer'),
            }
        );

        // --- CV Lambda Handler ---
        this.cvHandler = new lambda.Function(this, 'CvHandler', {
            functionName: resourceName(stageConfig.stage, 'cv-handler'),
            runtime: lambda.Runtime.PROVIDED_AL2023,
            handler: 'bootstrap',
            code: lambda.Code.fromAsset(
                path.join(__dirname, '../../lambda/cv-handler'),
                {
                    bundling: {
                        image: lambda.Runtime.PROVIDED_AL2023.bundlingImage,
                        command: ['bash', '-c', 'cp /asset-input/bootstrap /asset-output/bootstrap'],
                        local: {
                            tryBundle(outputDir: string): boolean {
                                const { execSync } = require('child_process');
                                const handlerDir = path.join(__dirname, '../../lambda/cv-handler');
                                execSync(
                                    `cd ${handlerDir} && GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -tags lambda.norpc -o ${outputDir}/bootstrap .`,
                                    { stdio: 'inherit' }
                                );
                                return true;
                            },
                        },
                    },
                }
            ),
            architecture: lambda.Architecture.ARM_64,
            memorySize: 128,
            timeout: Duration.seconds(10),
            environment: {
                TABLE_NAME: cvTable.tableName,
            },
        });

        // --- Ingot Lambda Handler ---
        this.ingotHandler = new lambda.Function(this, 'IngotHandler', {
            functionName: resourceName(stageConfig.stage, 'ingot-handler'),
            runtime: lambda.Runtime.PROVIDED_AL2023,
            handler: 'bootstrap',
            code: lambda.Code.fromAsset(
                path.join(__dirname, '../../lambda/ingot-handler'),
                {
                    bundling: {
                        image: lambda.Runtime.PROVIDED_AL2023.bundlingImage,
                        command: ['bash', '-c', 'cp /asset-input/bootstrap /asset-output/bootstrap'],
                        local: {
                            tryBundle(outputDir: string): boolean {
                                const { execSync } = require('child_process');
                                const handlerDir = path.join(__dirname, '../../lambda/ingot-handler');
                                execSync(
                                    `cd ${handlerDir} && GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -tags lambda.norpc -o ${outputDir}/bootstrap .`,
                                    { stdio: 'inherit' }
                                );
                                return true;
                            },
                        },
                    },
                }
            ),
            architecture: lambda.Architecture.ARM_64,
            memorySize: 128,
            timeout: Duration.seconds(10),
            environment: {
                TABLE_NAME: ingotTable.tableName,
            },
        });

        // Grant DynamoDB permissions
        cvTable.grantReadWriteData(this.cvHandler);
        ingotTable.grantReadWriteData(this.ingotHandler);

        // --- REST API ---
        this.api = new apigateway.RestApi(this, 'RestApi', {
            restApiName: resourceName(stageConfig.stage, 'api'),
            description: `SkillForge ${stageConfig.stage} REST API`,
            defaultCorsPreflightOptions: {
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                allowMethods: apigateway.Cors.ALL_METHODS,
                allowHeaders: [
                    'Content-Type',
                    'Authorization',
                    'X-Amz-Date',
                    'X-Api-Key',
                ],
            },
            deployOptions: {
                stageName: stageConfig.stage,
            },
        });

        const authMethodOptions: apigateway.MethodOptions = {
            authorizer,
            authorizationType: apigateway.AuthorizationType.COGNITO,
        };

        // --- CV Routes ---
        const cvResource = this.api.root.addResource('cv');
        const cvIdResource = cvResource.addResource('{id}');

        const cvIntegration = new apigateway.LambdaIntegration(this.cvHandler);

        cvResource.addMethod('POST', cvIntegration, authMethodOptions);
        cvResource.addMethod('GET', cvIntegration, authMethodOptions);
        cvIdResource.addMethod('GET', cvIntegration, authMethodOptions);
        cvIdResource.addMethod('PUT', cvIntegration, authMethodOptions);
        cvIdResource.addMethod('DELETE', cvIntegration, authMethodOptions);

        // --- Ingot Routes ---
        const ingotResource = this.api.root.addResource('ingot');
        const ingotIdResource = ingotResource.addResource('{id}');

        const ingotIntegration = new apigateway.LambdaIntegration(
            this.ingotHandler
        );

        ingotResource.addMethod('POST', ingotIntegration, authMethodOptions);
        ingotResource.addMethod('GET', ingotIntegration, authMethodOptions);
        ingotIdResource.addMethod('GET', ingotIntegration, authMethodOptions);
        ingotIdResource.addMethod('PUT', ingotIntegration, authMethodOptions);
        ingotIdResource.addMethod(
            'DELETE',
            ingotIntegration,
            authMethodOptions
        );

        // --- Outputs ---
        new CfnOutput(this, 'ApiUrl', {
            value: this.api.url,
            description: 'REST API URL',
        });

        new CfnOutput(this, 'ApiId', {
            value: this.api.restApiId,
            description: 'REST API ID',
        });
    }
}
