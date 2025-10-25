'use client';

import { useForm } from 'react-hook-form';
import {
    ForgotPasswordRequest,
    forgotPasswordRequestSchema,
    ResetPasswordForm,
    resetPasswordFormSchema,
} from '@/lib/form-schemas/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import RequestPasswordResetForm from './request-code';
import { useRequestPasswordResetStore } from '@/store/password-reset';
import PasswordResetForm from './reset-password-form';

export default function ForgotPassword() {
    const { providedEmail, codeSent } = useRequestPasswordResetStore();

    const resetForm = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: {
            email: providedEmail,
            code: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const requestForm = useForm<ForgotPasswordRequest>({
        resolver: zodResolver(forgotPasswordRequestSchema),
        defaultValues: {
            email: '',
        },
    });

    if (!codeSent) {
        return (
            <RequestPasswordResetForm
                requestForm={requestForm}
                resetForm={resetForm}
            />
        );
    } else {
        return <PasswordResetForm resetForm={resetForm} />;
    }
}
