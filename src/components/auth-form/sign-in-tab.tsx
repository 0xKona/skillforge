'use client';

import { CardContent } from '@/components/ui/shadcn/card';
import { useForm } from 'react-hook-form';
import { SignInForm, signInFormSchema } from '@/lib/form-schemas/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { resendSignUpCode, signIn } from 'aws-amplify/auth';
import FormInput from '../ui/form-input';
import SubmitAuthForm from './submit-form';
import { useAuthFlowState, passwordStorage } from '@/store/auth-form';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

export default function SignInTab() {
    // Local component
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Global state
    const {
        setNeedsConfirmation,
        setVerificationEmail,
        setShowForgotPassword,
    } = useAuthFlowState();

    const router = useRouter();
    const searchParams = useSearchParams();

    const signInForm = useForm<SignInForm>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    // Clear messages when form values change
    const formValues = signInForm.watch();
    React.useEffect(() => {
        setError('');
        setSuccessMessage('');
    }, [formValues]);

    async function handleNeedsConfirmation(email: string, password: string) {
        try {
            await resendSignUpCode({ username: email });

            // Store email in global state and password in session storage
            setVerificationEmail(email);
            passwordStorage.set(password);

            // Switch to verification view
            setNeedsConfirmation(true);
        } catch (err) {
            console.error('Error resending code:', err);
            setError('Failed to resend verification code. Please try again.');
        }
    }

    const handleSignIn = async (data: SignInForm) => {
        try {
            setIsLoading(true);
            setError('');
            setSuccessMessage('');

            const { isSignedIn, nextStep } = await signIn({
                username: data.email,
                password: data.password,
            });

            if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
                // User needs to confirm account
                await handleNeedsConfirmation(data.email, data.password);
                return; // Exit early, component will switch to verification view
            }

            if (isSignedIn) {
                // Clear any stored data
                passwordStorage.clear();

                // Redirect to desired page or dashboard by default
                const redirectTo =
                    searchParams?.get('redirectTo') || '/dashboard';
                router.push(redirectTo);
            }
        } catch (err) {
            console.error('Sign in error: ', err);

            // Type guard to check if error is an Error object
            if (err instanceof Error) {
                // Check for specific Cognito errors
                if ('name' in err && err.name === 'UserNotConfirmedException') {
                    await handleNeedsConfirmation(data.email, data.password);
                    return;
                }

                setError(err.message);
            } else {
                // Fallback for unknown error types
                setError('Failed to sign in. Please check your credentials.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={signInForm.handleSubmit(handleSignIn)}>
            <CardContent className="space-y-4">
                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 rounded-md">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="p-3 text-sm text-green-500 bg-green-50 dark:bg-green-900/10 rounded-md">
                        {successMessage}
                    </div>
                )}
                {/* Email input */}
                <FormInput
                    form={signInForm}
                    id="sign-in-email"
                    inputName="email"
                    placeholder="blacksmith@skillforge.com"
                    label="Email"
                />
                {/* Password input */}
                <FormInput
                    form={signInForm}
                    id="sign-in-password"
                    inputName="password"
                    placeholder="enter password"
                    label="Password"
                    type="password"
                />
                {/* Forgot Password Link */}
                <div className="text-right">
                    <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="cursor-pointer text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Forgot password?
                    </button>
                </div>
                {/* Submit buttons Or Google login */}
                <SubmitAuthForm
                    buttonText="Sign In"
                    buttonLoadingText="Signing in..."
                    isLoading={isLoading}
                />
            </CardContent>
        </form>
    );
}
