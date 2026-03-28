import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Use NextAuth's `auth` as the proxy handler — it's Edge-runtime safe
// (uses Web Crypto API, not Node.js crypto)
export default auth((req) => {
    const { nextUrl, auth: session } = req;
    const pathname = nextUrl.pathname;
    const isLoggedIn = !!session?.user;

    // Allow admin-login page to be accessed by anyone
    if (pathname === "/admin-login") {
        // If already logged in as admin, redirect to dashboard
        if (isLoggedIn && session?.user?.role === "ADMIN") {
            return NextResponse.redirect(new URL("/admin-dashboard", req.url));
        }
        const response = NextResponse.next();
        response.headers.set("x-pathname", pathname);
        return response;
    }

    // Routes that require authentication
    const PROTECTED_ROUTES = [
        "/seeker/dashboard",
        "/employer/dashboard",
        "/admin-dashboard",
        "/seeker/profile",
        "/user-applications",
        "/onboarding",
        "/basic-profile",
        "/detailed-seeker-profile",
    ];

    const PROTECTED_API_PREFIXES = ["/api/profile"];

    const isProtectedPage = PROTECTED_ROUTES.some(
        (r) => pathname === r || pathname.startsWith(r + "/")
    );
    const isProtectedApi = PROTECTED_API_PREFIXES.some((p) =>
        pathname.startsWith(p)
    );

    if (!isProtectedPage && !isProtectedApi) {
        const response = NextResponse.next();
        response.headers.set("x-pathname", pathname);
        return response;
    }

    // Not authenticated
    if (!isLoggedIn) {
        if (isProtectedApi) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        // Redirect to admin-login for admin routes, home for others
        if (pathname === "/admin-dashboard" || pathname.startsWith("/admin-dashboard/")) {
            return NextResponse.redirect(new URL("/admin-login", req.url));
        }
        return NextResponse.redirect(new URL("/", req.url));
    }

    const role = session?.user?.role;

    const seekerOnlyRoutes = [
        "/seeker/dashboard",
        "/seeker/profile",
        "/user-applications",
        "/onboarding",
        "/basic-profile",
        "/detailed-seeker-profile",
    ];
    if (
        seekerOnlyRoutes.some((r) => pathname === r || pathname.startsWith(r + "/")) &&
        role !== "SEEKER"
    ) {
        if (role === "ADMIN") return NextResponse.redirect(new URL("/admin-dashboard", req.url));
        return NextResponse.redirect(new URL("/employer/dashboard", req.url));
    }

    // Employer-only pages
    if (
        (pathname === "/employer/dashboard" || pathname.startsWith("/employer/dashboard/")) &&
        role !== "EMPLOYER"
    ) {
        if (role === "ADMIN") return NextResponse.redirect(new URL("/admin-dashboard", req.url));
        return NextResponse.redirect(new URL("/seeker/dashboard", req.url));
    }

    // Admin-only pages
    if (
        (pathname === "/admin-dashboard" || pathname.startsWith("/admin-dashboard/")) &&
        role !== "ADMIN"
    ) {
        return NextResponse.redirect(new URL("/admin-login", req.url));
    }

    const response = NextResponse.next();
    response.headers.set("x-pathname", pathname);
    return response;
});

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|icon.svg|api/auth).*)",
    ],
};
