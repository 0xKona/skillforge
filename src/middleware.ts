import { NextRequest, NextResponse } from 'next/server';
import { runWithAmplifyServerContext } from '@/lib/amplify/server-utils';
import { fetchAuthSession } from 'aws-amplify/auth/server';
import { AUTH_ROUTES, PROTECTED_ROUTES } from '@/lib/constants/routing';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the current route is protected or an auth route
    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
        pathname.startsWith(route)
    );
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

    // OPTIMIZATION: Only run the Amplify Server Context if the route actually requires it.
    // This prevents the "Cold Start" / Token Refresh lag on public routes.
    if (isProtectedRoute || isAuthRoute) {
        try {
            // Use runWithAmplifyServerContext to verify the session
            const response = NextResponse.next();
            // Prevent CDN/middleware caching of auth state
            response.headers.set('Cache-Control', 'no-store, must-revalidate');

            const authenticated = await runWithAmplifyServerContext({
                nextServerContext: { request, response },
                operation: async (contextSpec) => {
                    try {
                        const session = await fetchAuthSession(contextSpec);
                        return !!session.tokens;
                    } catch (error) {
                        console.error('Auth session error:', error);
                        return false;
                    }
                },
            });

            if (isProtectedRoute && !authenticated) {
                return NextResponse.redirect(new URL('/login', request.url));
            }

            if (isAuthRoute && authenticated) {
                return NextResponse.redirect(new URL('/forge', request.url));
            }

            return response;
        } catch (error) {
            // Log error with more detail
            console.error('Middleware error:', error, { url: request.url });
            return NextResponse.next();
        }
    }

    // For public routes, proceed without blocking on Auth
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
