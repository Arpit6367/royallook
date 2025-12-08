// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function middleware(req: NextRequest) {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//   const { pathname } = req.nextUrl;

//   // Paths
//   const authRoutes = ["/auth/signin", "/auth/signup"];
//   const adminRoutes = ["/admin"];
//   const coachRoutes = ["/coach"];
//   // Add all routes that need login protection here
//   const protectedRoutes = ["/learn", "/puzzle", "/payment", ...adminRoutes, ...coachRoutes];

//   // -------------------------------------------------------------
//   // 1. FIX THE GLITCH: Redirect logged-in users away from Login page
//   // -------------------------------------------------------------
//   if (authRoutes.some((route) => pathname.startsWith(route))) {
//     if (token) {
//       const role = token.role as string;
//       if (role === "admin") return NextResponse.redirect(new URL("/admin", req.url));
//       if (role === "coach") return NextResponse.redirect(new URL("/coach", req.url));
//       return NextResponse.redirect(new URL("/learn", req.url));
//     }
//     return NextResponse.next();
//   }

//   // -------------------------------------------------------------
//   // 2. PROTECT ROUTES & CHECK ROLES
//   // -------------------------------------------------------------
//   const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

//   if (isProtectedRoute) {
//     // 2a. Check if logged in
//     if (!token) {
//       const url = new URL("/auth/signin", req.url);
//       url.searchParams.set("callbackUrl", encodeURI(req.url));
//       return NextResponse.redirect(url);
//     }

//     // 2b. Check Roles (Security)
//     const role = token.role as string;
    
//     // Prevent Students from entering /admin
//     if (adminRoutes.some(r => pathname.startsWith(r)) && role !== "admin") {
//       return NextResponse.redirect(new URL("/learn", req.url));
//     }

//     // Prevent Students from entering /coach
//     if (coachRoutes.some(r => pathname.startsWith(r)) && role !== "coach" && role !== "admin") {
//       return NextResponse.redirect(new URL("/learn", req.url));
//     }
//   }

//   return NextResponse.next();
// }

// // -------------------------------------------------------------
// // NEW MATCHER
// // -------------------------------------------------------------
// // We match EVERYTHING so we can catch the /auth/signin page.
// // We only exclude internal Next.js files and API routes.
// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };

export { default } from 'next-auth/middleware'
export const config = {
matcher: []
}