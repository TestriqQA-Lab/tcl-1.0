"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { EmployerAuthModal } from "@/components/auth/EmployerAuthModal";
import { LayoutDashboard, LogOut } from "lucide-react";
import { Session } from "next-auth";

interface EmployerNavbarProps {
    session: Session | null;
    onLogout: () => void;
}

export function EmployerNavbar({ session, onLogout }: EmployerNavbarProps) {
    const [isEmployerModalOpen, setIsEmployerModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    const openEmployerModal = () => setIsEmployerModalOpen(true);
    const closeEmployerModal = () => setIsEmployerModalOpen(false);

    const user = session?.user;
    const userInitial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "E";

    // Close profile dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">

                    {/* Left: Logo */}
                    <Link href="/employers" className="flex items-center gap-2 shrink-0 group">
                        <div className="w-8 h-8 bg-[#0f766d] rounded-lg flex items-center justify-center text-white shadow-sm">
                            <span className="material-symbols-outlined text-[18px]">rocket</span>
                        </div>
                        <span className="text-slate-900 text-xl font-bold tracking-tight font-inter">TopCareerLive</span>
                    </Link>

                    {/* Middle: Links */}
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link href="#how-it-works" className="text-sm font-medium text-slate-900 hover:text-[#0f766d] transition-colors font-inter">
                            How it works
                        </Link>
                        <Link href="#features" className="text-sm font-medium text-slate-900 hover:text-[#0f766d] transition-colors font-inter">
                            Features
                        </Link>
                        <Link href="#faq" className="text-sm font-medium text-slate-900 hover:text-[#0f766d] transition-colors font-inter">
                            FAQ
                        </Link>
                    </nav>

                    {/* Right: Actions */}
                    <div className="hidden lg:flex items-center gap-3">
                        {session ? (
                            /* ── Logged-in: Profile Avatar + Dropdown ── */
                            <div className="relative" ref={profileMenuRef}>
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="w-10 h-10 rounded-full bg-[#0f766d] text-white flex items-center justify-center font-bold border-2 border-white shadow-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#0f766d]/30 transition-all"
                                    aria-label="Employer Profile Menu"
                                >
                                    {user?.image ? (
                                        <Image src={user.image} alt={user.name || "User"} width={40} height={40} className="object-cover" />
                                    ) : (
                                        <span className="text-sm font-bold">{userInitial}</span>
                                    )}
                                </button>

                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        {/* User info */}
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || "Employer"}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        {/* Menu items */}
                                        <div className="p-2 space-y-1">
                                            <Link
                                                href="/employer/dashboard"
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
                        ) : (
                            /* ── Guest: Log In + Create Account ── */
                            <>
                                <button
                                    onClick={openEmployerModal}
                                    className="text-sm font-semibold text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors font-inter"
                                >
                                    Log In
                                </button>
                                <Link
                                    href="/employers/client-registration"
                                    className="text-sm font-bold text-white bg-[#0f766d] hover:bg-[#0d6b63] px-5 py-2.5 rounded-lg shadow-[0_2px_8px_rgba(15,118,109,0.2)] transition-all font-inter"
                                >
                                    Create Employer Account
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden text-slate-500 hover:text-[#0f766d] p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <span className="material-symbols-outlined">{isMobileMenuOpen ? "close" : "menu"}</span>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-white border-b border-slate-200 p-6 space-y-4">
                        <nav className="flex flex-col gap-4 mb-6">
                            <Link href="#how-it-works" className="text-sm font-medium text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>How it works</Link>
                            <Link href="#features" className="text-sm font-medium text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>Features</Link>
                            <Link href="#faq" className="text-sm font-medium text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
                        </nav>

                        {session ? (
                            /* ── Mobile Logged-in ── */
                            <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-3 px-1 pb-2">
                                    <div className="w-9 h-9 rounded-full bg-[#0f766d] text-white flex items-center justify-center font-bold text-sm overflow-hidden">
                                        {user?.image ? (
                                            <Image src={user.image} alt={user.name || "User"} width={36} height={36} className="object-cover" />
                                        ) : (
                                            <span>{userInitial}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-sm font-semibold text-slate-900">{user?.name || "Employer"}</p>
                                        <p className="text-xs text-slate-500 truncate max-w-[180px]">{user?.email}</p>
                                    </div>
                                </div>
                                <Link
                                    href="/employer/dashboard"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-2 w-full text-sm font-medium text-slate-900 py-2.5 px-3 border border-slate-200 rounded-lg"
                                >
                                    <LayoutDashboard className="w-4 h-4 text-[#0f766d]" />
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => { setIsMobileMenuOpen(false); onLogout(); }}
                                    className="flex items-center gap-2 w-full text-sm font-medium text-red-600 py-2.5 px-3 border border-red-100 bg-red-50 rounded-lg"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            /* ── Mobile Guest ── */
                            <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => { openEmployerModal(); setIsMobileMenuOpen(false); }}
                                    className="w-full text-center text-sm font-semibold text-slate-900 py-3 border border-slate-200 rounded-lg"
                                >
                                    Log In
                                </button>
                                <Link
                                    href="/employers/client-registration"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full text-center text-sm font-bold text-white bg-[#0f766d] py-3 rounded-lg"
                                >
                                    Create Employer Account
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </header>

            {/* Employer Auth Modal (only shown when not logged in) */}
            {!session && (
                <EmployerAuthModal
                    isOpen={isEmployerModalOpen}
                    onClose={closeEmployerModal}
                />
            )}
        </>
    );
}
