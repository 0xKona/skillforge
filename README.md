# SkillForge

A modern CV/Resume builder application that allows users to create, manage, and customize professional CVs using a modular "ingot" system. Built with Next.js, AWS Amplify, and TypeScript.

## Features

- **Authentication** - Secure user authentication with AWS Cognito
- **Modular CV Building** - Create CVs using reusable "ingots" (education, experience, skills, etc.)
- **Cloud Storage** - All data securely stored in AWS DynamoDB
- **Customizable Templates** - Flexible CV sections with various display options
- **Responsive Design** - Works seamlessly across desktop and mobile devices
- **Auto-save** - Never lose your work with automatic saving

## Screenshots

### Home Page
![SkillForge Home](docs/screenshots/skillforge_home.png)

### Forge Builder
![SkillForge Forge](docs/screenshots/skillforge_forge.png)

### Anvil Interface
![SkillForge Anvil](docs/screenshots/skillforge_anvil.png)

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- AWS Amplify CLI (for backend deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/skillforge.git
cd skillforge

# Install dependencies
npm install

# Start the AWS Amplify sandbox (required for backend services)
npm run sandbox:start

# In a new terminal, start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run sandbox:start` - Start AWS Amplify sandbox
- `npm run type-check` - Run TypeScript type checking

## Documentation

For more detailed information, check out these guides in the `docs/` folder:

- **[Amplify Setup](docs/AMPLIFY.md)** - AWS Amplify backend configuration and deployment
- **[Authentication Reference](docs/AUTH_REFERENCE.md)** - User authentication flows and implementation
- **[Components Guide](docs/COMPONENTS_FOLDER.md)** - Component structure and organization
- **[Color Scheme](docs/COLOR_SCHEME.md)** - Design system and color palette
- **[Accessibility](docs/ACCESSIBILITY.md)** - Accessibility features and guidelines

## Project Structure

```
skillforge/
├── src/
│   ├── app/              # Next.js app routes
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and services
│   └── test-utils/      # Testing utilities
├── amplify/             # AWS Amplify backend configuration
├── diagrams/            # Architecture and flow diagrams
├── docs/                # Documentation
└── public/              # Static assets
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: AWS Amplify (DynamoDB, Cognito, S3)
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Testing**: Jest, React Testing Library
