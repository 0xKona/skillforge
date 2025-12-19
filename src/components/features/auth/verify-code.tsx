'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/ui/shadcn/card';
import { Label } from '@/ui/shadcn/label';
import { Button } from '@/ui/shadcn/button';
import { useAuthFlowState, passwordStorage } from '@/lib/store/use-auth-form';
import { confirmSignUp, resendSignUpCode, signIn } from 'aws-amplify/auth';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/ui/shadcn/input-opt';

export default function VerifyCodeCard() {
    // Array is created to loop over when generating OTP slots
    const SLOT_NUM = 6;
    const SLOT_ARRAY = Array.from({ length: SLOT_NUM });

    // Local component state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [isResending, setIsResending] = useState(false);

    // Global state
    const { verificationEmail, setNeedsConfirmation, resetAuthFlow } =
        useAuthFlowState();

    const router = useRouter();

    const handleConfirmSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const { isSignUpComplete } = await confirmSignUp({
                username: verificationEmail,
                confirmationCode,
            });

            if (isSignUpComplete) {
                setSuccessMessage('Email confirmed! Signing you in...');

                // Automatically sign in the user if we have their password
                const storedPassword = passwordStorage.get();

                if (storedPassword) {
                    try {
                        const { isSignedIn } = await signIn({
                            username: verificationEmail,
                            password: storedPassword,
                        });

                        if (isSignedIn) {
                            // Clear all auth flow state and stored password
                            passwordStorage.clear();
                            resetAuthFlow();

                            // Redirect to dashboard
                            router.refresh();
                            router.push('/forge');
                        }
                    } catch (signInErr) {
                        console.error('Auto sign-in failed:', signInErr);
                        // If auto sign-in fails, clear state and let them sign in manually
                        passwordStorage.clear();
                        setSuccessMessage(
                            'Email confirmed! You can now sign in.'
                        );
                        setTimeout(() => {
                            resetAuthFlow();
                        }, 2000);
                    }
                } else {
                    // No password stored, redirect to login
                    setSuccessMessage(
                        'Email confirmed! Redirecting to sign in...'
                    );
                    setTimeout(() => {
                        resetAuthFlow();
                    }, 1500);
                }
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to confirm sign up'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!verificationEmail) {
            setError('No email found. Please sign up again.');
            return;
        }

        try {
            setIsResending(true);
            setError('');
            setSuccessMessage('');

            await resendSignUpCode({ username: verificationEmail });
            setSuccessMessage(
                'Verification code sent! Please check your email.'
            );
        } catch (err) {
            console.error('Resend code error:', err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to resend code. Please try again.'
            );
        } finally {
            setIsResending(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Confirm Your Email</CardTitle>
                <CardDescription>
                    Enter the confirmation code sent to {verificationEmail}
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleConfirmSignUp}>
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
                    <div className="space-y-2 mb-4">
                        <Label htmlFor="code">Confirmation Code</Label>
                        <InputOTP
                            id="code"
                            value={confirmationCode}
                            onChange={setConfirmationCode}
                            maxLength={6}
                            className="gap-1 w-full"
                        >
                            <InputOTPGroup className="w-full">
                                {SLOT_ARRAY.map((_, index) => (
                                    <InputOTPSlot
                                        key={index}
                                        className="grow aspect-square h-[50px]"
                                        index={index}
                                    />
                                ))}
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Confirming...' : 'Confirm Email'}
                    </Button>
                    <div className="w-full flex justify-between gap-2 mt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            className="flex-1"
                            onClick={() => {
                                passwordStorage.clear();
                                setNeedsConfirmation(false);
                            }}
                        >
                            Back to Sign In
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="flex-1"
                            onClick={handleResendCode}
                            disabled={isResending}
                        >
                            {isResending ? 'Sending...' : 'Resend Code'}
                        </Button>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}
