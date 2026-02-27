import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Use NextAuth's `auth` as the proxy handler — it's Edge-runtime safe
// (uses Web Crypto API, not Node.js crypto)
export default auth((req) => {
    const { nextUrl, auth: session } = req;
    const pathname = nextUrl.pathname;
    const isLoggedIn = !!session?.user;

    // Routes that require authentication
    const PROTECTED_ROUTES = [
        "/user-dashboard",
        "/user-profile",
        "/user-applications",
        "/onboarding",
        "/employer-dashboard",
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
        return NextResponse.next();
    }

    // Not authenticated
    if (!isLoggedIn) {
        if (isProtectedApi) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/", req.url));
    }

    const role = session?.user?.role;

    // Seeker-only pages
    const seekerOnlyRoutes = [
        "/user-dashboard",
        "/user-profile",
        "/user-applications",
        "/onboarding",
        "/basic-profile",
        "/detailed-seeker-profile",
    ];
    if (
        seekerOnlyRoutes.some((r) => pathname === r || pathname.startsWith(r + "/")) &&
        role !== "SEEKER"
    ) {
        return NextResponse.redirect(new URL("/employer-dashboard", req.url));
    }

    // Employer-only pages
    if (
        (pathname === "/employer-dashboard" || pathname.startsWith("/employer-dashboard/")) &&
        role !== "EMPLOYER"
    ) {
        return NextResponse.redirect(new URL("/user-dashboard", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|icon.svg|api/auth).*)",
    ],
};
