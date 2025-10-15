const amplifyConfig = {
  aws_project_region: process.env.NEXT_PUBLIC_AWS_REGION,
  aws_cognito_region: process.env.NEXT_PUBLIC_AWS_REGION,
  aws_user_pools_id: process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id:
    process.env.NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID,
  oauth: {
    domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN!,
    scopes: ['openid', 'email', 'profile', 'aws.cognito.signin.user.admin'],
    redirectSignIn: [process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN || 'http://localhost:3000/'],
    redirectSignOut: [process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT || 'http://localhost:3000/'],
    responseType: 'code',
  },
};

export { amplifyConfig };