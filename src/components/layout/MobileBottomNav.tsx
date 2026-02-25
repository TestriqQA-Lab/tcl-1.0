"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAction } from "@/actions/auth.actions";
import {
    Home,
    Briefcase,
    MessageSquare,
    User,
    Menu,
    X,
    LayoutDashboard,
    FileText,
    Search,
    Building2,
    BookOpen,
    Settings,
    HelpCircle,
    LogOut,
} from "lucide-react";

// ── Primary bottom bar items (4 + More) ──────────────────────────────────────
const primaryNav = [
    { label: "Home", href: "/user-dashboard", icon: Home },
    { label: "Jobs", href: "/search", icon: Briefcase },
    { label: "Inbox", href: "/inbox", icon: MessageSquare },
    { label: "Profile", href: "/user-profile", icon: User },
];

// ── Links inside the "More" drawer ───────────────────────────────────────────
const moreLinks = [
    { label: "Dashboard", href: "/user-dashboard", icon: LayoutDashboard },
    { label: "My Applications", href: "/user-applications", icon: FileText },
    { label: "Browse Jobs", href: "/search", icon: Search },
    { label: "Companies", href: "/companies", icon: Building2 },
    { label: "Blogs", href: "/blogs", icon: BookOpen },
    { label: "Settings", href: "/settings", icon: Settings },
    { label: "Help & Support", href: "/support", icon: HelpCircle },
];

export const MobileBottomNav = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isMoreOpen, setIsMoreOpen] = useState(false);

    // Lock body scroll when drawer is open
    useEffect(() => {
        if (isMoreOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isMoreOpen]);

    // Close drawer on route change
    useEffect(() => {
        setIsMoreOpen(false);
    }, [pathname]);

    return (
        <>
            {/* ── Bottom Bar ───────────────────────────────────────────── */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex items-center justify-around z-50 text-[10px] font-bold shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
                {primaryNav.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 transition-colors min-w-[48px]
                                ${isActive ? "text-[#0f766d]" : "text-gray-400 hover:text-gray-600"}`}
                        >
                            <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}

                {/* More Button */}
                <button
                    onClick={() => setIsMoreOpen(true)}
                    className={`flex flex-col items-center gap-1 transition-colors min-w-[48px]
                        ${isMoreOpen ? "text-[#0f766d]" : "text-gray-400 hover:text-gray-600"}`}
                >
                    <Menu className="w-5 h-5" strokeWidth={isMoreOpen ? 2.5 : 2} />
                    <span>More</span>
                </button>
            </div>

            {/* ── Backdrop ─────────────────────────────────────────────── */}
            <div
                className={`lg:hidden fixed inset-0 bg-black/30 backdrop-blur-[1px] z-[60] transition-opacity duration-300
                    ${isMoreOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={() => setIsMoreOpen(false)}
            />

            {/* ── More Drawer (slides from right) ──────────────────────── */}
            <aside
                className={`lg:hidden fixed inset-y-0 right-0 z-[70] w-[280px]
                    bg-white shadow-[-4px_0_20px_rgba(0,0,0,0.1)] flex flex-col
                    transition-transform duration-400 ease-out
                    ${isMoreOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h3 className="text-base font-bold text-[#0e1b1a]">More</h3>
                    <button
                        onClick={() => setIsMoreOpen(false)}
                        className="p-1.5 -m-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-3">
                    <div className="px-3 space-y-1">
                        {moreLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                                        ${isActive
                                            ? "bg-[#e8f5f3] text-[#0f766d] font-semibold"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-[#0f766d]"
                                        }`}
                                >
                                    <link.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-[#0f766d]" : "text-gray-400"}`} strokeWidth={isActive ? 2.5 : 2} />
                                    <span>{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Footer / Sign Out */}
                <div className="border-t border-gray-100 px-3 py-3">
                    <button
                        onClick={async () => {
                            const result = await logoutAction();
                            if (result.success) {
                                router.push("/");
                            }
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200"
                    >
                        <LogOut className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
};
