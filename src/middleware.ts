import { NextRequest, NextResponse } from "next/server";
import { runWithAmplifyServerContext } from "@/utlils/amplify/server-utils";
import { fetchAuthSession } from "aws-amplify/auth/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/api"];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current route is protected or an auth route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  try {
    // Use runWithAmplifyServerContext to verify the session
    const response = NextResponse.next();
    
    const authenticated = await runWithAmplifyServerContext({
      nextServerContext: { request, response },
      operation: async (contextSpec) => {
        try {
          const session = await fetchAuthSession(contextSpec);
          return !!session.tokens;
        } catch (error) {
          console.error("Auth session error:", error);
          return false;
        }
      },
    });

    console.log("[Middleware]: User authenticated?: ", {pathname},  {authenticated}, {isProtectedRoute}, {request});

    // If user is not authenticated and trying to access protected route
    if (isProtectedRoute && !authenticated) {
      console.log("[Middleware]: Protected Route Triggered: ", pathname)
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      // Store the original URL to redirect back after login
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }

    // If user is authenticated and trying to access auth routes (login/signup)
    if (isAuthRoute && authenticated) {
      const redirectTo = request.nextUrl.searchParams.get("redirectTo");
      const url = request.nextUrl.clone();
      url.pathname = redirectTo || "/dashboard";
      url.search = ""; // Clear query params
      return NextResponse.redirect(url);
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    // On error, allow the request to continue
    return NextResponse.next();
  }
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
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
