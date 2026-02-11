"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { EmployerAuthModal } from "@/components/auth/EmployerAuthModal";
import { Session } from "next-auth";
import { logoutAction } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";

interface NavbarProps {
    session: Session | null;
}

export function Navbar({ session }: NavbarProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [authModal, setAuthModal] = useState<"login" | "register" | null>(null);

    const openLogin = () => setAuthModal("login");
    const openRegister = () => setAuthModal("register");
    const closeModal = () => setAuthModal(null);

    const switchToRegister = () => setAuthModal("register");
    const switchToLogin = () => setAuthModal("login");

    const [isEmployerModalOpen, setIsEmployerModalOpen] = useState(false);
    const openEmployerModal = () => setIsEmployerModalOpen(true);
    const closeEmployerModal = () => setIsEmployerModalOpen(false);

    const handleLogout = async () => {
        await logoutAction();
        router.refresh();
    };

    const user = session?.user;
    const userInitial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";

    return (
        <>
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">

                    {/* Left: Logo - Refined & Established */}
                    <Link href="/" className="flex items-center gap-3 shrink-0 group">
                        <div className="relative">
                            <div className="size-9 bg-gradient-to-br from-[#0f766d] to-[#0d6b63] rounded-xl flex items-center justify-center text-white shadow-sm">
                                <span className="material-symbols-outlined text-xl">work</span>
                            </div>
                            <div className="absolute -top-0.5 -right-0.5 size-2 bg-amber-400 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-gray-900 text-base font-bold tracking-tight">TopCareerLive</span>
                            <span className="text-[10px] text-gray-400 font-medium tracking-wide">SINCE 2014</span>
                        </div>
                    </Link>

                    {/* Center: Primary Navigation - Icon + Text + Badge Style */}
                    <nav className="hidden lg:flex items-center gap-1">
                        <Link
                            href="#"
                            className="group flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all"
                        >
                            <span className="material-symbols-outlined text-lg text-[#0f766d]">search</span>
                            <span className="text-sm font-medium text-gray-800">Find Jobs</span>
                            <span className="text-[10px] lg:hidden xl:block font-bold text-[#0f766d] bg-[#0f766d]/10 px-1.5 py-0.5 rounded">14K+</span>
                        </Link>

                        <div className="h-4 w-px bg-gray-200 mx-1"></div>

                        <Link
                            href="#"
                            className="group flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all"
                        >
                            <span className="material-symbols-outlined text-lg text-gray-500 group-hover:text-[#0f766d] transition-colors">apartment</span>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Companies</span>
                        </Link>

                        <div className="h-4 w-px bg-gray-200 mx-1"></div>

                        <Link
                            href="#"
                            className="group flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all"
                        >
                            <span className="material-symbols-outlined text-lg text-gray-500 group-hover:text-[#0f766d] transition-colors">school</span>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Resources</span>
                        </Link>

                        <div className="h-4 w-px bg-gray-200 mx-1"></div>

                        <Link
                            href="#"
                            className="group flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all"
                        >
                            <span className="material-symbols-outlined text-lg text-gray-500 group-hover:text-[#0f766d] transition-colors">trending_up</span>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Insights</span>
                        </Link>
                    </nav>

                    {/* Right: Auth + Employer CTA */}
                    <div className="hidden lg:flex items-center gap-3">
                        {user ? (
                            <div className="flex items-center gap-3">
                                {/* Profile Icon */}
                                <div className="size-9 rounded-full bg-[#0f766d]/10 text-[#0f766d] flex items-center justify-center font-bold border border-[#0f766d]/20 overflow-hidden">
                                    {user.image ? (
                                        <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{userInitial}</span>
                                    )}
                                </div>
                                <div className="flex flex-col mr-2">
                                    <span className="text-sm font-semibold text-gray-900 leading-tight">{user.name || "User"}</span>
                                    <span className="text-[10px] text-gray-500 leading-tight">{user.email}</span>
                                </div>
                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium text-red-600 px-4 py-2 rounded-lg border border-red-100 hover:bg-red-50 hover:border-red-200 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={openLogin}
                                    className="text-sm font-medium text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                                >
                                    Login
                                </button>
                                <Link
                                    href="/register"
                                    className="text-sm font-medium text-white bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Register
                                </Link>
                            </>
                        )}

                        <div className="h-5 w-px bg-gray-200"></div>

                        <button
                            onClick={openEmployerModal}
                            className="bg-[#0f766d]/10 text-[#0f766d] font-semibold text-sm px-5 py-2 rounded-lg hover:bg-[#0f766d]/20 transition-colors"
                        >
                            For Employers
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden text-gray-500 hover:text-[#0f766d] p-2"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className="material-symbols-outlined">{isOpen ? "close" : "menu"}</span>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="lg:hidden bg-white border-b border-gray-200 p-6 space-y-4">
                        {/* Nav Links */}
                        <nav className="space-y-2">
                            <Link href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                                <span className="material-symbols-outlined text-lg text-[#0f766d]">search</span>
                                <span className="text-sm font-medium text-gray-800">Find Jobs</span>
                                <span className="text-[10px] font-bold text-[#0f766d] bg-[#0f766d]/10 px-1.5 py-0.5 rounded ml-auto">14K+</span>
                            </Link>
                            <Link href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                                <span className="material-symbols-outlined text-lg text-gray-500">apartment</span>
                                <span className="text-sm font-medium text-gray-700">Companies</span>
                            </Link>
                            <Link href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                                <span className="material-symbols-outlined text-lg text-gray-500">school</span>
                                <span className="text-sm font-medium text-gray-700">Resources</span>
                            </Link>
                            <Link href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                                <span className="material-symbols-outlined text-lg text-gray-500">trending_up</span>
                                <span className="text-sm font-medium text-gray-700">Insights</span>
                            </Link>
                        </nav>

                        {/* Auth */}
                        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                            {user ? (
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 text-center text-sm font-medium text-red-600 px-4 py-2.5 rounded-lg border border-red-200 hover:bg-red-50"
                                >
                                    Logout ({user.name})
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => { openLogin(); setIsOpen(false); }}
                                        className="flex-1 text-center text-sm font-medium text-gray-700 px-4 py-2.5 rounded-lg border border-gray-200"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => { openRegister(); setIsOpen(false); }}
                                        className="flex-1 text-center text-sm font-medium text-white bg-gray-800 px-4 py-2.5 rounded-lg"
                                    >
                                        Register
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Employer CTA */}
                        <button
                            onClick={() => { openEmployerModal(); setIsOpen(false); }}
                            className="block w-full text-center bg-[#0f766d]/10 text-[#0f766d] font-semibold text-sm px-5 py-3 rounded-lg"
                        >
                            For Employers
                        </button>
                    </div>
                )}
            </header>

            {/* Auth Modals */}
            <AuthModal
                isOpen={authModal === "login"}
                onClose={closeModal}
                title="Welcome Back"
                subtitle="Sign in to continue your journey"
            >
                <LoginForm onSwitchToRegister={switchToRegister} onClose={closeModal} />
            </AuthModal>

            <AuthModal
                isOpen={authModal === "register"}
                onClose={closeModal}
                title="Create Account"
                subtitle="Join thousands of job seekers"
            >
                <RegisterForm onSwitchToLogin={switchToLogin} />
            </AuthModal>

            {/* Employer Auth Modal */}
            <EmployerAuthModal
                isOpen={isEmployerModalOpen}
                onClose={closeEmployerModal}
            />
        </>
    );
}
