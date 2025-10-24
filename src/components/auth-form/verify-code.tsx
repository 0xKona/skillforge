'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/shadcn/card'
import { Label } from '@/components/ui/shadcn/label'
import { Button } from '@/components/ui/shadcn/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/shadcn/input-opt'
import { useAuthControlState, useSignUpFormState } from '@/store/auth-form'
import { confirmSignUp } from 'aws-amplify/auth'

export default function VerifyCodeCard() {
    // Create an array so we don't have to manually update slots.
    const SLOT_NUM = 6
    const SLOT_ARRAY = Array.from({ length: SLOT_NUM })

    const {
        isLoading,
        error,
        successMessage,
        setIsLoading,
        setError,
        setSuccessMessage,
        setNeedsConfirmation,
    } = useAuthControlState()

    const { signUpEmail, confirmationCode, setConfirmationCode } =
        useSignUpFormState()

    const handleConfirmSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        setSuccessMessage('')

        try {
            const { isSignUpComplete } = await confirmSignUp({
                username: signUpEmail,
                confirmationCode,
            })

            if (isSignUpComplete) {
                setSuccessMessage('Email confirmed! You can now sign in.')
                setNeedsConfirmation(false)
                setConfirmationCode('')
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to confirm sign up'
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Confirm Your Email</CardTitle>
                <CardDescription>
                    Enter the confirmation code sent to {signUpEmail}
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
                            <InputOTPGroup className="w-full p-6">
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
                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => setNeedsConfirmation(false)}
                    >
                        Back to Sign In
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
