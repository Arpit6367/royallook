import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const authRoutes = ["/auth/signin", "/auth/signup"];
  const protectedRoutes = ["/learn", "/coach", "/admin", "/puzzle", "/payment"];

  // 1. If already logged in → kick out of auth pages
  if (token && authRoutes.some((r) => pathname.startsWith(r))) {
    const role = token.role as string;
    if (role === "admin") return NextResponse.redirect(new URL("/admin", req.url));
    if (role === "coach") return NextResponse.redirect(new URL("/coach", req.url));
    return NextResponse.redirect(new URL("/learn", req.url));
  }

  // 2. If not logged in → protect routes
  if (!token && protectedRoutes.some((r) => pathname.startsWith(r))) {
    const url = new URL("/auth/signin", req.url);
    url.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(url);
  }

  // 3. Role protection
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