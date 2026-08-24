'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/shadcn/tabs';
import VerifyCodeCard from './verify-code';
import SignInTab from './sign-in-tab';
import SignUpTab from './sign-up-tab';
import ForgotPassword from './forgot-password/forgot-password';
import { Card } from '@/ui/shadcn/card';

export default function AuthForm() {
    const [needsConfirmation, setNeedsConfirmation] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState('');

    const resetAuthFlow = () => {
        setNeedsConfirmation(false);
        setShowForgotPassword(false);
        setVerificationEmail('');
    };

    if (needsConfirmation) {
        return (
            <VerifyCodeCard
                verificationEmail={verificationEmail}
                onBack={() => setNeedsConfirmation(false)}
                onComplete={resetAuthFlow}
            />
        );
    }

    if (showForgotPassword) {
        return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
    }

    return (
        <Tabs defaultValue="signin" className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <Card>
                <TabsContent value="signin">
                    <SignInTab
                        onNeedsConfirmation={(email) => {
                            setVerificationEmail(email);
                            setNeedsConfirmation(true);
                        }}
                        onForgotPassword={() => setShowForgotPassword(true)}
                    />
                </TabsContent>

                <TabsContent value="signup">
                    <SignUpTab
                        onNeedsConfirmation={(email) => {
                            setVerificationEmail(email);
                            setNeedsConfirmation(true);
                        }}
                    />
                </TabsContent>
            </Card>
        </Tabs>
    );
}
