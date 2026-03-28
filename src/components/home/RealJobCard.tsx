"use client";

import React from "react";
import Link from "next/link";

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
        requiredSkills?: string[] | null;
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

function stripHtml(html: string) {
    if (typeof window === 'undefined') return html.replace(/<[^>]*>?/gm, '');
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

export function RealJobCard({ job }: RealJobCardProps) {
    const timeAgo = formatTimeAgo(new Date(job.createdAt));
    const isSenior = job.title.toLowerCase().includes("senior") || job.title.toLowerCase().includes("lead") || job.title.toLowerCase().includes("manager");
    const expReq = isSenior ? "5-8 Yrs" : "0-3 Yrs";
    const plainDesc = stripHtml(job.description);

    // Default to the job type if no skills are present
    const skillsToDisplay = job.requiredSkills && job.requiredSkills.length > 0 
        ? job.requiredSkills.slice(0, 4) 
        : [job.type, "Actively Hiring"];

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-[#0f766d] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all group flex flex-col relative overflow-hidden h-full">
            
            {/* Header: Title and Company Logo */}
            <div className="flex justify-between items-start gap-4 z-10 w-full relative">
                <div className="flex-1">
                    <h3 className="text-[19px] font-bold text-gray-900 group-hover:text-[#0f766d] transition-colors leading-tight line-clamp-1">
                        {job.title}
                    </h3>
                    <p className="text-[15px] text-gray-600 font-medium mt-1.5">{job.company || "Confidential Company"}</p>
                </div>
                {/* Company Logo */}
                <div className="size-16 sm:size-20 shrink-0 rounded-xl border border-gray-100 p-2 sm:p-3 flex items-center justify-center bg-white shadow-sm">
                    {job.companyLogo ? (
                        <img src={job.companyLogo} alt={job.company || "Company"} className="w-full h-full object-contain" />
                    ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400 font-bold text-2xl rounded-lg">
                            {job.company?.[0]?.toUpperCase() || "C"}
                        </div>
                    )}
                </div>
            </div>

            {/* Key Info: Experience, Salary, Location */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 text-[14px] text-gray-500 font-medium z-10 relative pointer-events-none">
                <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">work</span>
                    <span>{expReq}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                    <span>{job.salary || "Not Disclosed"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    <span className="truncate max-w-[140px]">{job.location}</span>
                </div>
            </div>

            {/* Description snippet */}
            <div className="mt-5 flex items-start gap-2 text-[14px] text-gray-600 z-10 flex-grow relative pointer-events-none">
                <span className="material-symbols-outlined text-[18px] text-gray-400 mt-0.5 shrink-0">description</span>
                <p className="line-clamp-2 leading-relaxed">{plainDesc}</p>
            </div>

            {/* Dynamic Skills section */}
            <div className="flex flex-wrap items-center gap-2 mt-5 z-10 relative pointer-events-none">
                {skillsToDisplay.map((skill, index) => (
                    <span key={index} className="text-[12px] font-medium px-2.5 py-1 rounded bg-gray-50 text-gray-600 border border-gray-100">
                        {skill}
                    </span>
                ))}
                {job.requiredSkills && job.requiredSkills.length > 4 && (
                    <span className="text-[12px] font-medium px-2.5 py-1 rounded bg-gray-50 text-gray-600 border border-gray-100">
                        +{job.requiredSkills.length - 4}
                    </span>
                )}
            </div>

            {/* Footer: Posted time */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between z-10 relative pointer-events-none">
                <div className="text-[13px] text-gray-400 font-medium flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    {timeAgo}
                </div>
                {/* Visual arrow indicator instead of buttons */}
                <span className="material-symbols-outlined text-gray-300 group-hover:text-[#0f766d] group-hover:translate-x-1 transition-all">chevron_right</span>
            </div>
            
            {/* Absolute Link Wrapper for purely clickable card without breaking Next.js hydration */}
            <Link href={`/job/${job.id}`} className="absolute inset-0 z-20" aria-label={`View details for ${job.title}`}></Link>

            {/* Decorative background pulse on hover */}
            <div className="absolute right-0 top-0 w-40 h-40 bg-gradient-to-bl from-[#0f766d]/10 to-transparent blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"></div>
        </div>
    );
}
