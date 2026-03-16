import React from "react";
import { type Metadata } from "next";
import Link from "next/link";

import DashboardOverviewContent from "@/components/admin-dashboard/DashboardOverviewContent";

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
            <DashboardOverviewContent />
        </div>
    );
}
