import { defineAuth } from '@aws-amplify/backend';

/**
 * Generates a unique friendly name for the User Pool based on the environment.
 * - Local Sandbox: skillForgeAuth-<username>
 * - CI/CD Branch: skillForgeAuth-<branch>
 * - Production (main): skillForgeAuth-prod
 */
const getFriendlyName = () => {
    const branch = process.env.AWS_BRANCH;
    const userName = process.env.USER || process.env.USERNAME;
    const user = userName?.split('.')[0];

    if (branch) {
        return branch === 'main'
            ? 'skillForgeAuth-prod'
            : `skillForgeAuth-${branch}`;
    }

    if (user) {
        return `skillForgeAuth-${user}`;
    }

    return 'skillForgeAuth';
};

export const auth = defineAuth({
    // User friendly name for user pool
    name: getFriendlyName(),
    loginWith: {
        email: {
            verificationEmailStyle: 'CODE',
            verificationEmailSubject:
                'Welcome to SkillForge! Verify your email',
            verificationEmailBody: (createCode) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #334155; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; }
    .header { background-color: #f97316; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 30px 20px; text-align: center; }
    .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #f97316; margin: 30px 0; padding: 15px; background-color: #fff7ed; border-radius: 4px; display: inline-block; }
    .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 20px; border-top: 1px solid #e2e8f0; pt-4; }
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
      
      <div class="code">${createCode()}</div>
      
      <p>This code will expire in 24 hours.</p>
    </div>
    <div class="footer">
      <p>If you didn't create an account with SkillForge, you can safely ignore this email.</p>
      <p>&copy; ${new Date().getFullYear()} SkillForge. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`,
        },
    },
    userAttributes: {
        preferredUsername: {
            mutable: true,
            required: false,
        },
        // Maps to standard 'picture' attribute
        profilePicture: {
            mutable: true,
            required: false,
        },
        'custom:bio': {
            dataType: 'String',
            mutable: true,
            maxLen: 256,
        },
    },
});
