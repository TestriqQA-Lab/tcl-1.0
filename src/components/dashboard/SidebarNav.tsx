"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    User,
    LayoutDashboard,
    FileText,
    Search,
    Building2,
    BookOpen,
} from "lucide-react";

export const SidebarNav = () => {
    const pathname = usePathname();

    const navItems = [
        { label: "Dashboard", href: "/user-dashboard", icon: LayoutDashboard },
        { label: "Profile", href: "/user-profile", icon: User },
        { label: "Applications", href: "/user-applications", icon: FileText },
        { label: "Jobs", href: "/search", icon: Search },
        { label: "Companies", href: "/companies", icon: Building2 },
        { label: "Blogs", href: "/blogs", icon: BookOpen },
    ];

    return (
        <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-3 px-6 py-3.5 transition-all duration-200 font-medium text-sm border-l-4
                                ${isActive
                                    ? "bg-[#e8f5f3] text-[#0f766d] border-[#0f766d]"
                                    : "text-gray-600 border-transparent hover:text-[#0f766d] hover:bg-[#f0fdf9] hover:border-[#0f766d]"
                                }`}
                        >
                            <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-[#0f766d]" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};
