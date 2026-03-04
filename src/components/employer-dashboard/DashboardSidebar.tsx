"use client";

import Link from "next/link";
import { useState } from "react";
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    Search,
    BookOpen,
    BarChart3,
    Settings,
    LogOut,
} from "lucide-react";

const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/employer-dashboard" },
    {
        label: "Applications",
        icon: FileText,
        href: "/employer-dashboard/applications",
    },
    {
        label: "Job Postings",
        icon: Briefcase,
        href: "/employer-dashboard/job-postings",
    },
    {
        label: "Database Search",
        icon: Search,
        href: "/employer-dashboard/database-search",
    },
    { label: "Blogs", icon: BookOpen, href: "/employer-dashboard/blogs" },
    { label: "Analytics", icon: BarChart3, href: "/employer-dashboard/analytics" },
    {
        label: "Settings",
        icon: Settings,
        href: "/employer-dashboard/settings",
    },
];

interface DashboardSidebarProps {
    activePage?: string;
    userName?: string;
    userEmail?: string;
}

export function DashboardSidebar({
    activePage = "Dashboard",
    userName = "John Doe",
    userEmail = "john.doe@company.com",
}: DashboardSidebarProps) {
    const [profileOpen, setProfileOpen] = useState(false);

    return (
        <aside className="hidden lg:flex flex-col w-[260px] bg-[#0e1b1a] px-6 py-8 justify-between shrink-0 h-auto relative">
            {/* Top Section */}
            <div className="flex flex-col gap-8">
                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="size-8 bg-[#0f766d] rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-lg">
                            rocket_launch
                        </span>
                    </div>
                    <span className="text-white text-[17px] font-bold tracking-tight">
                        TopCareerLive
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1">
                    <span className="text-white/35 text-[11px] font-semibold tracking-[2px] mb-2">
                        MAIN MENU
                    </span>
                    {navItems.map((item) => {
                        const isActive = item.label === activePage;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-3 h-11 px-3.5 rounded-lg text-sm transition-colors ${isActive
                                    ? "bg-[#0f766d] text-white font-semibold"
                                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                                    }`}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col gap-4 relative">
                {/* Upgrade Card */}
                <div className="bg-[#134e4a] rounded-[10px] p-4 flex flex-col gap-2.5">
                    <span className="text-white text-[15px] font-bold">
                        Upgrade to Pro
                    </span>
                    <p className="text-white/60 text-xs leading-relaxed">
                        Unlock premium hiring tools and AI-powered candidate matching.
                    </p>
                    <button className="w-full h-9 bg-[#0f766d] hover:bg-[#0d635c] text-white text-[13px] font-semibold rounded-md transition-colors">
                        Upgrade Now
                    </button>
                </div>

                {/* Profile Panel Popup */}
                {profileOpen && (
                    <>
                        <div className="fixed inset-0 z-[120]" onClick={() => setProfileOpen(false)} />
                        <div className="absolute bottom-16 left-0 right-0 z-[130] bg-[#1a2d2c] border border-white/10 rounded-xl shadow-2xl overflow-hidden shadow-black/50">
                            <div className="p-4 border-b border-white/10">
                                <span className="text-[14px] font-bold text-white truncate block">{userName}</span>
                                <span className="text-[12px] text-white/50 truncate block mt-0.5">{userEmail}</span>
                            </div>
                            <div className="p-2">
                                <button
                                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                    onClick={() => setProfileOpen(false)}
                                >
                                    <LogOut size={16} />
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* User Profile Button */}
                <button
                    className="flex items-center gap-2.5 pt-2.5 border-t border-white/8 cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-lg transition-colors outline-none text-left"
                    onClick={() => setProfileOpen(!profileOpen)}
                >
                    <div className="size-9 bg-[#0f766d] rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white text-[13px] font-bold">JD</span>
                    </div>
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                        <span className="text-white text-[13px] font-semibold truncate">
                            {userName}
                        </span>
                        <span className="text-white/45 text-[11px] truncate">Employer</span>
                    </div>
                </button>
            </div>
        </aside>
    );
}
