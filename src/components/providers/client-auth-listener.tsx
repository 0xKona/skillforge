'use client';

import { useEffect } from 'react';
import { useClientAuth } from '@/lib/store/use-client-auth';
import { usePathname, useRouter } from 'next/navigation';
import { PROTECTED_ROUTES, AUTH_ROUTES } from '@/lib/constants/routing';

/**
 * ClientAuthListener
 *
 * 1. Initializes the client-side auth store listener to keep UI in sync with auth state.
 * 2. Watches for auth state changes and automatically redirects:
 *    - Unauthenticated users to /login if they are on a protected route.
 *    - Authenticated users to /forge if they are on an auth route (e.g., /login).
 */
export function ClientAuthListener() {
    const initialize = useClientAuth((state) => state.initialize);
    const isAuthenticated = useClientAuth((state) => state.isAuthenticated);
    const loading = useClientAuth((state) => state.loading);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = initialize();
        return () => unsubscribe();
    }, [initialize]);

    useEffect(() => {
        if (loading) return;

        const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
            pathname.startsWith(route)
        );
        const isAuthRoute = AUTH_ROUTES.some((route) =>
            pathname.startsWith(route)
        );

        if (isProtectedRoute && !isAuthenticated) {
            router.replace('/login');
        } else if (isAuthRoute && isAuthenticated) {
            router.replace('/forge');
        }
    }, [isAuthenticated, loading, pathname, router]);

    return null;
}
