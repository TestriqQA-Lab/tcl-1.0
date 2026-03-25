"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { CompanyListItem } from "@/actions/company.actions";

interface CompanyCardProps {
    company: CompanyListItem;
    index?: number;
}

function getInitials(name: string): string {
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

export function CompanyCard({ company, index = 0 }: CompanyCardProps) {
    const initials = getInitials(company.companyName);
    const isVerified = company.verificationStatus === "VERIFIED" || company.verificationStatus === "APPROVED";
    const hasJobs = company.openJobsCount > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
            className="h-full"
        >
            <Link
                href={`/company/${company.userId}`}
                className="group flex flex-col bg-white rounded-2xl border border-gray-200 hover:border-[#0f766d]/40 hover:shadow-xl hover:shadow-[#0f766d]/[0.08] hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full relative"
            >
                {/* Subtle top border highlight on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#0f766d] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="p-5 md:p-6 flex flex-col flex-1">
                    {/* Header: Logo, Name, Industry */}
                    <div className="flex gap-4 items-start mb-5">
                        {/* Logo Box */}
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl border border-gray-100 p-1.5 shadow-sm bg-white flex items-center justify-center shrink-0 relative">
                            {company.companyLogo ? (
                                <img
                                    src={company.companyLogo}
                                    alt={company.companyName}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="w-full h-full rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 font-bold text-lg md:text-xl">
                                    {initials}
                                </div>
                            )}
                            {isVerified && (
                                <div className="absolute -bottom-1.5 -right-1.5 bg-white rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#0f766d]" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }} title="Verified Employer">verified</span>
                                </div>
                            )}
                        </div>

                        {/* Title & Industry */}
                        <div className="pt-1 flex-1 min-w-0">
                            <h3 className="text-[17px] font-bold text-gray-900 group-hover:text-[#0f766d] transition-colors truncate">
                                {company.companyName}
                            </h3>
                            <p className="text-[13px] text-gray-500 truncate mt-0.5">
                                {company.companyIndustry || "Industry not specified"}
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-gray-100 mb-5" />
                    
                    {/* Structured Metrics Grid */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6 flex-1">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Location</span>
                            <span className="text-[13px] font-medium text-gray-800 flex items-start gap-1.5">
                                <span className="material-symbols-outlined text-gray-400 shrink-0" style={{fontSize:"16px"}}>location_on</span>
                                <span className="line-clamp-2 leading-tight pr-1">{company.companyLocation || "Global"}</span>
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Company Size</span>
                            <span className="text-[13px] font-medium text-gray-800 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-gray-400 shrink-0" style={{fontSize:"16px"}}>group</span>
                                <span className="truncate">{company.companySize || "N/A"}</span>
                            </span>
                        </div>
                    </div>

                    {/* Footer: Open Roles & CTA */}
                    <div className="mt-auto flex items-center justify-between pt-4 pb-1 border-t border-gray-100 bg-gray-50/80 -mx-5 md:-mx-6 -mb-5 md:-mb-6 px-5 md:px-6 rounded-b-2xl min-h-[56px]">
                        <div>
                            {hasJobs ? (
                                <span className="inline-flex items-center gap-2 text-[13px] font-bold text-[#0f766d]">
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0f766d] opacity-40"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0f766d]"></span>
                                    </span>
                                    {company.openJobsCount} Active {company.openJobsCount === 1 ? 'Role' : 'Roles'}
                                </span>
                            ) : (
                                <span className="text-[13px] font-semibold text-gray-500">
                                    No active roles
                                </span>
                            )}
                        </div>
                        <span className="inline-flex items-center gap-1 text-[13px] font-bold text-gray-900 group-hover:text-[#0f766d] transition-colors bg-white border border-gray-200 shadow-sm px-3 py-1.5 rounded-lg group-hover:border-[#0f766d]/30">
                            Explore
                            <span className="material-symbols-outlined transform group-hover:translate-x-0.5 transition-transform" style={{ fontSize: "16px" }}>arrow_forward</span>
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
