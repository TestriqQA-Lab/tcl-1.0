"use client";

import Link from "next/link";
import { Search, Bell, Plus, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";

interface DashboardTopBarProps {
    userName?: string;
    userEmail?: string;
}

export function DashboardTopBar({
    userName = "John",
    userEmail = "john.doe@company.com"
}: DashboardTopBarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    return (
        <>
            {/* Desktop Top Bar */}
            <div className="hidden lg:flex items-center justify-between w-full h-[72px] px-10 bg-white border-b border-[#E2E8F0] relative z-[90]">
                {/* Left: Greeting */}
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-[#0e1b1a] tracking-tight">
                        Good Afternoon, {userName} 👋
                    </h1>
                    <p className="text-xs text-[#64748B]">
                        Here&apos;s what&apos;s happening with your recruitment today.
                    </p>
                </div>

                {/* Right: Search + Bell + CTA */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 w-[200px] h-[38px] px-3 bg-[#F1F5F9] rounded-lg border border-[#E2E8F0]">
                        <Search size={16} className="text-[#94A3B8]" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent text-sm text-[#0e1b1a] placeholder-[#94A3B8] outline-none w-full"
                        />
                    </div>
                    <button className="size-[38px] flex items-center justify-center rounded-lg border border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors relative">
                        <Bell size={18} className="text-[#64748B]" />
                        <span className="absolute top-2 right-2 size-1.5 bg-[#EF4444] rounded-full"></span>
                    </button>
                    <Link
                        href="/employer-dashboard/post-job"
                        className="flex items-center gap-1.5 h-[38px] px-4 bg-[#0f766d] hover:bg-[#0d635c] text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                        <Plus size={16} />
                        <span>Post a Job</span>
                    </Link>
                </div>
            </div>

            {/* Tablet & Mobile Top Bar */}
            <div className="lg:hidden flex items-center justify-between w-full h-16 px-4 md:px-6 bg-[#0e1b1a] relative z-[100]">
                {/* Logo */}
                <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="size-6 md:size-7 bg-[#0f766d] rounded-[5px] md:rounded-md flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-sm md:text-base">
                            rocket_launch
                        </span>
                    </div>
                    <span className="text-white text-[15px] md:text-base font-bold md:hidden">
                        TCL
                    </span>
                    <span className="text-white text-base font-bold hidden md:inline">
                        TopCareerLive
                    </span>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 md:gap-3 relative">
                    <button
                        className="size-8 md:size-9 rounded-lg bg-white/8 flex items-center justify-center hover:bg-white/10 transition-colors"
                        onClick={() => setSearchOpen(true)}
                    >
                        <Search size={16} className="text-white md:size-[18px]" />
                    </button>
                    <button
                        className="size-8 md:size-9 rounded-lg bg-white/8 flex items-center justify-center hover:bg-white/10 transition-colors relative"
                        onClick={() => setNotificationsOpen(true)}
                    >
                        <Bell size={16} className="text-white md:size-[18px]" />
                        <span className="absolute top-2 right-2 size-1.5 bg-[#EF4444] rounded-full border border-[#0e1b1a]"></span>
                    </button>
                    {/* Tablet & Mobile: Avatar */}
                    <button
                        className="size-8 md:size-9 bg-[#0f766d] rounded-full flex items-center justify-center border border-white/20 hover:bg-[#0d635c] transition-colors shrink-0"
                        onClick={() => setProfileOpen(true)}
                    >
                        <span className="text-white text-[11px] md:text-sm font-bold">JD</span>
                    </button>
                </div>
            </div>

            {/* Mobile Overlays/Panels */}

            {/* Search Overlay Dropdown */}
            <div
                className={`lg:hidden fixed top-0 left-0 right-0 z-[150] bg-[#0e1b1a] transition-transform duration-300 ease-in-out ${searchOpen ? "translate-y-0 shadow-lg" : "-translate-y-full"}`}
            >
                <div className="flex items-center gap-3 h-16 px-4">
                    <div className="flex-1 flex items-center gap-2 h-10 px-3 bg-white/10 rounded-lg">
                        <Search size={16} className="text-white/50" />
                        <input
                            type="text"
                            placeholder="Search jobs, candidates..."
                            className="bg-transparent text-sm text-white placeholder-white/50 outline-none w-full"
                            autoFocus={searchOpen}
                        />
                    </div>
                    <button onClick={() => setSearchOpen(false)} className="size-10 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Notifications Panel */}
            {notificationsOpen && (
                <div className="lg:hidden fixed inset-0 z-[120] bg-black/40" onClick={() => setNotificationsOpen(false)}>
                    <div
                        className="absolute top-16 right-4 md:right-16 w-[300px] bg-white rounded-xl shadow-2xl overflow-hidden origin-top-right transform transition-all duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-[#F1F5F9]">
                            <span className="text-[15px] font-bold text-[#0e1b1a]">Notifications</span>
                            <button onClick={() => setNotificationsOpen(false)} className="size-6 flex items-center justify-center rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] transition-colors">
                                <X size={14} className="text-[#64748B]" />
                            </button>
                        </div>
                        <div className="flex flex-col max-h-[300px] overflow-y-auto">
                            {/* Dummy Notifications */}
                            <div className="p-4 border-b border-[#F1F5F9] hover:bg-[#F8FAFB] transition-colors cursor-pointer">
                                <p className="text-[13px] text-[#334155]"><span className="font-semibold text-[#0e1b1a]">Priya Sharma</span> applied for Sr. Frontend Developer.</p>
                                <span className="text-[11px] font-medium text-[#0f766d] block mt-1.5">2 hours ago</span>
                            </div>
                            <div className="p-4 border-b border-[#F1F5F9] hover:bg-[#F8FAFB] transition-colors cursor-pointer">
                                <p className="text-[13px] text-[#334155]">Your job <span className="font-semibold text-[#0e1b1a]">Backend Engineer</span> is live!</p>
                                <span className="text-[11px] font-medium text-[#94A3B8] block mt-1.5">5 hours ago</span>
                            </div>
                        </div>
                        <div className="p-3 text-center bg-[#F8FAFB] hover:bg-[#F1F5F9] border-t border-[#F1F5F9] transition-colors cursor-pointer">
                            <span className="text-[13px] font-semibold text-[#0f766d]">View All Notifications</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Panel (Tablet & Mobile) */}
            {profileOpen && (
                <div className="lg:hidden fixed inset-0 z-[120] bg-black/40" onClick={() => setProfileOpen(false)}>
                    <div
                        className="absolute top-16 right-4 w-[260px] bg-white rounded-xl shadow-2xl overflow-hidden origin-top-right"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-5 border-b border-[#F1F5F9] flex items-center gap-3">
                            <div className="size-11 bg-[#0f766d] rounded-full flex items-center justify-center shadow-inner shrink-0">
                                <span className="text-white text-sm font-bold">JD</span>
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[15px] font-bold text-[#0e1b1a] truncate">{userName} Doe</span>
                                <span className="text-[12px] text-[#64748B] truncate">{userEmail}</span>
                            </div>
                        </div>
                        <div className="p-2">
                            <button
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[14px] font-medium text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                                onClick={() => {
                                    // Handle logic here, maybe redirect using next/navigation
                                    setProfileOpen(false);
                                }}
                            >
                                <LogOut size={16} />
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
