'use client'

import { useState } from 'react'
import { confirmSignUp } from 'aws-amplify/auth'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/shadcn/tabs'
import VerifyCodeCard from './verify-code'
import SignInTab from './sign-in'
import SignUpTab from './sign-up'
import ForgotPassword from './forgot-password/forgot-password'

export default function AuthForm() {
    const [confirmationCode, setConfirmationCode] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [needsConfirmation, setNeedsConfirmation] = useState(false)
    const [signUpEmail, setSignUpEmail] = useState('')
    const [showForgotPassword, setShowForgotPassword] = useState(false)

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

    if (needsConfirmation) {
        return (
            <VerifyCodeCard
                signUpEmail={signUpEmail}
                handleConfirmSignUp={handleConfirmSignUp}
                error={error}
                success={successMessage}
                confirmationCode={confirmationCode}
                isLoading={isLoading}
                setConfirmationCode={setConfirmationCode}
                setNeedsConfirmation={setNeedsConfirmation}
            />
        )
    }

    if (showForgotPassword) {
        return <ForgotPassword setShowForgotPassword={setShowForgotPassword} />
    }

    return (
        <Tabs defaultValue="signin" className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <SignInTab
                isLoading={isLoading}
                error={error}
                success={successMessage}
                setError={setError}
                setIsLoading={setIsLoading}
                setSuccessMessage={setSuccessMessage}
                setShowForgotPassword={setShowForgotPassword}
            />

            <SignUpTab
                isLoading={isLoading}
                error={error}
                success={successMessage}
                setError={setError}
                setIsLoading={setIsLoading}
                setSignUpEmail={setSignUpEmail}
                setSuccessMessage={setSuccessMessage}
                setNeedsConfirmation={setNeedsConfirmation}
            />
        </Tabs>
    )
}
