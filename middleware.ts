export { default } from 'next-auth/middleware'
export const config = {
matcher: ['/learn/:path*', '/puzzle/:path*', '/admin/:path*', '/payment/:path*']
}