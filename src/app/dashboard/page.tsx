'use client';

import { Button } from '@/components/ui/shadcn/button';
import { useAuth } from '@/hooks/use-auth';
import { Card } from '@/components/ui/shadcn/card';
import NavBar from '@/components/navigation-bar/navigation-bar';

export default function Dashboard() {
    const { userId, userAttributes, loading, error, signOut } = useAuth();

    async function handleSignOut() {
        try {
            await signOut();
        } catch (err) {
            console.error('Error signing out:', err);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="text-center">
                    <p className="text-lg">Loading...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="text-center">
                    <p className="text-lg text-red-500">Error: {error}</p>
                </div>
            </main>
        );
    }

    return (
        <>
            <NavBar />
            <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
                <Card className="w-full max-w-2xl p-8">
                    <div className="space-y-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold tracking-tight mb-2">
                                Dashboard
                            </h1>
                            <p className="text-muted-foreground">
                                Welcome back!
                            </p>
                        </div>

                        {/* User Information */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">
                                User Information
                            </h2>

                            <div className="grid gap-2 text-sm">
                                <div className="flex justify-between p-3 bg-muted rounded-lg">
                                    <span className="font-medium">
                                        User ID:
                                    </span>
                                    <span className="text-muted-foreground font-mono text-xs">
                                        {userId || 'N/A'}
                                    </span>
                                </div>

                                <div className="flex justify-between p-3 bg-muted rounded-lg">
                                    <span className="font-medium">Email:</span>
                                    <span className="text-muted-foreground">
                                        {userAttributes?.email || 'N/A'}
                                    </span>
                                </div>

                                <div className="flex justify-between p-3 bg-muted rounded-lg">
                                    <span className="font-medium">
                                        Email Verified:
                                    </span>
                                    <span className="text-muted-foreground">
                                        {userAttributes?.email_verified
                                            ? 'Yes'
                                            : 'No'}
                                    </span>
                                </div>

                                {userAttributes?.name && (
                                    <div className="flex justify-between p-3 bg-muted rounded-lg">
                                        <span className="font-medium">
                                            Name:
                                        </span>
                                        <span className="text-muted-foreground">
                                            {userAttributes.name}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={handleSignOut}
                        >
                            Sign Out
                        </Button>
                    </div>
                </Card>
            </main>
        </>
    );
}
