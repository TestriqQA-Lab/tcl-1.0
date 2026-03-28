"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Bell, X, LogOut, LayoutDashboard } from "lucide-react";
import { Session } from "next-auth";
import { MobileBottomNav } from "./MobileBottomNav";
import { NotificationPopup } from "./NotificationPopup";

interface LoggedInNavbarProps {
    session: Session;
    onLogout: () => void;
}

export const LoggedInNavbar = ({ session, onLogout }: LoggedInNavbarProps) => {
    const user = session.user;
    const userInitial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            {/* 
                DESKTOP VIEW (lg:flex) 
                Matches Screenshot 1: Logo | Search Bar | Jobs, Companies, Services | Bell, Avatar
            */}
            <header className="hidden lg:block sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-[1440px] mx-auto px-10 h-16 flex items-center justify-between">

                    {/* Left: Logo & Search */}
                    <div className="flex items-center gap-8 flex-0.5">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-[#0f766d] rounded-lg flex items-center justify-center text-white">
                                <RocketIcon />
                            </div>
                            <span className="text-[#0f766d] text-xl font-bold tracking-tight">TopCareerLive</span>
                        </Link>
                    </div>

                    {/* Right: Nav Links & Profile */}
                    <div className="flex items-center gap-8 flex-1 justify-end">
                        {/* Search Bar */}
                        <div className="relative w-full max-w-xl lg:ml-10">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2.5 border-none rounded-full leading-5 bg-[#F0F2F5] placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#0f766d] sm:text-sm"
                                placeholder="Search jobs, companies, or skills..."
                            />
                        </div>
                        <nav className="flex items-center gap-6 text-sm font-bold text-gray-700">
                            <Link href="/search" className="hover:text-[#0f766d] transition-colors">Jobs</Link>
                            <Link href="/companies" className="hover:text-[#0f766d] transition-colors">Companies</Link>
                            <Link href="/services" className="hover:text-[#0f766d] transition-colors">Services</Link>
                        </nav>

                        <div className="h-6 w-px bg-gray-200"></div>

                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <button
                                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                    className="text-gray-500 hover:text-[#0f766d] relative p-1"
                                >
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white transform translate-x-1/2 -translate-y-1/2"></span>
                                </button>
                                <NotificationPopup isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
                            </div>

                            {/* User Avatar */}
                            <div className="relative" ref={profileMenuRef}>
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="w-10 h-10 rounded-full bg-[#0e3f3a] text-white flex items-center justify-center font-bold border border-gray-200 overflow-hidden cursor-pointer"
                                    aria-label="User Profile Menu"
                                >
                                    {user?.image ? (
                                        <Image src={user.image} alt={user.name || "User"} width={40} height={40} className="object-cover" />
                                    ) : (
                                        <span>{userInitial}</span>
                                    )}
                                </button>

                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || "User"}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        <div className="p-2 space-y-1">
                                            <Link
                                                href="/seeker/dashboard"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                                className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#0f766d] hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setIsProfileMenuOpen(false);
                                                    onLogout();
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 
                MOBILE VIEW (lg:hidden) 
                Matches Screenshot 2: TopCareer Logo | Need help? | Search Icon
            */}
            <header className="lg:hidden bg-white px-4 py-3 border-b border-gray-100 sticky top-0 z-40 transition-all">
                {!isSearchOpen ? (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#0f766d] rounded-full flex items-center justify-center text-white">
                                <RocketIcon />
                            </div>
                            <span className="font-bold text-lg text-[#0e1b1a] tracking-tight">TopCareer</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-[#0f766d]">Need help?</span>
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                autoFocus
                                className="block w-full pl-9 pr-3 py-2 border-none rounded-full leading-5 bg-[#F0F2F5] placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#0f766d] text-sm"
                                placeholder="Search jobs, companies..."
                            />
                        </div>
                        <button
                            onClick={() => setIsSearchOpen(false)}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </header>
        </>
    );
};

function RocketIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436h.004l-2.222 2.222a.75.75 0 0 1-1.06 0l-2.546-2.546a.75.75 0 0 1 0-1.06l2.222-2.222v-.004ZM8 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" clipRule="evenodd" />
            <path d="M2.25 10a8.5 8.5 0 0 1 10.607-7.92 9.002 9.002 0 0 0-4.153 2.853l-1.926 1.927A10.457 10.457 0 0 0 4 14.502c-.85-.145-1.72-.257-2.617-.32a.75.75 0 0 1-.689-.868 37.89 37.89 0 0 1 .59-2.315 2.502 2.502 0 0 1 .966-1ZM14 20.25a8.5 8.5 0 0 1-7.92-10.607 9.002 9.002 0 0 0 2.853 4.153l1.927 1.926a10.457 10.457 0 0 0 7.632 2.768c-.145.85-.257 1.72-.32 2.617a.75.75 0 0 1-.868.689 37.89 37.89 0 0 1-2.315-.59 2.502 2.502 0 0 1-1-.966Z" />
        </svg>
    )
}
