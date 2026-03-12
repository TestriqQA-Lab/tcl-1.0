import React from "react";
import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Admin Dashboard | TopCareerLive",
    description: "Overview of system activity and user profiles on the platform.",
};

export default function AdminDashboardPage() {
    return (
        <div className="w-full h-full p-5 md:p-8 lg:p-14 bg-[#F9FAFB] flex flex-col gap-6 md:gap-8 lg:gap-10">
            {/* --- Header Section --- */}
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl md:text-[28px] lg:text-[30px] font-bold text-[#111827] font-inter">
                    Admin Dashboard
                </h1>
                <p className="text-sm md:text-[15px] lg:text-base text-[#6B7280] font-normal font-inter">
                    Overview of system activity and user profiles on the platform.
                </p>
            </div>

            {/* --- Cards Section --- */}
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-6 w-full">
                
                {/* Card 1: Employer Profiles */}
                <Link href="/admin-dashboard/employers-profile" className="bg-white rounded-xl p-5 md:p-6 flex flex-col gap-3 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer">
                    <p className="text-[#6B7280] text-sm font-medium font-inter">Employer Profiles</p>
                    <div className="flex flex-col gap-1">
                        <span className="text-[#111827] text-2xl md:text-3xl font-bold font-inter tracking-tight">1,245</span>
                        <span className="text-[#10B981] text-xs font-semibold font-inter">+12% this month</span>
                    </div>
                </Link>

                {/* Card 2: Seeker Profiles */}
                <Link href="/admin-dashboard/seekers-profile" className="bg-white rounded-xl p-5 md:p-6 flex flex-col gap-3 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer">
                    <p className="text-[#6B7280] text-sm font-medium font-inter">Seeker Profiles</p>
                    <div className="flex flex-col gap-1">
                        <span className="text-[#111827] text-2xl md:text-3xl font-bold font-inter tracking-tight">8,430</span>
                        <span className="text-[#10B981] text-xs font-semibold font-inter">+5% this month</span>
                    </div>
                </Link>

                {/* Card 3: Job Postings */}
                <Link href="/admin-dashboard/jobs" className="bg-white rounded-xl p-5 md:p-6 flex flex-col gap-3 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer">
                    <p className="text-[#6B7280] text-sm font-medium font-inter">Job Postings</p>
                    <div className="flex flex-col gap-1">
                        <span className="text-[#111827] text-2xl md:text-3xl font-bold font-inter tracking-tight">3,150</span>
                        <span className="text-[#10B981] text-xs font-semibold font-inter">+8% this month</span>
                    </div>
                </Link>
                
            </div>
        </div>
    );
}
