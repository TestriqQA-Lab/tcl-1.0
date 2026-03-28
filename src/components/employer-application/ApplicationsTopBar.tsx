"use client";

import { Search, SlidersHorizontal, Download } from "lucide-react";

export function ApplicationsTopBar() {
    return (
        <div className="hidden lg:flex items-center justify-between w-full h-[72px] px-10 bg-white border-b border-[#E2E8F0]">
            {/* Left: Title + Count */}
            <div className="flex items-center gap-4">
                <h1 className="text-[22px] font-bold text-[#0e1b1a] tracking-[-0.5px]">
                    Applications
                </h1>
                <span className="px-2.5 py-1 bg-[#0f766d]/8 text-[#0f766d] text-xs font-semibold rounded-full">
                    1,847 total
                </span>
            </div>

            {/* Right: Search + Filters + Export */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-[240px] h-[38px] px-3 bg-[#F1F5F9] rounded-lg border border-[#E2E8F0]">
                    <Search size={16} className="text-[#94A3B8]" />
                    <input
                        type="text"
                        placeholder="Search applicants..."
                        className="bg-transparent text-[13px] text-[#0e1b1a] placeholder-[#94A3B8] outline-none w-full"
                    />
                </div>
                <button className="flex items-center gap-1.5 h-[38px] px-3.5 bg-white rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFB] transition-colors">
                    <SlidersHorizontal size={16} className="text-[#64748B]" />
                    <span className="text-[13px] font-medium text-[#64748B]">Filters</span>
                </button>
                <button className="flex items-center gap-1.5 h-[38px] px-3.5 bg-white rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFB] transition-colors">
                    <Download size={16} className="text-[#64748B]" />
                    <span className="text-[13px] font-medium text-[#64748B]">Export</span>
                </button>
            </div>
        </div>
    );
}
