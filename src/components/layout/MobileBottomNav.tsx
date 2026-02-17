"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, MessageSquare, User, Settings } from "lucide-react";

export const MobileBottomNav = () => {
    const pathname = usePathname();

    const navItems = [
        { label: "Home", href: "/user-dashboard", icon: Home },
        { label: "Jobs", href: "/search", icon: Briefcase },
        { label: "Inbox", href: "/inbox", icon: MessageSquare },
        { label: "Profile", href: "/user-profile", icon: User },
        { label: "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex items-center justify-around z-50 text-[10px] font-bold shadow-md">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex flex-col items-center gap-1 transition-colors ${isActive ? "text-[#0f766d]" : "text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </div>
    );
};
