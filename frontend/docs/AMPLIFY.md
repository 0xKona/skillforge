# Project Setup & Amplify Deployment

## Prerequisites

1. **Node.js**: Install version 18.17.0 or later.
    - Download from [nodejs.org](https://nodejs.org/) or use a version manager like `nvm`.

    ```bash
    node -v
    ```

2. **AWS CLI**: Install the AWS Command Line Interface.
    - **macOS**: `brew install awscli`
    - **Windows/Linux**: Follow [AWS documentation](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).

## AWS Configuration

1. **Create an IAM User**:
    - Log in to the [AWS Console](https://console.aws.amazon.com/).
    - Go to **IAM** > **Users** > **Create user**.
    - Name it (e.g., `amplify-dev`).
    - Attach the `AdministratorAccess` policy (for development sandboxes).
    - Create an **Access Key** for the user (Security credentials > Create access key > CLI).

2. **Configure Local Credentials**:
   Run the following command and enter your Access Key ID and Secret Access Key when prompted:

    ```bash
    aws configure
    ```

    - Default region: `us-east-1` (or your preferred region)
    - Default output format: `json`

## Running the Project

1. **Install Dependencies**:

    ```bash
    npm install
    ```

2. **Start Local Sandbox**:
   This deploys a temporary backend environment for development.

    ```bash
    npx ampx sandbox
    ```

3. **Start Frontend** (in a new terminal):
    ```bash
    npm run dev
    ```

## Managing Sandboxes

- **Delete Sandbox**: Removes all cloud resources created for the sandbox.
    ```bash
    npx ampx delete
    ```

## Deployment

This project is configured with github to auto deploy the main branch
