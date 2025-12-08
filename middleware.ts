import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // 1. Get the token (requires NEXTAUTH_SECRET in .env)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // -------------------------------------------------------------
  // CONFIGURATION
  // -------------------------------------------------------------
  const authRoutes = ["/auth/signin", "/auth/signup"];
  const adminRoutes = ["/admin"];
  const coachRoutes = ["/coach"];
  const protectedRoutes = ["/learn", "/puzzle", "/payment", ...adminRoutes, ...coachRoutes];

  // -------------------------------------------------------------
  // 1. HANDLE LOGGED-IN USERS ON AUTH PAGES (The "Glitch" Fix)
  // -------------------------------------------------------------
  // If user is on /signin but already has a token, redirect them immediately.
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
      const role = token.role as string;
      if (role === "admin") return NextResponse.redirect(new URL("/admin", req.url));
      if (role === "coach") return NextResponse.redirect(new URL("/coach", req.url));
      return NextResponse.redirect(new URL("/learn", req.url));
    }
    // If not logged in, let them see the login page
    return NextResponse.next();
  }

  // -------------------------------------------------------------
  // 2. PROTECT PRIVATE ROUTES
  // -------------------------------------------------------------
  // Check if the user is trying to access a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    // If NOT logged in, kick to login page
    if (!token) {
      const url = new URL("/auth/signin", req.url);
      url.searchParams.set("callbackUrl", encodeURI(req.url));
      return NextResponse.redirect(url);
    }

    // -------------------------------------------------------------
    // 3. ROLE-BASED SECURITY (Prevent Students from seeing /admin)
    // -------------------------------------------------------------
    const role = token.role as string;

    // Protect Admin Routes
    if (adminRoutes.some(r => pathname.startsWith(r)) && role !== "admin") {
      return NextResponse.redirect(new URL("/learn", req.url));
    }

    // Protect Coach Routes
    if (coachRoutes.some(r => pathname.startsWith(r)) && role !== "coach" && role !== "admin") {
      return NextResponse.redirect(new URL("/learn", req.url));
    }
  }

  return NextResponse.next();
}

// -------------------------------------------------------------
// MATCHER
// -------------------------------------------------------------
// We need the middleware to run on EVERYTHING so it can catch 
// the /auth/signin page too. We just exclude static files/api.
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};