'use client';

import {
    Card,
    CardContent,
} from '@/components/ui/component-library/shadcn-components/card';
import FormInput from '../../ui/form-input';
import SubmitAuthForm from '../submit-form';
import FormHeader from '../form-header';
import { Button } from '../../ui/component-library/shadcn-components/button';
import { useRequestPasswordResetStore } from '@/lib/store/password-reset';
import { UseFormReturn } from 'react-hook-form';
import { ResetPasswordForm } from '@/lib/form-schemas/auth-schema';
import { confirmResetPassword, resetPassword } from 'aws-amplify/auth';
import { useAuthFlowState } from '@/lib/store/auth-form';
import { Label } from '@/components/ui/component-library/shadcn-components/label';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/component-library/shadcn-components/input-opt';

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

    const { setShowForgotPassword } = useAuthFlowState();

    const handleResetPassword = async (data: ResetPasswordForm) => {
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
                id="header-reset-pass-form"
                title="Reset Password"
                description="Enter the verification code and your new password"
            />
            <form onSubmit={resetForm.handleSubmit(handleResetPassword)}>
                <CardContent className="space-y-4">
                    {errorMsg && (
                        <div
                            data-testid="error-reset-pass-form"
                            className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 rounded-md"
                        >
                            {errorMsg}
                        </div>
                    )}
                    {successMsg && (
                        <div
                            data-testid="success-reset-pass-form"
                            className="p-3 text-sm text-green-500 bg-green-50 dark:bg-green-900/10 rounded-md"
                        >
                            {successMsg}
                        </div>
                    )}
                    <FormInput
                        form={resetForm}
                        id="email-reset-pass-form"
                        inputName="email"
                        placeholder="blacksmith@skillforge.com"
                        label="Email"
                        disabled
                    />
                    <div className="">
                        <Label className="mb-2" htmlFor="code-reset-pass-form">
                            Confirmation Code
                        </Label>
                        <InputOTP
                            id="code-reset-pass-form"
                            data-testid="code-reset-pass-form"
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
                        id="submit-auth-form-button"
                        buttonText="Reset Password"
                        buttonLoadingText="Resetting..."
                        isLoading={isLoading}
                    />
                    <div className="flex gap-2">
                        <Button
                            data-testid="reset-password-form-resend"
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
