"use client";

import React from "react";
import Link from "next/link";
import { JobApplyButton } from "@/components/job/JobApplyButton";

interface RealJobCardProps {
    job: {
        id: string;
        title: string;
        company: string | null;
        companyLogo: string | null;
        location: string;
        type: string;
        salaryMin: number;
        salaryMax: number;
        description: string;
        createdAt: Date;
        salary: string;
    };
}

// Helper to format time ago
function formatTimeAgo(date: Date) {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
}

export function RealJobCard({ job }: RealJobCardProps) {
    const timeAgo = formatTimeAgo(new Date(job.createdAt));

    return (
        <div className="bg-white p-6 rounded-xl ring-2 ring-[#0f766d]/20 hover:ring-[#0f766d]/50 hover:shadow-2xl hover:-translate-y-1 transition-all group h-full flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start mb-6 z-10">
                <div className={`size-14 rounded-lg flex items-center justify-center p-2 border border-gray-100 bg-white shadow-sm overflow-hidden`}>
                    {job.companyLogo ? (
                        <img
                            alt={`${job.company} logo`}
                            className="w-full h-full object-contain"
                            src={job.companyLogo}
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl">
                            {job.company?.[0]?.toUpperCase() || "C"}
                        </div>
                    )}
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-100`}>
                    {job.type}
                </span>
            </div>

            <div className="flex-grow z-10">
                <Link href={`/job/${job.id}`}>
                    <h3 className="text-xl font-bold group-hover:text-[#0f766d] transition-colors line-clamp-2">{job.title}</h3>
                </Link>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <span className="font-medium text-gray-700 truncate max-w-[120px]">{job.company}</span>
                    <span>•</span>
                    <span className="truncate max-w-[100px] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {job.location}
                    </span>
                </div>

                <div className="mt-4 text-xs font-semibold text-[#0f766d] bg-[#0f766d]/5 px-3 py-1.5 rounded-lg inline-block">
                    {job.salary}
                </div>

                <div 
                    className="text-gray-500 text-sm mt-4 line-clamp-2 leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                />
                
                <div className="mt-4 text-[11px] text-slate-400">
                    Posted {timeAgo}
                </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 z-10 w-full pt-4 border-t border-slate-100">
                <JobApplyButton jobId={job.id} className="w-full py-2.5 text-sm shadow-sm" />
                
                <Link 
                    href={`/job/${job.id}`}
                    className="w-full text-center bg-gray-50 text-gray-700 hover:bg-gray-100 font-semibold py-2.5 rounded-xl transition-all text-sm border border-gray-200 cursor-pointer"
                >
                    View Details
                </Link>
            </div>
            
            {/* Decorative background glow on hover */}
            <div className="absolute -bottom-10 -right-10 size-40 bg-[#0f766d]/[0.03] rounded-full blur-2xl group-hover:bg-[#0f766d]/10 transition-colors duration-500 pointer-events-none"></div>
        </div>
    );
}
