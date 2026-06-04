"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { CompanyListItem } from "@/actions/company.actions";

interface FeaturedCompaniesProps {
    companies: CompanyListItem[];
}

const gradients = [
    "from-[#0f766d] to-[#0a5f57]",
    "from-indigo-500 to-indigo-700",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-violet-500 to-purple-700",
    "from-sky-500 to-blue-600",
];

const softBgs = [
    "bg-[#0f766d]/[0.06]",
    "bg-indigo-500/[0.06]",
    "bg-amber-500/[0.06]",
    "bg-rose-500/[0.06]",
    "bg-violet-500/[0.06]",
    "bg-sky-500/[0.06]",
];

function getInitials(name: string): string {
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function getGradientIndex(name: string): number {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % gradients.length;
}

export function FeaturedCompanies({ companies: initialCompanies }: FeaturedCompaniesProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // To fulfill the requirement of 4-5 batches, we ensure there are at least 20 items (5 batches of 4)
    // by duplicating the available companies if the database returned fewer.
    const companies = [...initialCompanies];
    if (companies.length > 0) {
        let i = 0;
        while (companies.length < 20) {
            // Clone the company and give it a slightly modified ID for React keys
            companies.push({ 
                ...initialCompanies[i % initialCompanies.length], 
                id: `${initialCompanies[i % initialCompanies.length].id}-clone-${i}` 
            });
            i++;
        }
    }

    // Auto-scroll logic for the featured companies carousel
    useEffect(() => {
        if (!scrollContainerRef.current || companies.length <= 4) return;
        
        const interval = setInterval(() => {
            const container = scrollContainerRef.current;
            if (!container) return;
            
            const scrollAmount = container.clientWidth;
            
            // If we are around the very end of the scroll array, go back to start
            if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 20) {
                container.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                container.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }, 3000); // Trigger auto-slide every 3 seconds
        
        return () => clearInterval(interval);
    }, [companies.length]);

    if (initialCompanies.length === 0) return null;

    return (
        <section className="mb-10 md:mb-14">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-amber-500/10 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-amber-500" style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-gray-900">Featured Companies</h2>
                        <p className="text-xs md:text-sm text-gray-500 hidden sm:block">Top employers with the most open positions</p>
                    </div>
                </div>
            </div>

            {/* Horizontal Auto-Scroll Carousel */}
            <div 
                ref={scrollContainerRef}
                className="flex gap-5 overflow-x-auto pb-4 -mx-1 px-1 snap-x snap-mandatory" 
                style={{ scrollbarWidth: "none" }}
            >
                {companies.map((company, i) => {
                    const gi = getGradientIndex(company.companyName);
                    const gradient = gradients[gi];
                    const softBg = softBgs[gi];
                    const initials = getInitials(company.companyName);
                    const isVerified = company.verificationStatus === "VERIFIED" || company.verificationStatus === "APPROVED";

                    return (
                        <motion.div
                            key={company.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.35, delay: i * 0.06 }}
                            className="shrink-0 w-[280px] sm:w-[300px] md:w-[320px] h-full snap-start"
                        >
                            <Link
                                href={`/company/${company.userId}`}
                                className="group flex flex-col bg-white rounded-3xl border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 overflow-hidden h-full relative"
                            >
                                {/* Top Banner Area */}
                                <div className={`h-24 w-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-15 transition-opacity`} />
                                
                                {/* Top Edge Accent Line */}
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />

                                <div className="px-6 pb-6 flex-1 flex flex-col z-10">
                                    {/* The Unified Logo Container (Floating) */}
                                    <div className="-mt-10 mb-4 w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:-translate-y-1 transition-transform duration-300">
                                        {company.companyLogo ? (
                                            <img
                                                src={company.companyLogo}
                                                alt={company.companyName}
                                                className="w-14 h-14 object-contain"
                                            />
                                        ) : (
                                            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-2xl`}>
                                                {initials}
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                                        <h3 className="text-[17px] font-bold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-1" title={company.companyName}>
                                            {company.companyName}
                                        </h3>
                                        {isVerified && (
                                            <span className="material-symbols-outlined text-[#0f766d] shrink-0" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }} title="Verified Employer">verified</span>
                                        )}
                                    </div>

                                    {company.companyIndustry && (
                                        <p className="text-sm text-gray-500 mb-5 line-clamp-1">{company.companyIndustry}</p>
                                    )}

                                    {/* Footer Tags */}
                                    <div className="flex items-center gap-2 flex-wrap mt-auto">
                                        {company.companyLocation && (
                                            <span className="inline-flex items-center gap-1 text-[13px] font-medium text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg">
                                                <span className="material-symbols-outlined shrink-0" style={{ fontSize: "14px" }}>location_on</span>
                                                <span className="truncate max-w-[120px]">{company.companyLocation}</span>
                                            </span>
                                        )}
                                        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#0f766d] bg-[#0f766d]/10 border border-[#0f766d]/10 px-2.5 py-1 rounded-lg">
                                            <span className="material-symbols-outlined shrink-0" style={{ fontSize: "14px" }}>work</span>
                                            {company.openJobsCount} {company.openJobsCount === 1 ? "job" : "jobs"}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
