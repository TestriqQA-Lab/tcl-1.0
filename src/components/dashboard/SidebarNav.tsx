"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileAxis3D, User } from "lucide-react";

export const SidebarNav = () => {
    const pathname = usePathname();

    const navItems = [
        { label: "Profile", href: "/user-profile", icon: User },
        { label: "Applications", href: "/user-applications", icon: FileAxis3D },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-3 px-6 py-4 transition-colors font-medium border-l-4 ${isActive
                                ? "bg-[#E8F3F2] text-[#0f766d] border-[#0f766d]"
                                : "text-gray-600 border-transparent hover:text-teal-700 hover:bg-teal-50 hover:border-teal-700 hover:border-l-4 transition-all duration-300 ease-in-out"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? "fill-current" : ""}`} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
