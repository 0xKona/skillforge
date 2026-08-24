'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    ForgotPasswordRequest,
    forgotPasswordRequestSchema,
    ResetPasswordForm,
    resetPasswordFormSchema,
} from '@/lib/zod-form-schemas/auth-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import RequestPasswordResetForm from './request-code';
import PasswordResetForm from './reset-password-form';

export default function ForgotPassword() {
    const [codeSent, setCodeSent] = useState(false);
    const [providedEmail, setProvidedEmail] = useState('');

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
                onCodeSent={(email) => {
                    setProvidedEmail(email);
                    setCodeSent(true);
                }}
            />
        );
    }

    return (
        <PasswordResetForm
            resetForm={resetForm}
            providedEmail={providedEmail}
            onBack={() => setCodeSent(false)}
        />
    );
}
