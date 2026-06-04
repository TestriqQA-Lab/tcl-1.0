"use client";

import Link from "next/link";
import { useState } from "react";
import { EmployerAuthModal } from "@/components/auth/EmployerAuthModal";

export function EmployerNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isEmployerModalOpen, setIsEmployerModalOpen] = useState(false);

    const openEmployerModal = () => setIsEmployerModalOpen(true);
    const closeEmployerModal = () => setIsEmployerModalOpen(false);

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="max-w-[1240px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="size-8 bg-[#0f766d] rounded-lg flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-xl">rocket_launch</span>
                        </div>
                        <h2 className="text-xl font-bold font-sora tracking-tight text-[#0e1b1a]">TopCareerLive</h2>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#0e1b1a]">
                        <Link className="hover:text-[#0f766d] transition-colors" href="#">How it works</Link>
                        <Link className="hover:text-[#0f766d] transition-colors" href="#">Pricing</Link>
                        <Link className="hover:text-[#0f766d] transition-colors" href="#">Features</Link>
                        <Link className="hover:text-[#0f766d] transition-colors" href="#">FAQ</Link>
                    </nav>

                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={openEmployerModal}
                            className="px-4 py-2 text-sm font-semibold hover:bg-slate-100 rounded-lg transition-all text-[#0e1b1a]"
                        >
                            Log In
                        </button>
                        <button
                            onClick={openEmployerModal}
                            className="bg-[#0f766d] hover:bg-[#0d635c] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all"
                        >
                            Create Employer Account
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden text-gray-500 hover:text-[#0f766d] p-2"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className="material-symbols-outlined">{isOpen ? "close" : "menu"}</span>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden bg-white border-b border-slate-200 p-6 space-y-4">
                        <nav className="space-y-4 flex flex-col items-center">
                            <Link href="#" className="text-sm font-medium hover:text-[#0f766d]">How it works</Link>
                            <Link href="#" className="text-sm font-medium hover:text-[#0f766d]">Pricing</Link>
                            <Link href="#" className="text-sm font-medium hover:text-[#0f766d]">Features</Link>
                            <Link href="#" className="text-sm font-medium hover:text-[#0f766d]">FAQ</Link>
                        </nav>
                        <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                            <button
                                onClick={() => { openEmployerModal(); setIsOpen(false); }}
                                className="w-full text-center px-4 py-2 text-sm font-semibold hover:bg-slate-100 rounded-lg transition-all"
                            >
                                Log In
                            </button>
                            <button
                                onClick={() => { openEmployerModal(); setIsOpen(false); }}
                                className="w-full text-center bg-[#0f766d] hover:bg-[#0d635c] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all"
                            >
                                Create Employer Account
                            </button>
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
