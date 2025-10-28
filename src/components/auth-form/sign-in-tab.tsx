'use client';

import { Card, CardContent } from '@/components/ui/shadcn/card';
import { TabsContent } from '@/components/ui/shadcn/tabs';
import { useForm } from 'react-hook-form';
import { SignInForm, signInFormSchema } from '@/lib/form-schemas/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { resendSignUpCode, signIn } from 'aws-amplify/auth';
import FormInput from '../ui/form-input';
import SubmitAuthForm from './submit-form';
import FormHeader from './form-header';
import { useAuthControlState, useSignUpFormState } from '@/store/auth-form';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignInTab() {
    const {
        isLoading,
        error,
        successMessage,
        setIsLoading,
        setNeedsConfirmation,
        setError,
        setSuccessMessage,
        setShowForgotPassword,
    } = useAuthControlState();

    const { setSignUpEmail, setUserPassword } = useSignUpFormState();

    const router = useRouter();
    const searchParams = useSearchParams();

    const signInForm = useForm<SignInForm>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function handleNeedsConfirmation(email: string, password: string) {
        await resendSignUpCode({ username: email });
        setNeedsConfirmation(true);
        setSignUpEmail(email);
        setUserPassword(password);

        setSuccessMessage(
            'Account not confirmed! Please check your email for the confirmation code.'
        );
    }

    const handleSignIn = async (data: SignInForm) => {
        try {
            setIsLoading(true);
            const { isSignedIn, nextStep } = await signIn({
                username: data.email,
                password: data.password,
            });

            if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
                // User needs to confirm account
                await handleNeedsConfirmation(data.email, data.password);
            }

            if (isSignedIn) {
                // Redirect to desired page or dashboard by default
                const redirectTo =
                    searchParams?.get('redirectTo') || '/dashboard';
                router.push(redirectTo);
            }
        } catch (err: any) {
            console.error('Sign in error: ', err);

            // Check for specific Cognito errors
            if (err.name === 'UserNotConfirmedException') {
                handleNeedsConfirmation(data.email, data.password);
            }
            setError(err instanceof Error ? err.message : 'Failed to sign in');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <TabsContent value="signin">
            <Card>
                <FormHeader
                    title="Sign In"
                    description="Enter your email and password to access your account"
                />
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
                            setIsLoading={setIsLoading}
                            setError={setError}
                        />
                    </CardContent>
                </form>
            </Card>
        </TabsContent>
    );
}
