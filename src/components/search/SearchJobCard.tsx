"use client";

import { SearchJob } from "@/data/search-mock-data";

interface SearchJobCardProps {
    job: SearchJob;
}

export function SearchJobCard({ job }: SearchJobCardProps) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex gap-3">
                    <div className="size-12 rounded-lg bg-slate-100 p-2 shrink-0">
                        <img
                            alt={`${job.company} logo`}
                            className="size-full rounded object-contain"
                            src={job.logoUrl}
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-sm md:text-base">{job.title}</h3>
                        <p className="text-sm text-[#0f766d] font-medium">{job.company}</p>
                    </div>
                </div>
                <button className={job.isBookmarked ? "text-[#0f766d]" : "text-slate-400 hover:text-[#0f766d] transition-colors"}>
                    <span
                        className="material-symbols-outlined"
                        style={job.isBookmarked ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                        bookmark
                    </span>
                </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                    <span key={tag} className="rounded bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                        {tag}
                    </span>
                ))}
                <span className="rounded bg-[#0f766d]/10 px-2 py-1 text-[11px] font-bold text-[#0f766d]">
                    {job.salary}
                </span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">schedule</span>
                    {job.postedTime}
                </span>
                <button className="rounded-lg bg-[#0f766d] px-4 py-2 text-xs font-bold text-white hover:bg-[#0f766d]/90 transition-colors">
                    Apply Now
                </button>
            </div>
        </div>
    );
}
