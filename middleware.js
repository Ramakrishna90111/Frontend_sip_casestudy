import { NextResponse } from "next/server";
export function middleware(request){
    const token =request.cookies.get("token");
    const protectedRoutes = ["/dashboard", "/register", "/investor-details", "/funds", "/portfolio", "/sip", "/transactions"];
    const isProtectedRoute = protectedRoutes.some((route)=>request.nextUrl.pathname.startsWith(route));
    if(isProtectedRoute && !token){
        return NextResponse.redirect(new URL("/login",request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/register/:path*", "/investor-details/:path*", "/funds/:path*", "/portfolio/:path*", "/sip/:path*", "/transactions/:path*"],
}
