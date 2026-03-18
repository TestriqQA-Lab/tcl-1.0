"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function ApplicationsPagination() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;
    const totalItems = 1847;
    const perPage = 10;

    const start = (currentPage - 1) * perPage + 1;
    const end = Math.min(currentPage * perPage, totalItems);

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1, 2, 3);
            if (currentPage > 4) pages.push("...");
            if (currentPage > 3 && currentPage < totalPages - 2) pages.push(currentPage);
            if (currentPage < totalPages - 3) pages.push("...");
            pages.push(totalPages);
        }
        return [...new Set(pages)];
    };

    return (
        <div className="hidden md:flex items-center justify-between py-4">
            <span className="text-xs text-[#94A3B8]">
                Showing {start}-{end} of {totalItems.toLocaleString()} applicants
            </span>

            <div className="flex items-center gap-1.5">
                <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="size-8 flex items-center justify-center rounded-md border border-[#E2E8F0] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={16} className="text-[#64748B]" />
                </button>

                {getPageNumbers().map((page, i) =>
                    typeof page === "string" ? (
                        <span key={`dots-${i}`} className="px-1 text-xs text-[#94A3B8]">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`size-8 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${currentPage === page
                                    ? "bg-[#0f766d] text-white"
                                    : "text-[#64748B] hover:bg-[#F1F5F9]"
                                }`}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="size-8 flex items-center justify-center rounded-md border border-[#E2E8F0] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight size={16} className="text-[#64748B]" />
                </button>
            </div>
        </div>
    );
}
