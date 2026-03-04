"use client";

import Link from "next/link";

const tabs = [
    { label: "Dashboard", href: "/employer-dashboard" },
    { label: "Applications", href: "/employer-applications" },
    { label: "Jobs", href: "/employer-dashboard/job-postings" },
    { label: "Search", href: "/employer-dashboard/database-search" },
    { label: "Blogs", href: "/employer-dashboard/blogs" },
    { label: "Analytics", href: "/employer-dashboard/analytics" },
];

interface TabletNavStripProps {
    activePage?: string;
}

export function TabletNavStrip({
    activePage = "Dashboard",
}: TabletNavStripProps) {
    return (
        <div className="hidden md:flex lg:hidden items-center w-full h-12 px-6 bg-white border-b border-[#E2E8F0] overflow-x-auto">
            {tabs.map((tab) => {
                const isActive = tab.label === activePage;
                return (
                    <Link
                        key={tab.label}
                        href={tab.href}
                        className={`flex items-center h-full px-3.5 text-[13px] transition-colors shrink-0 ${isActive
                            ? "text-[#0f766d] font-semibold border-b-2 border-[#0f766d]"
                            : "text-[#64748B] hover:text-[#334155]"
                            }`}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </div>
    );
}
