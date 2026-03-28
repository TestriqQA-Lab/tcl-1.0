"use client";

import Link from "next/link";
import { Briefcase, MapPin, FileText, Star, Bookmark, Share2 } from "lucide-react";

export interface SearchJob {
    id: string;
    title: string;
    company: string | null;
    companyLogo: string | null;
    location: string;
    type: string;
    description: string;
    salary: string;
    experienceLevel?: number;
    requiredSkills?: string[];
    createdAt?: Date;
}

export interface SearchJobCardProps {
    job: SearchJob;
}

export function SearchJobCard({ job }: SearchJobCardProps) {
    // Dummy data for professional look (since these aren't in DB yet)
    const skills = job.requiredSkills?.length ? job.requiredSkills : ["frontend developer", "UI Developer", "CSS", "rest"];
    
    // Format relative time
    const getRelativeTime = (date?: Date) => {
        if (!date) return "Today";
        const now = new Date();
        const diffInMs = now.getTime() - new Date(date).getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInMins = Math.floor(diffInMs / (1000 * 60));

        if (diffInMins < 1) return "Just now";
        if (diffInMins < 60) return `${diffInMins} min ago`;
        if (diffInHours < 24) return "Today";
        if (diffInDays === 1) return "1 day ago";
        return `${diffInDays} days ago`;
    };

    const timeAgo = getRelativeTime(job.createdAt);

    return (
        <div className="group relative bg-white border border-slate-200 rounded-[24px] p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 w-full cursor-pointer hover:border-slate-300">
            <Link href={`/job/${job.id}`} className="absolute inset-0 z-0" />
            
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                    {/* Job Title */}
                    <h3 className="text-[18px] font-bold text-slate-900 group-hover:text-[#0f766d] transition-colors leading-snug">
                        {job.title}
                    </h3>
                    
                    {/* Company Info row */}
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[14px] font-semibold text-slate-700">{job.company || "Company Name"}</span>
                    </div>

                    {/* Meta Rows (Experience & Location) */}
                    <div className="flex items-center gap-6 mt-4 text-slate-600">
                        <div className="flex items-center gap-2">
                            <Briefcase size={16} className="text-slate-400" />
                            <span className="text-[14px] font-medium">{job.experienceLevel ?? 0}-{ (job.experienceLevel ?? 0) + 2 } Yrs</span>
                        </div>
                        <span className="text-slate-200">|</span>
                        <div className="flex items-center gap-2 max-w-[250px] truncate">
                            <MapPin size={16} className="text-slate-400" />
                            <span className="text-[14px] font-medium truncate">{job.type} - {job.location}</span>
                        </div>
                    </div>

                    {/* Description Snippet */}
                    <div className="flex items-start gap-2 mt-4 text-slate-500">
                        <FileText size={16} className="text-slate-400 mt-0.5 shrink-0" />
                        <p className="text-[14px] line-clamp-1 leading-relaxed leading-snug">
                            {job.description
                                .replace(/<[^>]*>?/gm, '') // Strip tags
                                .replace(/&amp;/g, '&')
                                .replace(/&lt;/g, '<')
                                .replace(/&gt;/g, '>')
                                .replace(/&quot;/g, '"')
                                .replace(/&#39;/g, "'")
                                .substring(0, 100)}...
                        </p>
                    </div>

                    {/* Skills Tags Row */}
                    <div className="flex flex-wrap items-center gap-2 mt-5">
                        {skills.map((skill) => (
                            <span 
                                key={skill} 
                                className="px-3 py-1 bg-slate-50 text-slate-500 text-[12px] font-medium rounded-full border border-slate-100 hover:border-[#0f766d]/30 hover:text-[#0f766d] transition-colors cursor-default"
                            >
                                {skill.toLowerCase()}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Company Logo on Right */}
                <div className="shrink-0 size-20 rounded-[20px] border border-slate-100 p-3 bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                    {job.companyLogo ? (
                        <img 
                            src={job.companyLogo} 
                            alt={job.company || "Logo"} 
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <Building2 size={24} className="text-slate-300" />
                    )}
                </div>
            </div>

            {/* Footer Row */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                    <span className="text-[12px] font-medium text-slate-400 uppercase tracking-widest">{timeAgo}</span>
                </div>
            </div>
        </div>
    );
}

function Building2({ size, className }: { size: number, className?: string }) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
            <path d="M9 22v-4h6v4" />
            <path d="M8 6h.01" />
            <path d="M16 6h.01" />
            <path d="M12 6h.01" />
            <path d="M12 10h.01" />
            <path d="M12 14h.01" />
            <path d="M16 10h.01" />
            <path d="M16 14h.01" />
            <path d="M8 10h.01" />
            <path d="M8 14h.01" />
        </svg>
    );
}
