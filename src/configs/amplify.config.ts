import { ResourcesConfig } from 'aws-amplify';

const amplifyConfig: ResourcesConfig = {
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID!,
            userPoolClientId:
                process.env.NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID!,
            loginWith: {
                oauth: {
                    domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN!,
                    scopes: ['openid', 'email', 'profile'],
                    redirectSignIn: [
                        process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN ||
                            'http://localhost:3000/',
                    ],
                    redirectSignOut: [
                        process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT ||
                            'http://localhost:3000/',
                    ],
                    responseType: 'code',
                },
            },
        },
    },
    // TODO FINISH CONFIG
    Storage: {
        S3: {
            bucket: process.env.NEXT_PUBLIC_AWS_S3_AVATAR,
            region: process.env.NEXT_PUBLIC_AWS_REGION,
            // default bucket metadata should be duplicated below with any additional buckets
            buckets: {
                '<your-default-bucket-friendly-name>': {
                    bucketName: process.env.NEXT_PUBLIC_AWS_S3_AVATAR as string,
                    region: process.env.NEXT_PUBLIC_AWS_REGION as string,
                    paths: {
                        'public/*': {
                            guest: ['get', 'list'],
                            authenticated: ['get', 'list', 'write', 'delete'],
                            groupsadmin: ['get', 'list', 'write', 'delete'],
                        },
                        'protected/*': {
                            guest: ['get', 'list'],
                            authenticated: ['get', 'list'],
                            groupsadmin: ['get', 'list', 'write', 'delete'],
                        },
                        'protected/${cognito-identity.amazonaws.com:sub}/*': {
                            entityidentity: ['get', 'list', 'write', 'delete'],
                        },
                        'admin/*': {
                            authenticated: ['get', 'list'],
                            groupsadmin: ['get', 'list', 'write', 'delete'],
                        },
                    },
                },
            },
        },
    },
};

export { amplifyConfig };
