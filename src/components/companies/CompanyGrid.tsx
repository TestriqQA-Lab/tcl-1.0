"use client";

import { CompanyCard } from "./CompanyCard";
import type { CompanyListItem } from "@/actions/company.actions";
import { useRouter, useSearchParams } from "next/navigation";

interface CompanyGridProps {
    companies: CompanyListItem[];
    totalPages: number;
    currentPage: number;
}

export function CompanyGrid({ companies, totalPages, currentPage }: CompanyGridProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`/companies?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (companies.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-5">
                    <span className="material-symbols-outlined text-gray-300" style={{ fontSize: "36px" }}>
                        corporate_fare
                    </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                    No companies found
                </h3>
                <p className="text-sm md:text-base text-gray-500 max-w-sm mb-5">
                    Try adjusting your search or filters to discover more companies.
                </p>
                <button
                    onClick={() => router.push("/companies")}
                    className="text-sm font-semibold text-[#0f766d] bg-[#0f766d]/10 px-5 py-2.5 rounded-xl hover:bg-[#0f766d]/20 transition-colors cursor-pointer"
                >
                    Clear all filters
                </button>
            </div>
        );
    }

    return (
        <div>
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                {companies.map((company, index) => (
                    <CompanyCard key={company.id} company={company} index={index} />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8 md:mt-10">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_left</span>
                        Prev
                    </button>

                    <div className="flex items-center gap-1">
                        {generatePagination(currentPage, totalPages).map((p, i) =>
                            p === "..." ? (
                                <span key={`dots-${i}`} className="px-2 text-sm text-gray-400">…</span>
                            ) : (
                                <button
                                    key={p}
                                    onClick={() => goToPage(p as number)}
                                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                                        currentPage === p
                                            ? "bg-[#0f766d] text-white shadow-sm"
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    {p}
                                </button>
                            )
                        )}
                    </div>

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                        Next
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_right</span>
                    </button>
                </div>
            )}
        </div>
    );
}

function generatePagination(current: number, total: number): (number | string)[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: (number | string)[] = [];
    pages.push(1);

    if (current > 3) pages.push("...");

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 2) pages.push("...");

    pages.push(total);
    return pages;
}
