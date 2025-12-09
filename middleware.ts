import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // If user is logged in AND on any auth page → redirect immediately
  if (token && (pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/signup"))) {
    const role = token.role as string;

    if (role === "admin") return NextResponse.redirect(new URL("/admin", req.url));
    if (role === "coach") return NextResponse.redirect(new URL("/coach", req.url));
    return NextResponse.redirect(new URL("/learn", req.url));
  }

  // Protect routes
  if (!token && pathname.startsWith("/learn")) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }
  if (!token && pathname.startsWith("/coach")) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }
  if (!token && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Role-based protection
  if (token) {
    const role = token.role as string;
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/learn", req.url));
    }
    if (pathname.startsWith("/coach") && role !== "coach" && role !== "admin") {
      return NextResponse.redirect(new URL("/learn", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
// export { default } from 'next-auth/middleware'
// export const config = {
// matcher: []
// }