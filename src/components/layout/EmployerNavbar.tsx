"use client";

import Link from "next/link";
import { useState } from "react";
import { EmployerAuthModal } from "@/components/auth/EmployerAuthModal";

export function EmployerNavbar() {
    const [isEmployerModalOpen, setIsEmployerModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const openEmployerModal = () => setIsEmployerModalOpen(true);
    const closeEmployerModal = () => setIsEmployerModalOpen(false);

    return (
        <>
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">

                    {/* Left: Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0 group">
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
                        <Link href="#pricing" className="text-sm font-medium text-slate-900 hover:text-[#0f766d] transition-colors font-inter">
                            Pricing
                        </Link>
                        <Link href="#faq" className="text-sm font-medium text-slate-900 hover:text-[#0f766d] transition-colors font-inter">
                            FAQ
                        </Link>
                    </nav>

                    {/* Right: Actions */}
                    <div className="hidden lg:flex items-center gap-3">
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
                            <Link href="#pricing" className="text-sm font-medium text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
                            <Link href="#faq" className="text-sm font-medium text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
                        </nav>
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
                    </div>
                )}
            </header>

            <EmployerAuthModal
                isOpen={isEmployerModalOpen}
                onClose={closeEmployerModal}
            />
        </>
    );
}
