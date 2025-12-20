import { NextRequest, NextResponse } from 'next/server';
import { runWithAmplifyServerContext } from '@/lib/amplify/server-utils';
import { fetchAuthSession } from 'aws-amplify/auth/server';
import { PROTECTED_ROUTES } from '@/lib/constants/routing';

/**
 * Middleware for server-side route protection
 *
 * Responsibilities:
 * - Block unauthenticated access to protected routes (redirect to /login)
 * - Verify auth session for protected routes using Amplify server context
 *
 * Note: Auth route redirects (e.g., /login -> /forge for authenticated users)
 * are handled client-side by ClientAuthListener for better UX and to avoid
 * middleware overhead on every request.
 */
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the current route is protected
    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
        pathname.startsWith(route)
    );

    // Only run Amplify Server Context for protected routes to avoid cold start lag
    if (isProtectedRoute) {
        try {
            const response = NextResponse.next();

            // Prevent caching of auth state in production
            response.headers.set(
                'Cache-Control',
                'private, no-cache, no-store, must-revalidate'
            );
            response.headers.set('Pragma', 'no-cache');
            response.headers.set('Expires', '0');

            // Verify the user's authentication session
            const authenticated = await runWithAmplifyServerContext({
                nextServerContext: { request, response },
                operation: async (contextSpec) => {
                    try {
                        const session = await fetchAuthSession(contextSpec);
                        return !!session.tokens;
                    } catch (error) {
                        console.error(
                            '[Middleware] Auth session error:',
                            error
                        );
                        return false;
                    }
                },
            });

            // Block access to protected routes for unauthenticated users
            if (!authenticated) {
                const loginUrl = new URL('/login', request.url);
                return NextResponse.redirect(loginUrl);
            }

            return response;
        } catch (error) {
            console.error('[Middleware] Error:', error, { url: request.url });

            // On error, redirect to login for protected routes as a safe fallback
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // For public routes, proceed without auth checks
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api (API routes - handle auth separately)
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico, other static assets
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
