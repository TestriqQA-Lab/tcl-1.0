"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";

export default function AdminLayoutWrapper({ 
    children,
    user
}: { 
    children: React.ReactNode;
    user?: { name?: string | null; email?: string | null };
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const navLinks = [
        { name: "Dashboard", href: "/admin-dashboard" },
        { name: "Employer Profiles", href: "/admin-dashboard/employers-profile" },
        { name: "Seeker Profiles", href: "/admin-dashboard/seekers-profile" },
        { name: "Job Approvals", href: "/admin-dashboard/job-approvals" },
        { name: "Job Postings", href: "/admin-dashboard/jobs" },
    ];

    const SidebarContent = () => {
        const displayName = user?.name || "Super Admin";
        const email = user?.email || "admin@example.com";
        const initials = displayName
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

        return (
            <div className="flex flex-col h-full bg-[#111827] text-white p-5 lg:p-6 w-full gap-8 justify-between relative">
                <div className="flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg lg:text-xl font-bold font-inter">Super Admin</h1>
                        {/* Close button for mobile/tablet menu */}
                        <button
                            className="lg:hidden text-white hover:text-gray-300"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <X size={24} />
                        </button>
                    </div>
                    
                    <nav className="flex flex-col gap-2">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-4 py-3 rounded-lg text-sm lg:text-base transition-colors ${
                                        isActive 
                                            ? "bg-[#1F2937] font-semibold" 
                                            : "hover:bg-[#1F2937] text-gray-300 hover:text-white"
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Profile Section */}
                <div className="flex flex-col gap-4 relative">
                    {/* Profile Panel Popup */}
                    {isProfileOpen && (
                        <>
                            <div className="fixed inset-0 z-[120]" onClick={() => setIsProfileOpen(false)} />
                            <div className="absolute bottom-16 left-0 right-0 z-[130] bg-[#1F2937] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                                <div className="p-4 border-b border-white/10">
                                    <span className="text-[14px] font-bold text-white truncate block">{displayName}</span>
                                    <span className="text-[12px] text-gray-400 truncate block mt-0.5">{email}</span>
                                </div>
                                <div className="p-2">
                                    <button
                                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            signOut({ callbackUrl: "/admin-login" });
                                        }}
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
                        className="flex items-center gap-3 pt-3 border-t border-white/10 cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-lg transition-colors outline-none text-left w-full mt-auto"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                        <div className="size-9 bg-blue-600 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                            <span className="text-white text-[13px] font-bold">{initials}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 overflow-hidden">
                            <span className="text-white text-[13px] font-semibold truncate">
                                {displayName}
                            </span>
                            <span className="text-gray-400 text-[11px] truncate">Admin</span>
                        </div>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col lg:flex-row w-full h-full bg-[#F9FAFB]">
            {/* --- Mobile/Tablet Top Navigation --- */}
            <header className="lg:hidden flex items-center justify-between bg-[#111827] text-white h-16 px-4 shrink-0 shadow-sm z-20">
                <h1 className="text-lg font-bold font-inter">Super Admin</h1>
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-1 hover:bg-[#1F2937] rounded transition-colors"
                >
                    <Menu size={24} />
                </button>
            </header>

            {/* --- Mobile/Tablet Sidebar Overlay --- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black z-30 lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className="fixed inset-y-0 left-0 w-[240px] z-40 bg-[#111827] lg:hidden shadow-xl"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* --- Desktop Only Sidebar --- */}
            <aside className="hidden lg:flex flex-col w-[220px] h-full shrink-0 shadow-md z-10 relative">
                <SidebarContent />
            </aside>

            {/* --- Main Content Area --- */}
            <main className="flex-1 overflow-auto w-full">
                {children}
            </main>
        </div>
    );
}
