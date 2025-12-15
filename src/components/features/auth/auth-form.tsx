'use client';

import {
    Tabs,
    TabsContent,
    TabsContents,
    TabsList,
    TabsTrigger,
} from '@/ui/animate-ui/animate/tabs';
import VerifyCodeCard from './verify-code';
import SignInTab from './sign-in-tab';
import SignUpTab from './sign-up-tab';
import ForgotPassword from './forgot-password/forgot-password';
import { useAuthFlowState } from '@/lib/store/use-auth-form';
import { useEffect } from 'react';
import { Card } from '@/ui/shadcn/card';

interface Props {
    message?: React.ReactNode | null;
}

export default function AuthForm({ message }: Props) {
    const { needsConfirmation, showForgotPassword, resetAuthFlow } =
        useAuthFlowState();

    useEffect(() => {
        return () => {
            // Reset when component is unmounted from DOM
            resetAuthFlow();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

            {message && message}

            <Card>
                <TabsContents>
                    <TabsContent value="signin">
                        <SignInTab />
                    </TabsContent>

                    <TabsContent value="signup">
                        <SignUpTab />
                    </TabsContent>
                </TabsContents>
            </Card>
        </Tabs>
    );
}
