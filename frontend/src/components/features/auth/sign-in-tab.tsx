'use client';

import { CardContent } from '@/ui/shadcn/card';
import { useForm } from 'react-hook-form';
import {
    SignInForm,
    signInFormSchema,
} from '@/lib/zod-form-schemas/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { resendSignUpCode, signIn } from 'aws-amplify/auth';
import SubmitAuthForm from './submit-form';
import { passwordStorage } from '@/lib/utils/password-storage';
import React, { useState } from 'react';
import FormInput from '@/ui/form-input';

interface LoginDisabled {
    state: boolean;
    buttonLabel: string;
}

const defaultLoginDisabled: LoginDisabled = {
    state: false,
    buttonLabel: '',
};

const activeLoginDisabled: LoginDisabled = {
    state: true,
    buttonLabel: 'Try again in 15 seconds',
};

interface Props {
    onNeedsConfirmation: (email: string) => void;
    onForgotPassword: () => void;
}

export default function SignInTab({
    onNeedsConfirmation,
    onForgotPassword,
}: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loginDisabled, setLoginDisabled] =
        useState<LoginDisabled>(defaultLoginDisabled);

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
        setSuccessMessage('');
    }, [formValues]);

    async function handleNeedsConfirmation(email: string, password: string) {
        try {
            await resendSignUpCode({ username: email });
            passwordStorage.set(password);
            onNeedsConfirmation(email);
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
                await handleNeedsConfirmation(data.email, data.password);
                return;
            }

            if (isSignedIn) {
                passwordStorage.clear();
                setSuccessMessage('Successfully signed in! Redirecting...');
            }
        } catch (err) {
            console.error('Sign in error: ', err);

            if (err instanceof Error) {
                if (err.message == 'Password attempts exceeded') {
                    setLoginDisabled(activeLoginDisabled);
                    setTimeout(() => {
                        setLoginDisabled(defaultLoginDisabled);
                    }, 15000);
                }
                if ('name' in err && err.name === 'UserNotConfirmedException') {
                    await handleNeedsConfirmation(data.email, data.password);
                }

                setError(err.message);
            } else {
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
                <FormInput
                    form={signInForm}
                    id="sign-in-email"
                    inputName="email"
                    placeholder="blacksmith@skillforge.com"
                    label="Email"
                />
                <FormInput
                    form={signInForm}
                    id="sign-in-password"
                    inputName="password"
                    placeholder="enter password"
                    label="Password"
                    type="password"
                />
                <div className="text-right">
                    <button
                        type="button"
                        onClick={onForgotPassword}
                        className="cursor-pointer text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Forgot password?
                    </button>
                </div>
                <SubmitAuthForm
                    id="submit-signin"
                    buttonText={
                        loginDisabled.state
                            ? loginDisabled.buttonLabel
                            : 'Sign In'
                    }
                    buttonLoadingText="Signing in..."
                    isLoading={isLoading}
                    disabled={loginDisabled.state}
                />
            </CardContent>
        </form>
    );
}
