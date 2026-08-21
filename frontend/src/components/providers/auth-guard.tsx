'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useClientAuth } from '@/lib/store/use-client-auth';

interface AuthGuardProps {
    children: React.ReactNode;
}

/**
 * Client-side auth guard for protected routes.
 * Replaces the old server-side middleware approach.
 *
 * - Shows a loading skeleton while auth state resolves
 * - Redirects to /login if user is not authenticated
 * - Renders children when authenticated
 */
export function AuthGuard({ children }: AuthGuardProps) {
    const { isAuthenticated, loading } = useClientAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [loading, isAuthenticated, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
                    <p className="text-sm text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Render nothing while redirect is in progress
        return null;
    }

    return <>{children}</>;
}
