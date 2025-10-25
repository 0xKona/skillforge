'use client';

import { Card, CardContent } from '@/components/ui/shadcn/card';
import FormHeader from '../form-header';
import {
    ForgotPasswordRequest,
    ResetPasswordForm,
} from '@/lib/form-schemas/auth-schema';
import { resetPassword } from 'aws-amplify/auth';
import FormInput from '@/components/ui/form-input';
import SubmitAuthForm from '../submit-form';
import { Button } from '@/components/ui/shadcn/button';
import { useRequestPasswordResetStore } from '@/store/password-reset';
import { UseFormReturn } from 'react-hook-form';
import { useAuthControlState } from '@/store/auth-form';

interface Props {
    requestForm: UseFormReturn<ForgotPasswordRequest>;
    resetForm: UseFormReturn<ResetPasswordForm>;
}

export default function RequestPasswordResetForm({
    requestForm,
    resetForm,
}: Props) {
    const {
        isLoading,
        errorMsg,
        successMsg,
        setLoading,
        setErrorMsg,
        setSuccessMsg,
        setCodeSent,
        setProvidedEmail,
    } = useRequestPasswordResetStore();

    const { setShowForgotPassword } = useAuthControlState();

    const handleRequestReset = async (data: ForgotPasswordRequest) => {
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            await resetPassword({ username: data.email });
            setProvidedEmail(data.email);
            resetForm.setValue('email', data.email);
            setCodeSent(true);
            setSuccessMsg('Verification code sent! Please check your email.');
        } catch (err) {
            setErrorMsg(
                err instanceof Error ? err.message : 'Failed to send reset code'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <FormHeader
                title="Forgot Password"
                description="Enter your email to receive a password reset code"
            />
            <form onSubmit={requestForm.handleSubmit(handleRequestReset)}>
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
                        form={requestForm}
                        id="forgot-password-email"
                        inputName="email"
                        placeholder="blacksmith@skillforge.com"
                        label="Email"
                    />
                    <SubmitAuthForm
                        buttonText="Send Reset Code"
                        buttonLoadingText="Sending..."
                        isLoading={isLoading}
                        setIsLoading={setLoading}
                        setError={setErrorMsg}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => setShowForgotPassword(false)}
                    >
                        Back to Sign In
                    </Button>
                </CardContent>
            </form>
        </Card>
    );
}
