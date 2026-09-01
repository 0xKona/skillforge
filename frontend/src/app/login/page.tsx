'use client';

import { useState } from 'react';
import { AuthCard } from '@/components/features/auth/auth-card';
import { LoginForm } from '@/components/features/auth/login-form';
import { SignupForm } from '@/components/features/auth/signup-form';
import { ForgotPassword } from '@/components/features/auth/forgot-password';
import { VerifyCode } from '@/components/features/auth/verify-code-form';
import { AuthShell } from '@/components/features/auth/auth-shell';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

type AuthView = 'default' | 'forgot' | 'verify';

export default function LoginPage() {
    const [view, setView] = useState<AuthView>('default');
    const [verificationEmail, setVerificationEmail] = useState('');
    const shouldReduceMotion = useReducedMotion();

    const handleNeedsConfirmation = (email: string) => {
        setVerificationEmail(email);
        setView('verify');
    };

    return (
        <main className="relative flex min-h-[calc(100vh-56px)] items-center overflow-hidden bg-graphite px-4 py-10 sm:px-6">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border-default" />
            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                        opacity: 0,
                        y: shouldReduceMotion ? 0 : -6,
                    }}
                    transition={{
                        duration: shouldReduceMotion ? 0.01 : 0.22,
                        ease: [0.23, 1, 0.32, 1],
                    }}
                    className="relative mx-auto w-full"
                >
                    {view === 'default' && (
                        <AuthShell
                            title="Welcome to the forge"
                            description="Sign in to continue shaping a CV around the work that matters."
                        >
                            <AuthCard
                                loginContent={
                                    <LoginForm
                                        onNeedsConfirmation={
                                            handleNeedsConfirmation
                                        }
                                        onForgotPassword={() =>
                                            setView('forgot')
                                        }
                                    />
                                }
                                signupContent={
                                    <SignupForm
                                        onNeedsConfirmation={
                                            handleNeedsConfirmation
                                        }
                                    />
                                }
                            />
                        </AuthShell>
                    )}

                    {view === 'forgot' && (
                        <AuthShell
                            title="Reset your password"
                            description="We’ll send a verification code to the email linked to your account."
                        >
                            <ForgotPassword onBack={() => setView('default')} />
                        </AuthShell>
                    )}

                    {view === 'verify' && (
                        <AuthShell
                            title="Verify your email"
                            description="Enter the six-digit code we sent to finish setting up your account."
                        >
                            <VerifyCode
                                email={verificationEmail}
                                onBack={() => setView('default')}
                            />
                        </AuthShell>
                    )}
                </motion.div>
            </AnimatePresence>
        </main>
    );
}
