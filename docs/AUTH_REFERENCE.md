# Quick Reference: Authentication Patterns

## Client Components

### Using the Auth Hook

```typescript
"use client";
import { useAuth } from "@/hooks/use-auth";

export default function MyComponent() {
  const {
    userId,           // User ID
    userAttributes,   // { email, email_verified, sub, etc. }
    loading,          // true while checking auth
    error,            // Error message if any
    isAuthenticated,  // Boolean
    signOut,          // () => Promise<void>
    refreshAuth       // () => Promise<void>
  } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please sign in</div>;

  return <div>Welcome {userAttributes?.email}</div>;
}
```

## Server Components

### Check Authentication

```typescript
import { isAuthenticated } from "@/utlils/amplify/server-utils";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  if (!await isAuthenticated()) {
    redirect("/login");
  }
  return <div>Protected Content</div>;
}
```

### Get User Data

```typescript
import { getUserAttributes } from "@/utlils/amplify/server-utils";

export default async function ProfilePage() {
  const attributes = await getUserAttributes();
  return <div>{attributes?.email}</div>;
}
```

## API Routes

### Verify Authentication

```typescript
import { runWithAmplifyServerContext } from '@/utlils/amplify/server-utils'
import { fetchAuthSession } from 'aws-amplify/auth/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const session = await runWithAmplifyServerContext({
        nextServerContext: { request },
        operation: (ctx) => fetchAuthSession(ctx),
    })

    if (!session?.tokens) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ data: 'Protected data' })
}
```

## Authentication Actions

### Sign Up

```typescript
import { signUp } from 'aws-amplify/auth'

const { isSignUpComplete, userId } = await signUp({
    username: email,
    password: password,
    options: {
        userAttributes: { email },
    },
})
```

### Confirm Sign Up

```typescript
import { confirmSignUp } from 'aws-amplify/auth'

await confirmSignUp({
    username: email,
    confirmationCode: code,
})
```

### Sign In

```typescript
import { signIn } from 'aws-amplify/auth'

const { isSignedIn } = await signIn({
    username: email,
    password: password,
})
```

### Sign Out

```typescript
import { signOut } from 'aws-amplify/auth'

await signOut()
// or use the hook:
const { signOut } = useAuth()
await signOut() // Automatically redirects to /login
```

### Reset Password

```typescript
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth'

// Step 1: Request reset code
await resetPassword({ username: email })

// Step 2: Confirm with code
await confirmResetPassword({
    username: email,
    confirmationCode: code,
    newPassword: newPassword,
})
```

## Route Protection (Middleware)

### Add Protected Routes

Edit `/src/middleware.ts`:

```typescript
const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/settings', // Add your routes here
]
```

### Add Auth Routes

```typescript
const authRoutes = [
    '/login',
    '/signup', // Add your auth routes here
]
```

## User Attributes Available

```typescript
userAttributes = {
    sub: 'user-id-uuid',
    email: 'user@example.com',
    email_verified: true,
    name: 'John Doe', // If configured
    phone_number: '+1234567', // If configured
    // ... other custom attributes
}
```
