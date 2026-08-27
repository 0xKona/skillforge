'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpForm, signUpFormSchema } from '@/lib/schemas/auth-schema';
import { signUp } from '@/lib/api/auth';
import { passwordStorage } from '@/lib/helpers/password-storage';
import { Button } from '@/ui/shadcn/button';
import FormInput from '@/ui/form-input';
import { useState } from 'react';

interface Props {
    onNeedsConfirmation: (email: string) => void;
}

export function SignupForm({ onNeedsConfirmation }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const form = useForm<SignUpForm>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
        },
    });

    const handleSignUp = async (data: SignUpForm) => {
        setIsLoading(true);
        setError('');

        try {
            passwordStorage.set(data.password);

            const { nextStep } = await signUp({
                username: data.email,
                password: data.password,
                options: {
                    userAttributes: {
                        email: data.email,
                        preferred_username: data.username,
                        picture:
                            'https://img.icons8.com/?size=100&id=99268&format=png&color=ffffff',
                    },
                },
            });

            if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
                onNeedsConfirmation(data.email);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Sign up failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
            {error && (
                <div className="border-l-4 border-destructive pl-3 text-sm text-ash">
                    {error}
                </div>
            )}
            <FormInput
                form={form}
                id="signup-email"
                inputName="email"
                placeholder="you@example.com"
                label="Email"
            />
            <FormInput
                form={form}
                id="signup-username"
                inputName="username"
                placeholder="Your display name"
                label="Username"
            />
            <FormInput
                form={form}
                id="signup-password"
                inputName="password"
                placeholder="At least 8 characters"
                label="Password"
                type="password"
            />
            <FormInput
                form={form}
                id="signup-confirm"
                inputName="confirmPassword"
                placeholder="Confirm your password"
                label="Confirm password"
                type="password"
            />
            <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-flux hover:bg-flux-hover text-white font-medium rounded-md"
            >
                {isLoading ? 'Creating account...' : 'Sign up'}
            </Button>
        </form>
    );
}
