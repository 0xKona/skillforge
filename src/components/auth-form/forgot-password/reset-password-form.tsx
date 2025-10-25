'use client';

import { Card, CardContent } from '@/components/ui/shadcn/card';
import FormInput from '../../ui/form-input';
import SubmitAuthForm from '../submit-form';
import FormHeader from '../form-header';
import { Button } from '../../ui/shadcn/button';
import { useRequestPasswordResetStore } from '@/store/password-reset';
import { UseFormReturn } from 'react-hook-form';
import { ResetPasswordForm } from '@/lib/form-schemas/auth-schema';
import { confirmResetPassword, resetPassword } from 'aws-amplify/auth';
import { useAuthControlState } from '@/store/auth-form';
import { Label } from '@/components/ui/shadcn/label';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/shadcn/input-opt';

interface Props {
    resetForm: UseFormReturn<ResetPasswordForm>;
}

export default function PasswordResetForm({ resetForm }: Props) {
    // Create an array so we don't have to manually update slots.
    const SLOT_NUM = 6;
    const SLOT_ARRAY = Array.from({ length: SLOT_NUM });

    const {
        isLoading,
        providedEmail,
        errorMsg,
        successMsg,
        setLoading,
        setErrorMsg,
        setSuccessMsg,
        setCodeSent,
    } = useRequestPasswordResetStore();

    const { setShowForgotPassword } = useAuthControlState();

    const handleResetPassword = async (data: ResetPasswordForm) => {
        console.log('triggered');
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            await confirmResetPassword({
                username: data.email,
                confirmationCode: data.code,
                newPassword: data.newPassword,
            });
            setSuccessMsg(
                'Password reset successfully! You can now sign in with your new password.'
            );
            setTimeout(() => {
                setShowForgotPassword(false);
            }, 2000);
        } catch (err) {
            setErrorMsg(
                err instanceof Error ? err.message : 'Failed to reset password'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            await resetPassword({ username: providedEmail });
            setSuccessMsg('Verification code resent!');
        } catch (err) {
            setErrorMsg(
                err instanceof Error ? err.message : 'Failed to resend code'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <FormHeader
                title="Reset Password"
                description="Enter the verification code and your new password"
            />
            <form onSubmit={resetForm.handleSubmit(handleResetPassword)}>
                <CardContent className="space-y-4">
                    {errorMsg && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 rounded-md">
                            {errorMsg}
                        </div>
                    )}
                    {successMsg && (
                        <div className="p-3 text-sm text-green-500 bg-green-50 dark:bg-green-900/10 rounded-md">
                            {successMsg}
                        </div>
                    )}
                    <FormInput
                        form={resetForm}
                        id="reset-email"
                        inputName="email"
                        placeholder="blacksmith@skillforge.com"
                        label="Email"
                        disabled
                    />
                    <div className="">
                        <Label className="mb-2" htmlFor="code">
                            Confirmation Code
                        </Label>
                        <InputOTP
                            id="code"
                            value={resetForm.watch('code') || ''}
                            onChange={(value) =>
                                resetForm.setValue('code', value)
                            }
                            maxLength={6}
                            className="w-full"
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
                        {resetForm.formState.errors.code && (
                            <p className="text-sm text-red-500 mt-1">
                                {resetForm.formState.errors.code.message}
                            </p>
                        )}
                    </div>
                    <FormInput
                        form={resetForm}
                        id="reset-new-password"
                        inputName="newPassword"
                        placeholder="Enter new password"
                        label="New Password"
                        type="password"
                    />
                    <FormInput
                        form={resetForm}
                        id="reset-confirm-password"
                        inputName="confirmPassword"
                        placeholder="Confirm new password"
                        label="Confirm Password"
                        type="password"
                    />
                    <SubmitAuthForm
                        buttonText="Reset Password"
                        buttonLoadingText="Resetting..."
                        isLoading={isLoading}
                        setIsLoading={setLoading}
                        setError={setErrorMsg}
                    />
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            className="flex-1"
                            onClick={handleResendCode}
                            disabled={isLoading}
                        >
                            Resend Code
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="flex-1"
                            onClick={() => {
                                setCodeSent(false);
                                setShowForgotPassword(false);
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </CardContent>
            </form>
        </Card>
    );
}
