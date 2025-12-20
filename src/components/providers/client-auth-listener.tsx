'use client';

import { useEffect, useRef } from 'react';
import { useClientAuth } from '@/lib/store/use-client-auth';
import { usePathname, useRouter } from 'next/navigation';
import { PROTECTED_ROUTES, AUTH_ROUTES } from '@/lib/constants/routing';

/**
 * ClientAuthListener
 *
 * Centralized client-side authentication listener that:
 * 1. Initializes the auth store and Hub listeners
 * 2. Handles ALL client-side redirects based on auth state
 * 3. Syncs client state with server by refreshing router after auth changes
 *
 * This is the SINGLE SOURCE OF TRUTH for client-side auth redirects.
 */
export function ClientAuthListener() {
    const initialize = useClientAuth((state) => state.initialize);
    const isAuthenticated = useClientAuth((state) => state.isAuthenticated);
    const loading = useClientAuth((state) => state.loading);
    const router = useRouter();
    const pathname = usePathname();

    // Track previous auth state to detect changes
    const prevAuthRef = useRef<boolean | null>(null);

    // Initialize auth store and Hub listeners once
    useEffect(() => {
        const unsubscribe = initialize();
        return () => unsubscribe();
    }, [initialize]);

    // Handle redirects based on auth state changes
    useEffect(() => {
        // Don't redirect while still loading initial auth state
        if (loading) return;

        const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
            pathname.startsWith(route)
        );
        const isAuthRoute = AUTH_ROUTES.some((route) =>
            pathname.startsWith(route)
        );

        // Detect if auth state just changed
        const authStateChanged =
            prevAuthRef.current !== null &&
            prevAuthRef.current !== isAuthenticated;

        // Update ref for next check
        prevAuthRef.current = isAuthenticated;

        // If auth state changed, refresh router to sync with server middleware
        if (authStateChanged) {
            router.refresh();
        }

        // Handle redirects
        if (!isAuthenticated) {
            // User is NOT authenticated
            if (isProtectedRoute) {
                // Redirect from protected routes to login
                router.replace('/login');
            }
        } else {
            // User IS authenticated
            if (isAuthRoute) {
                // Redirect from auth routes (like /login) to forge
                router.replace('/forge');
            }
        }
    }, [isAuthenticated, loading, pathname, router]);

    return null;
}
