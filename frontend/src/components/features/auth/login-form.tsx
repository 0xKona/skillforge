'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignInForm, signInFormSchema } from '@/lib/schemas/auth-schema';
import { resendSignUpCode, signIn } from '@/lib/api/auth';
import { passwordStorage } from '@/lib/helpers/password-storage';
import { Button } from '@/ui/shadcn/button';
import FormInput from '@/ui/form-input';
import React, { useState } from 'react';

interface Props {
    onNeedsConfirmation: (email: string) => void;
    onForgotPassword: () => void;
}

export function LoginForm({ onNeedsConfirmation, onForgotPassword }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const form = useForm<SignInForm>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: { email: '', password: '' },
    });

    const handleSignIn = async (data: SignInForm) => {
        setIsLoading(true);
        setError('');

        try {
            const { isSignedIn, nextStep } = await signIn({
                username: data.email,
                password: data.password,
            });

            if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
                await resendSignUpCode({ username: data.email });
                passwordStorage.set(data.password);
                onNeedsConfirmation(data.email);
                return;
            }

            if (isSignedIn) {
                passwordStorage.clear();
            }
        } catch (err) {
            if (err instanceof Error) {
                if ('name' in err && err.name === 'UserNotConfirmedException') {
                    await resendSignUpCode({ username: data.email });
                    passwordStorage.set(data.password);
                    onNeedsConfirmation(data.email);
                    return;
                }
                setError(err.message);
            } else {
                setError('Login failed. Check your credentials.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-4">
            {error && (
                <div className="border-l-4 border-destructive pl-3 text-sm text-ash">
                    {error}
                </div>
            )}
            <FormInput
                form={form}
                id="login-email"
                inputName="email"
                placeholder="you@example.com"
                label="Email"
            />
            <FormInput
                form={form}
                id="login-password"
                inputName="password"
                placeholder="Enter your password"
                label="Password"
                type="password"
            />
            <div className="text-right">
                <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-sm text-ash hover:text-text-primary transition-colors"
                >
                    Forgot password?
                </button>
            </div>
            <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-flux hover:bg-flux-hover text-white font-medium rounded-md"
            >
                {isLoading ? 'Logging in...' : 'Login'}
            </Button>
        </form>
    );
}
