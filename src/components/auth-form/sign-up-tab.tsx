'use client';

import { CardContent } from '@/components/ui/component-library/shadcn-components/card';
import React, { useState } from 'react';
import { signUp } from 'aws-amplify/auth';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpForm, signUpFormSchema } from '@/lib/form-schemas/auth-schema';
import FormInput from '@/components/ui/form-input';
import SubmitAuthForm from './submit-form';
import { useAuthFlowState, passwordStorage } from '@/lib/store/auth-form';

export default function SignUpTab() {
    // Local component state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Global state
    const { setNeedsConfirmation, setVerificationEmail } = useAuthFlowState();

    const form = useForm<SignUpForm>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
        },
    });

    // Clear messages when form values change
    const formValues = form.watch();
    React.useEffect(() => {
        setError('');
        setSuccessMessage('');
    }, [formValues]);

    const handleSignUp = async (data: z.infer<typeof signUpFormSchema>) => {
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            // Store password temporarily for auto sign-in after verification
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
                setVerificationEmail(data.email);
                setNeedsConfirmation(true);
            } else {
                setSuccessMessage('Account created successfully!');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign up');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(handleSignUp)}>
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
                {/* Email Input */}
                <FormInput
                    form={form}
                    id="signup-email"
                    inputName="email"
                    placeholder="blacksmith@skillforge.com"
                    label="Email"
                />
                {/* Username Input */}
                <FormInput
                    form={form}
                    id="signup-username"
                    inputName="username"
                    placeholder="Forger"
                    label="Username"
                />
                {/* Password Input */}
                <FormInput
                    form={form}
                    id="signup-password"
                    inputName="password"
                    placeholder="Enter your password"
                    label="Password"
                    type="password"
                />
                {/* Confirm Password Input */}
                <FormInput
                    form={form}
                    id="signup-confirm-password"
                    inputName="confirmPassword"
                    placeholder="Confirm your password"
                    label="Confirm Password"
                    type="password"
                />
                {/* Submit buttons Or Google login */}
                <SubmitAuthForm
                    id="submit-signup"
                    buttonText="Sign Up"
                    buttonLoadingText="Creating account..."
                    isLoading={isLoading}
                />
            </CardContent>
        </form>
    );
}
