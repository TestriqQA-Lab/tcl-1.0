"use client";

import { useState } from "react";

const filters = [
    { label: "All", count: "1,847" },
    { label: "Shortlisted", count: "516" },
    { label: "In Review", count: "146" },
    { label: "Interview", count: "104" },
    { label: "Rejected", count: "416" },
];

interface StatusFilterTabsProps {
    onFilterChange?: (filter: string) => void;
}

export function StatusFilterTabs({ onFilterChange }: StatusFilterTabsProps) {
    const [active, setActive] = useState("All");

    const handleClick = (label: string) => {
        setActive(label);
        onFilterChange?.(label);
    };

    return (
        <div className="flex items-center w-full overflow-x-auto border-b border-[#E2E8F0] scrollbar-none">
            {filters.map((f) => {
                const isActive = f.label === active;
                return (
                    <button
                        key={f.label}
                        onClick={() => handleClick(f.label)}
                        className={`flex items-center gap-2 h-10 px-4 md:px-[18px] shrink-0 text-[13px] transition-colors border-b-2 ${isActive
                                ? "text-[#0f766d] font-semibold border-[#0f766d]"
                                : "text-[#64748B] font-normal border-transparent hover:text-[#334155]"
                            }`}
                    >
                        {f.label}
                        <span
                            className={`px-2 py-0.5 text-[11px] font-medium rounded-[10px] ${isActive
                                    ? "bg-[#0f766d] text-white"
                                    : "bg-[#F1F5F9] text-[#64748B]"
                                }`}
                        >
                            {f.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
