'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/shadcn/tabs';
import VerifyCodeCard from './verify-code';
import SignInTab from './sign-in-tab';
import SignUpTab from './sign-up-tab';
import ForgotPassword from './forgot-password/forgot-password';
import { useAuthFlowState } from '@/store/auth-form';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';

export default function AuthForm() {
    const { needsConfirmation, showForgotPassword, resetAuthFlow } =
        useAuthFlowState();

    const user = useAuth();

    useEffect(() => {
        return () => {
            // Reset when component is unmounted from DOM
            resetAuthFlow();
        };
    }, []);

    if (needsConfirmation) {
        return <VerifyCodeCard />;
    }

    if (showForgotPassword) {
        return <ForgotPassword />;
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
    );
}
