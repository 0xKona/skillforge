'use client';

import { useState } from 'react';
import { AuthCard } from '@/components/features/auth/auth-card';
import { LoginForm } from '@/components/features/auth/login-form';
import { SignupForm } from '@/components/features/auth/signup-form';
import { ForgotPassword } from '@/components/features/auth/forgot-password';
import { VerifyCode } from '@/components/features/auth/verify-code-form';

type AuthView = 'default' | 'forgot' | 'verify';

export default function LoginPage() {
    const [view, setView] = useState<AuthView>('default');
    const [verificationEmail, setVerificationEmail] = useState('');

    const handleNeedsConfirmation = (email: string) => {
        setVerificationEmail(email);
        setView('verify');
    };

    return (
        <main className="flex items-center justify-center min-h-[calc(100vh-56px)] bg-graphite px-4">
            {view === 'default' && (
                <AuthCard
                    loginContent={
                        <LoginForm
                            onNeedsConfirmation={handleNeedsConfirmation}
                            onForgotPassword={() => setView('forgot')}
                        />
                    }
                    signupContent={
                        <SignupForm
                            onNeedsConfirmation={handleNeedsConfirmation}
                        />
                    }
                />
            )}

            {view === 'forgot' && (
                <div className="w-full max-w-sm rounded-xl border border-border-emphasis bg-gunmetal p-6">
                    <ForgotPassword onBack={() => setView('default')} />
                </div>
            )}

            {view === 'verify' && (
                <div className="w-full max-w-sm rounded-xl border border-border-emphasis bg-gunmetal p-6">
                    <VerifyCode
                        email={verificationEmail}
                        onBack={() => setView('default')}
                    />
                </div>
            )}
        </main>
    );
}
