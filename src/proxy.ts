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
        // Only run auth middleware on routes that actually need it
        // --- Seeker routes ---
        "/seeker/:path*",
        // --- Employer dashboard routes (inside (employer-dashboard) route group) ---
        "/employer-dashboard/:path*",
        "/employer-applications/:path*",
        "/job-postings/:path*",
        "/database-search/:path*",
        // --- Employer public-facing routes that check login state ---
        "/employers/:path*",
        // --- Admin routes ---
        "/admin-dashboard/:path*",
        "/admin-login",
        // --- Onboarding & profile setup ---
        "/onboarding/:path*",
        "/basic-profile/:path*",
        "/detailed-seeker-profile/:path*",
        // --- User-specific pages ---
        "/user-applications/:path*",
        // --- Protected APIs ---
        "/api/profile/:path*",
        // --- Root page (needs auth for seeker redirect logic) ---
        "/",
    ],
};
