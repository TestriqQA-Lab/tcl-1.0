"use client";

import { CompanyFilters } from "./CompanyFilters";
import { CompanyGrid } from "./CompanyGrid";
import type { CompanyListItem } from "@/actions/company.actions";

interface CompaniesContentProps {
    companies: CompanyListItem[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
    industries: string[];
    locations: string[];
}

export function CompaniesContent({
    companies,
    totalPages,
    currentPage,
    totalCount,
    industries,
    locations,
}: CompaniesContentProps) {
    return (
        <section className="mb-12">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-5 md:mb-6">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-600" style={{ fontSize: "18px" }}>domain</span>
                </div>
                <h2 className="text-base md:text-lg font-bold text-gray-900">All Companies</h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Filters */}
                <CompanyFilters
                    industries={industries}
                    locations={locations}
                    totalResults={totalCount}
                />

                {/* Main Grid */}
                <div className="flex-1 min-w-0">
                    <CompanyGrid
                        companies={companies}
                        totalPages={totalPages}
                        currentPage={currentPage}
                    />
                </div>
            </div>
        </section>
    );
}
