import React from 'react';
import { Plus, Search, Bell } from 'lucide-react';

const JobPostingsHeader = () => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
            <div className="flex flex-col gap-1">
                <h1 className="text-[#0e1b1a] font-inter text-xl md:text-2xl font-bold tracking-tight">
                    Job Postings
                </h1>
                <p className="text-[#64748B] font-inter text-sm">
                    Manage your active, paused, and closed jobs.
                </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Search */}
                <div className="hidden md:flex items-center gap-2 w-[200px] h-[38px] px-3 bg-white rounded-lg border border-[#E2E8F0]">
                    <Search size={16} className="text-[#94A3B8]" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent text-sm text-[#0e1b1a] placeholder-[#94A3B8] outline-none w-full"
                    />
                </div>

                {/* Notification Bell */}
                <button className="hidden md:flex items-center justify-center size-[38px] rounded-lg border border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors relative bg-white shrink-0">
                    <Bell size={18} className="text-[#64748B]" />
                    <span className="absolute top-2 right-2 size-1.5 bg-[#EF4444] rounded-full"></span>
                </button>

                {/* CTA Button */}
                <button className="flex items-center gap-2 bg-[#0f766d] hover:bg-[#0c5e57] text-white px-4 md:px-5 pb-[1px] h-[38px] rounded-lg transition-colors w-full md:w-auto justify-center">
                    <Plus className="w-4 h-4 text-white" />
                    <span className="font-inter text-sm font-semibold">Post a New Job</span>
                </button>
            </div>
        </div>
    );
};

export default JobPostingsHeader;
