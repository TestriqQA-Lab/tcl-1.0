"use client";

import { SlidersHorizontal, Download, Search } from "lucide-react";

export function ApplicationsMobileHeader() {
    return (
        <div className="lg:hidden px-4 md:px-6 pt-5 pb-3">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <h1 className="text-lg md:text-xl font-bold text-[#0e1b1a]">
                        Applications
                    </h1>
                    <span className="px-2.5 py-0.5 bg-[#0f766d]/8 text-[#0f766d] text-[11px] font-semibold rounded-full">
                        1,847
                    </span>
                </div>
                {/* Filter + Export for tablet/mobile */}
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 h-8 md:h-9 px-3 bg-white rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFB] transition-colors">
                        <SlidersHorizontal size={14} className="text-[#64748B]" />
                        <span className="text-[12px] font-medium text-[#64748B]">Filters</span>
                    </button>
                    <button className="flex items-center gap-1.5 h-8 md:h-9 px-3 bg-white rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFB] transition-colors">
                        <Download size={14} className="text-[#64748B]" />
                        <span className="text-[12px] font-medium text-[#64748B]">Export</span>
                    </button>
                </div>
            </div>
            {/* Search Bar */}
            <div className="flex items-center gap-2 h-10 px-3 bg-[#F1F5F9] rounded-lg border border-[#E2E8F0]">
                <Search size={16} className="text-[#94A3B8] shrink-0" />
                <input
                    type="text"
                    placeholder="Search applicants..."
                    className="bg-transparent text-[13px] text-[#0e1b1a] placeholder-[#94A3B8] outline-none w-full"
                />
            </div>
        </div>
    );
}
