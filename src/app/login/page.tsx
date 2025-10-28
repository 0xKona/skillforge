import AuthForm from '@/components/auth-form/auth-form';
import { isAuthenticated } from '@/utlils/amplify/server-utils';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
    // Server-side auth gate using Amplify: redirect authenticated users
    const authed = await isAuthenticated();
    if (authed) {
        redirect('/dashboard');
    }

    // Not authenticated: render Auth UI. If a user needs confirmation,
    // the AuthForm will switch to the VerifyCode view via its Zustand state.
    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold tracking-tight mb-2">
                        SkillForge
                    </h1>
                    <p className="text-muted-foreground">
                        Welcome! Please sign in to continue.
                    </p>
                </div>
                <AuthForm />
            </div>
        </main>
    );
}
