'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/store/use-auth';
import { usePathname, useRouter } from 'next/navigation';
import { PROTECTED_ROUTES, AUTH_ROUTES } from '@/lib/constants/routing';

/**
 * Initializes the auth store on mount and handles global auth redirects:
 * - Unauthenticated user on a protected route -> /login
 * - Authenticated user on an auth route -> /forge
 */
export function ClientAuthListener() {
    const initialize = useAuth((state) => state.initialize);
    const isAuthenticated = useAuth((state) => state.isAuthenticated);
    const loading = useAuth((state) => state.loading);
    const router = useRouter();
    const pathname = usePathname();

    // Initialize auth store once on mount
    useEffect(() => {
        initialize();
    }, [initialize]);

    // Handle redirects based on auth state
    useEffect(() => {
        if (loading) return;

        const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
            pathname.startsWith(route)
        );
        const isAuthRoute = AUTH_ROUTES.some((route) =>
            pathname.startsWith(route)
        );

        if (!isAuthenticated && isProtectedRoute) {
            router.replace('/login');
        } else if (isAuthenticated && isAuthRoute) {
            router.replace('/forge');
        }
    }, [isAuthenticated, loading, pathname, router]);

    return null;
}
