'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { initialize } from '@/lib/api/auth';
import { PROTECTED_ROUTES, AUTH_ROUTES } from '@/lib/constants/routing';

/**
 * Global auth orchestrator. Place once in the root layout.
 * - Initializes auth on mount
 * - Redirects unauthenticated users from protected routes to /login
 * - Redirects authenticated users from /login to /forge
 */
export function AuthListener() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Initialize auth once on mount
    useEffect(() => {
        initialize();
    }, []);

    // Handle redirects based on auth state
    useEffect(() => {
        if (loading) return;

        const isProtectedRoute = PROTECTED_ROUTES.some((r) =>
            pathname.startsWith(r)
        );
        const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

        if (!isAuthenticated && isProtectedRoute) {
            router.replace('/login');
        } else if (isAuthenticated && isAuthRoute) {
            router.replace('/forge');
        }
    }, [isAuthenticated, loading, pathname, router]);

    return null;
}

/**
 * Layout-level guard for protected routes.
 * Blocks rendering until auth resolves. Redirects if unauthenticated.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
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

    if (!isAuthenticated) return null;

    return <>{children}</>;
}
