# Authentication Reference

## Overview

SkillForge uses AWS Cognito for authentication. The frontend is a static export so all auth is client-side via the `aws-amplify/auth` library. Route protection is handled by a client-side `AuthGuard` component.

## Client Auth Store

```typescript
'use client';
import { useClientAuth } from '@/lib/store/use-client-auth';

export default function MyComponent() {
    const {
        userId,           // Cognito sub
        userAttributes,   // { email, preferred_username, custom:bio, picture }
        loading,          // true while checking auth
        isAuthenticated,  // boolean
        avatarUrl,        // User's avatar URL
        signOut,          // () => Promise<void>
        checkAuthStatus,  // () => Promise<void>
    } = useClientAuth();

    if (loading) return <div>Loading...</div>;
    if (!isAuthenticated) return <div>Please sign in</div>;

    return <div>Welcome {userAttributes?.email}</div>;
}
```

## Route Protection (AuthGuard)

Protected routes are wrapped with `<AuthGuard>` in their layout files. This replaces the old server-side middleware approach.

```typescript
// src/app/forge/layout.tsx
import { AuthGuard } from '@/components/providers/auth-guard';

export default function ForgeLayout({ children }) {
    return (
        <AuthGuard>
            {children}
        </AuthGuard>
    );
}
```

**Behaviour:**
- Shows a loading spinner while auth state resolves
- Redirects to `/login` if the user is not authenticated
- Renders children once authenticated

**Protected routes:** `/forge`, `/anvil`, `/profile`

## Auth Actions

### Sign Up

```typescript
import { signUp } from 'aws-amplify/auth';

await signUp({
    username: email,
    password,
    options: { userAttributes: { email } },
});
```

### Confirm Sign Up (OTP)

```typescript
import { confirmSignUp } from 'aws-amplify/auth';

await confirmSignUp({ username: email, confirmationCode: code });
```

### Sign In

```typescript
import { signIn } from 'aws-amplify/auth';

const { isSignedIn } = await signIn({ username: email, password });
```

### Sign Out

```typescript
import { signOut } from 'aws-amplify/auth';
await signOut();

// Or via the store (clears local state too):
const { signOut } = useClientAuth();
await signOut();
```

### Reset Password

```typescript
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';

await resetPassword({ username: email });
await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
```

## API Authentication

The REST API client (`src/lib/api/client.ts`) automatically attaches the Cognito ID token to every request:

```typescript
import { apiGet } from '@/lib/api/client';

// Token is injected automatically via fetchAuthSession()
const cvs = await apiGet('/cv');
```

If the token is missing or expired, the client throws an `ApiError` with status 401.

## User Attributes

| Attribute | Description |
|-----------|-------------|
| `sub` | Unique user ID (used as owner in DynamoDB) |
| `email` | User's email address |
| `preferred_username` | Display name |
| `picture` | Avatar URL (S3 public URL) |
| `custom:bio` | User biography (max 256 chars) |

## Amplify Configuration

Amplify is configured client-side in `src/components/providers/configure-amplify-client.tsx` with Auth and Storage only (no GraphQL). Config values come from `NEXT_PUBLIC_*` environment variables.
