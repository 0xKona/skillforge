'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    ForgotPasswordRequest,
    ResetPasswordForm,
    forgotPasswordRequestSchema,
    resetPasswordFormSchema,
} from '@/lib/schemas/auth-schema';
import { resetPassword, confirmResetPassword } from '@/lib/api/auth';
import { Button } from '@/ui/shadcn/button';
import { Label } from '@/ui/shadcn/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/ui/shadcn/input-opt';
import FormInput from '@/ui/form-input';

interface Props {
    onBack: () => void;
}

export function ForgotPassword({ onBack }: Props) {
    const [step, setStep] = useState<'request' | 'reset'>('request');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const requestForm = useForm<ForgotPasswordRequest>({
        resolver: zodResolver(forgotPasswordRequestSchema),
        defaultValues: { email: '' },
    });

    const resetForm = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: {
            email: '',
            code: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const handleRequest = async (data: ForgotPasswordRequest) => {
        setIsLoading(true);
        setError('');
        try {
            await resetPassword({ username: data.email });
            resetForm.setValue('email', data.email);
            setStep('reset');
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to send reset code.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = async (data: ResetPasswordForm) => {
        setIsLoading(true);
        setError('');
        try {
            await confirmResetPassword({
                username: data.email,
                confirmationCode: data.code,
                newPassword: data.newPassword,
            });
            setSuccess('Password reset. You can now login.');
            setTimeout(onBack, 2000);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to reset password.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (step === 'request') {
        return (
            <form
                onSubmit={requestForm.handleSubmit(handleRequest)}
                className="space-y-4"
            >
                <h2 className="text-lg font-semibold text-text-primary">
                    Forgot password
                </h2>
                <p className="text-sm text-ash">
                    Enter your email to receive a reset code.
                </p>
                {error && (
                    <div className="border-l-4 border-destructive pl-3 text-sm text-ash">
                        {error}
                    </div>
                )}
                <FormInput
                    form={requestForm}
                    id="forgot-email"
                    inputName="email"
                    placeholder="you@example.com"
                    label="Email"
                />
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 bg-flux hover:bg-flux-hover text-white font-medium rounded-md"
                >
                    {isLoading ? 'Sending...' : 'Send reset code'}
                </Button>
                <button
                    type="button"
                    onClick={onBack}
                    className="w-full text-sm text-ash hover:text-text-primary transition-colors"
                >
                    Back to login
                </button>
            </form>
        );
    }

    return (
        <form
            onSubmit={resetForm.handleSubmit(handleReset)}
            className="space-y-4"
        >
            <h2 className="text-lg font-semibold text-text-primary">
                Reset password
            </h2>
            <p className="text-sm text-ash">
                Enter the code sent to your email.
            </p>
            {error && (
                <div className="border-l-4 border-destructive pl-3 text-sm text-ash">
                    {error}
                </div>
            )}
            {success && (
                <div className="border-l-4 border-green-500 pl-3 text-sm text-ash">
                    {success}
                </div>
            )}
            <div className="space-y-2">
                <Label htmlFor="reset-code">Code</Label>
                <InputOTP
                    id="reset-code"
                    value={resetForm.watch('code') || ''}
                    onChange={(v) => resetForm.setValue('code', v)}
                    maxLength={6}
                >
                    <InputOTPGroup className="w-full">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <InputOTPSlot
                                key={i}
                                index={i}
                                className="grow aspect-square h-[44px]"
                            />
                        ))}
                    </InputOTPGroup>
                </InputOTP>
            </div>
            <FormInput
                form={resetForm}
                id="reset-new-pw"
                inputName="newPassword"
                placeholder="New password"
                label="New password"
                type="password"
            />
            <FormInput
                form={resetForm}
                id="reset-confirm-pw"
                inputName="confirmPassword"
                placeholder="Confirm password"
                label="Confirm password"
                type="password"
            />
            <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-flux hover:bg-flux-hover text-white font-medium rounded-md"
            >
                {isLoading ? 'Resetting...' : 'Reset password'}
            </Button>
            <button
                type="button"
                onClick={onBack}
                className="w-full text-sm text-ash hover:text-text-primary transition-colors"
            >
                Back to login
            </button>
        </form>
    );
}
