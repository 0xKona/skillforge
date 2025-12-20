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
            console.log('[ClientAuthListener] Auth state changed:', {
                wasAuthenticated: prevAuthRef.current,
                nowAuthenticated: isAuthenticated,
                pathname,
            });
            router.refresh();

            // If user just authenticated and is on login page, wait a moment
            // for server sync before redirecting to avoid race condition
            if (isAuthenticated && isAuthRoute) {
                console.log(
                    '[ClientAuthListener] Just authenticated on auth route, scheduling redirect to /forge'
                );
                // Use setTimeout to allow server state to sync
                setTimeout(() => {
                    if (typeof window !== 'undefined') {
                        console.log(
                            '[ClientAuthListener] Executing hard navigation to /forge'
                        );
                        window.location.href = '/forge';
                    }
                }, 100);
                return; // Exit early to prevent immediate redirect
            }
        }

        // Handle redirects
        if (!isAuthenticated) {
            // User is NOT authenticated
            if (isProtectedRoute) {
                console.log(
                    '[ClientAuthListener] Unauthenticated user on protected route, redirecting to /login'
                );
                // Redirect from protected routes to login
                router.replace('/login');
            }
        } else {
            // User IS authenticated
            if (isAuthRoute && !authStateChanged) {
                console.log(
                    '[ClientAuthListener] Authenticated user on auth route (no state change), redirecting to /forge'
                );
                // Only redirect if NOT just authenticated (to avoid double redirect)
                if (typeof window !== 'undefined') {
                    window.location.href = '/forge';
                }
            }
        }
    }, [isAuthenticated, loading, pathname, router]);

    return null;
}
