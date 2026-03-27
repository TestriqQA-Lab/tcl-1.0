"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface CompaniesHeroProps {
    stats: {
        totalCompanies: number;
        totalIndustries: number;
        totalOpenJobs: number;
    };
}

export function CompaniesHero({ stats }: CompaniesHeroProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (searchQuery.trim()) {
            params.set("search", searchQuery.trim());
        } else {
            params.delete("search");
        }
        params.delete("page");
        router.push(`/companies?${params.toString()}`);
    };

    return (
        <section className="relative mb-10 md:mb-12">
            <div className="relative overflow-hidden rounded-2xl lg:rounded-[2rem] bg-white">

                <div className="px-6 py-10 sm:px-10 md:px-16 lg:px-10">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Eyebrow */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                            className="inline-flex items-center gap-2.5 bg-[#0f766d]/5 border border-[#0f766d]/10 rounded-full px-3 py-1 mb-6 md:mb-8"
                        >
                            <div className="w-2 h-2 rounded-full bg-[#0f766d] animate-pulse" />
                            <span className="text-sm sm:text-base font-bold text-[#0f766d] tracking-wide">
                                {stats.totalOpenJobs > 0 ? `${stats.totalOpenJobs}+ open positions right now` : "Hiring now"}
                            </span>
                        </motion.div>

                        {/* Title - Increased Size */}
                        <motion.h1
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.08 }}
                            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1] mb-5 md:mb-6 tracking-tight"
                        >
                            Explore Companies That
                            <br className="hidden md:block" />
                            <span className="text-[#0f766d]"> Shape Careers</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.16 }}
                            className="text-lg text-gray-500 mb-10 md:mb-14 max-w-2xl mx-auto leading-relaxed"
                        >
                            Research culture, compensation, and open roles — discover where you truly belong.
                        </motion.p>

                        {/* Search Bar */}
                        <motion.form
                            onSubmit={handleSearch}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.24 }}
                            className="relative max-w-2xl mx-auto mb-10 md:mb-12"
                        >
                            <div className="flex items-center bg-white border border-gray-200 rounded-full overflow-hidden focus-within:border-[#0f766d]/50 focus-within:ring-4 focus-within:ring-[#0f766d]/10 transition-all shadow-sm hover:shadow-md">
                                <div className="flex items-center flex-1 px-4 md:px-5">
                                    <span className="material-symbols-outlined text-gray-400 mr-3 text-xl md:text-2xl">search</span>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search by company name, industry, or keyword..."
                                        className="w-full py-2.5 md:py-4 text-sm md:text-base font-medium text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearchQuery("");
                                                const params = new URLSearchParams(searchParams.toString());
                                                params.delete("search");
                                                params.delete("page");
                                                router.push(`/companies?${params.toString()}`);
                                            }}
                                            className="text-gray-400 hover:text-gray-600 p-1 flex items-center justify-center cursor-pointer transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg md:text-xl">close</span>
                                        </button>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="bg-[#0f766d] hover:bg-[#0a5f57] text-white font-semibold px-8 py-2 md:py-3.5 text-sm md:text-base transition-colors cursor-pointer shrink-0 m-1.5 rounded-full shadow-sm"
                                >
                                    Search
                                </button>
                            </div>
                        </motion.form>

                        {/* Stats Row - Increased Size */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.32 }}
                            className="flex flex-wrap items-center justify-center gap-8 md:gap-14 lg:gap-20"
                        >
                            <StatItem
                                value={stats.totalCompanies > 0 ? stats.totalCompanies.toLocaleString() : "50"}
                                label="Companies"
                                icon="apartment"
                            />
                            <div className="h-12 w-0.5 bg-gray-200 hidden sm:block" />
                            <StatItem
                                value={stats.totalIndustries > 0 ? stats.totalIndustries.toLocaleString() : "10"}
                                label="Industries"
                                icon="category"
                            />
                            <div className="h-12 w-0.5 bg-gray-200 hidden sm:block" />
                            <StatItem
                                value={stats.totalOpenJobs > 0 ? stats.totalOpenJobs.toLocaleString() : "100"}
                                label="Open Roles"
                                icon="work"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function StatItem({ value, label, icon }: { value: string; label: string; icon: string }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-[#0f766d]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#0f766d]" style={{ fontSize: "28px" }}>{icon}</span>
            </div>
            <div className="text-left">
                <p className="text-2xl md:text-4xl font-bold text-gray-900 leading-none tracking-tight">{value}+</p>
                <p className="text-sm md:text-base text-gray-500 font-bold mt-1 uppercase tracking-wide">{label}</p>
            </div>
        </div>
    );
}
