'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/shadcn/tabs';

interface AuthCardProps {
    defaultTab?: 'login' | 'signup';
    loginContent: React.ReactNode;
    signupContent: React.ReactNode;
}

export function AuthCard({
    defaultTab = 'login',
    loginContent,
    signupContent,
}: AuthCardProps) {
    return (
        <div className="w-full max-w-sm rounded-xl border border-border-emphasis bg-gunmetal p-6">
            <Tabs defaultValue={defaultTab}>
                <TabsList className="grid w-full grid-cols-2 bg-crucible">
                    <TabsTrigger
                        value="login"
                        className="data-[state=active]:bg-transparent data-[state=active]:text-flux data-[state=active]:shadow-none"
                    >
                        Login
                    </TabsTrigger>
                    <TabsTrigger
                        value="signup"
                        className="data-[state=active]:bg-transparent data-[state=active]:text-flux data-[state=active]:shadow-none"
                    >
                        Sign up
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="mt-6">
                    {loginContent}
                </TabsContent>
                <TabsContent value="signup" className="mt-6">
                    {signupContent}
                </TabsContent>
            </Tabs>
        </div>
    );
}
