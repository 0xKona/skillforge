'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/shadcn/tabs'
import VerifyCodeCard from './verify-code'
import SignInTab from './sign-in'
import SignUpTab from './sign-up'
import ForgotPassword from './forgot-password/forgot-password'
import { useAuthControlState } from '@/store/auth-form'

export default function AuthForm() {
    const { needsConfirmation, showForgotPassword } = useAuthControlState()

    if (needsConfirmation) {
        return <VerifyCodeCard />
    }

    if (showForgotPassword) {
        return <ForgotPassword />
    }

    return (
        <Tabs defaultValue="signin" className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <SignInTab />

            <SignUpTab />
        </Tabs>
    )
}
