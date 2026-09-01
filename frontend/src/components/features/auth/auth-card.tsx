'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
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
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [direction, setDirection] = useState(1);
    const shouldReduceMotion = useReducedMotion();
    const contentOffset = shouldReduceMotion ? 0 : 6;
    const slideOffset = shouldReduceMotion ? 0 : 12;

    const handleTabChange = (nextTab: string) => {
        const next = nextTab as 'login' | 'signup';
        setDirection(next === 'signup' ? 1 : -1);
        setActiveTab(next);
    };

    return (
        <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="gap-0"
        >
            <motion.div
                initial={{ opacity: 0, y: contentOffset }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: shouldReduceMotion ? 0.01 : 0.24,
                    ease: [0.23, 1, 0.32, 1],
                }}
            >
                <TabsList className="grid h-11 w-full grid-cols-2 rounded-lg border border-border-default bg-crucible p-1">
                    <TabsTrigger
                        value="login"
                        className="rounded-md text-ash transition-[color,background-color,box-shadow] data-[state=active]:bg-gunmetal data-[state=active]:text-text-primary data-[state=active]:shadow-sm"
                    >
                        Login
                    </TabsTrigger>
                    <TabsTrigger
                        value="signup"
                        className="rounded-md text-ash transition-[color,background-color,box-shadow] data-[state=active]:bg-gunmetal data-[state=active]:text-text-primary data-[state=active]:shadow-sm"
                    >
                        Sign up
                    </TabsTrigger>
                </TabsList>
            </motion.div>
            <motion.div layout="size" transition={{ duration: 0.22 }}>
                <TabsContent value={activeTab} forceMount className="mt-7">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: direction * slideOffset }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: direction * -slideOffset }}
                            transition={{
                                duration: shouldReduceMotion ? 0.01 : 0.2,
                                ease: [0.23, 1, 0.32, 1],
                            }}
                        >
                            {activeTab === 'login'
                                ? loginContent
                                : signupContent}
                        </motion.div>
                    </AnimatePresence>
                </TabsContent>
            </motion.div>
        </Tabs>
    );
}
