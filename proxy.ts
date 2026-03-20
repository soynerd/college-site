import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import path from "path";

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;
        const isAuth = !!req.nextauth.token;

        // If logged-in user goes to /login → redirect home
        if (isAuth && pathname === "/login") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // If not logged in and route is protected → redirect to login
        if (!isAuth && !isPublicRoute(pathname)) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized() {
                return true;
            },
        },
    }
);

function isPublicRoute(pathname: string) {
    return (
        pathname.startsWith("/api/auth") ||
        pathname === "/login"
    );
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico|css|js|woff|woff2|ttf|eot|txt|pdf)).*)",
    ],
};
