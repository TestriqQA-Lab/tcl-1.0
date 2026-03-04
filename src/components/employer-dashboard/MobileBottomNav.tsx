"use client";

import Link from "next/link";
import { useState } from "react";
import {
    LayoutDashboard,
    Briefcase,
    Plus,
    FileText,
    Menu,
    Search,
    BookOpen,
    BarChart3,
    Settings,
    X,
} from "lucide-react";

const tabs = [
    {
        label: "Home",
        icon: LayoutDashboard,
        href: "/employer-dashboard",
    },
    {
        label: "Jobs",
        icon: Briefcase,
        href: "/employer-dashboard/job-postings",
    },
    {
        label: "Post a Job",
        icon: Plus,
        href: "/employer-dashboard/post-job",
        isFab: true,
    },
    {
        label: "Apps",
        icon: FileText,
        href: "/employer-dashboard/applications",
    },
    {
        label: "More",
        icon: Menu,
        href: "#",
        isMore: true,
    },
];

const moreLinks = [
    { label: "Database Search", icon: Search, href: "/employer-dashboard/database-search" },
    { label: "Blogs", icon: BookOpen, href: "/employer-dashboard/blogs" },
    { label: "Analytics", icon: BarChart3, href: "/employer-dashboard/analytics" },
    { label: "Settings", icon: Settings, href: "/employer-dashboard/settings" },
];

interface MobileBottomNavProps {
    activePage?: string;
}

export function MobileBottomNav({
    activePage = "Home",
}: MobileBottomNavProps) {
    const [moreOpen, setMoreOpen] = useState(false);

    return (
        <>
            {/* More Menu — Right Slide-In Drawer */}
            <div
                className={`md:hidden fixed inset-0 z-[200] transition-opacity duration-300 ${moreOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setMoreOpen(false)}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Drawer */}
                <div
                    className={`absolute top-0 right-0 bottom-0 w-[280px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${moreOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-[#F1F5F9]">
                        <span className="text-base font-bold text-[#0e1b1a]">More Options</span>
                        <button
                            onClick={() => setMoreOpen(false)}
                            className="size-8 flex items-center justify-center rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] transition-colors"
                        >
                            <X size={16} className="text-[#64748B]" />
                        </button>
                    </div>

                    {/* Links */}
                    <div className="flex flex-col gap-1 p-4">
                        {moreLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setMoreOpen(false)}
                                className="flex items-center gap-3 h-12 px-3.5 rounded-xl hover:bg-[#F1F5F9] transition-colors"
                            >
                                <link.icon size={20} className="text-[#0f766d]" />
                                <span className="text-[14px] font-medium text-[#334155]">{link.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Nav Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[150] flex items-center justify-around h-16 bg-white border-t border-[#E2E8F0] px-2">
                {tabs.map((tab) => {
                    if (tab.isFab) {
                        return (
                            <Link
                                key="fab"
                                href={tab.href}
                                className="flex flex-col items-center gap-0.5 w-14 -mt-4"
                            >
                                <div className="flex items-center justify-center size-10 bg-[#0f766d] rounded-full shadow-lg">
                                    <Plus size={20} className="text-white" />
                                </div>
                                <span className="text-[9px] font-medium text-[#0f766d]">
                                    Post a Job
                                </span>
                            </Link>
                        );
                    }

                    if (tab.isMore) {
                        return (
                            <button
                                key="more"
                                onClick={() => setMoreOpen(!moreOpen)}
                                className="flex flex-col items-center gap-0.5 w-14"
                            >
                                <tab.icon
                                    size={20}
                                    className={moreOpen ? "text-[#0f766d]" : "text-[#94A3B8]"}
                                />
                                <span
                                    className={`text-[10px] ${moreOpen ? "text-[#0f766d] font-semibold" : "text-[#94A3B8]"
                                        }`}
                                >
                                    More
                                </span>
                            </button>
                        );
                    }

                    const isActive = tab.label === activePage;
                    return (
                        <Link
                            key={tab.label}
                            href={tab.href}
                            className="flex flex-col items-center gap-0.5 w-14"
                        >
                            <tab.icon
                                size={20}
                                className={isActive ? "text-[#0f766d]" : "text-[#94A3B8]"}
                            />
                            <span
                                className={`text-[10px] ${isActive
                                    ? "text-[#0f766d] font-semibold"
                                    : "text-[#94A3B8]"
                                    }`}
                            >
                                {tab.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
