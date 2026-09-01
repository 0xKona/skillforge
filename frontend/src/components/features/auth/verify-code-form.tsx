'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { confirmSignUp, resendSignUpCode, signIn } from '@/lib/api/auth';
import { passwordStorage } from '@/lib/helpers/password-storage';
import { Button } from '@/ui/shadcn/button';
import { Label } from '@/ui/shadcn/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/ui/shadcn/input-opt';

interface Props {
    email: string;
    onBack: () => void;
}

export function VerifyCode({ email, onBack }: Props) {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { isSignUpComplete } = await confirmSignUp({
                username: email,
                confirmationCode: code,
            });

            if (isSignUpComplete) {
                const storedPassword = passwordStorage.get();
                if (storedPassword) {
                    const { isSignedIn } = await signIn({
                        username: email,
                        password: storedPassword,
                    });
                    passwordStorage.clear();
                    if (isSignedIn) {
                        router.push('/forge');
                        return;
                    }
                }
                setSuccess('Email confirmed. You can now login.');
                setTimeout(onBack, 2000);
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Verification failed.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        try {
            await resendSignUpCode({ username: email });
            setSuccess('Code resent. Check your email.');
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to resend code.'
            );
        }
    };

    return (
        <form onSubmit={handleConfirm} className="space-y-5">
            <p className="-mt-2 text-sm leading-6 text-ash">
                Code sent to <span className="text-text-primary">{email}</span>
            </p>
            {error && (
                <div
                    role="alert"
                    className="border-l-2 border-destructive bg-destructive/10 px-3 py-2 text-sm leading-5 text-text-primary"
                >
                    {error}
                </div>
            )}
            {success && (
                <div
                    role="status"
                    className="border-l-2 border-flux bg-flux/10 px-3 py-2 text-sm leading-5 text-text-primary"
                >
                    {success}
                </div>
            )}
            <div className="space-y-2">
                <Label htmlFor="verify-code">Confirmation code</Label>
                <InputOTP
                    id="verify-code"
                    value={code}
                    onChange={setCode}
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
            <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full rounded-md bg-flux font-medium text-white shadow-lg shadow-flux/15 transition-[background-color,transform] hover:bg-flux-hover active:scale-[0.98]"
            >
                {isLoading ? 'Confirming...' : 'Confirm email'}
            </Button>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex-1 text-sm text-ash transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                    Back to login
                </button>
                <button
                    type="button"
                    onClick={handleResend}
                    className="flex-1 text-sm text-ash transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                    Resend code
                </button>
            </div>
        </form>
    );
}
