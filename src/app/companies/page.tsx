import { Suspense } from "react";
import { Metadata } from "next";
import { CompaniesHero } from "@/components/companies/CompaniesHero";
import { FeaturedCompanies } from "@/components/companies/FeaturedCompanies";
import { IndustryCategories } from "@/components/companies/IndustryCategories";
import { CompaniesContent } from "@/components/companies/CompaniesContent";
import {
    getCompanies,
    getCompanyStats,
    getFeaturedCompanies,
    getDistinctIndustries,
    getDistinctLocations,
} from "@/actions/company.actions";

export const metadata: Metadata = {
    title: "Explore Companies | TopCareerLive",
    description:
        "Discover top employers, explore company cultures, and find your dream workplace. Browse companies by industry, location, and size on TopCareerLive.",
};

interface CompaniesPageProps {
    searchParams: Promise<{
        search?: string;
        industry?: string;
        location?: string;
        companySize?: string;
        page?: string;
    }>;
}

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
    const params = await searchParams;

    const page = parseInt(params.page || "1", 10);

    // Fetch data in parallel
    const [companiesResult, stats, featured, industries, locations] = await Promise.all([
        getCompanies({
            search: params.search,
            industry: params.industry,
            location: params.location,
            companySize: params.companySize,
            page,
            pageSize: 12,
        }),
        getCompanyStats(),
        getFeaturedCompanies(),
        getDistinctIndustries(),
        getDistinctLocations(),
    ]);

    return (
        <div className="py-6 md:py-8">
            {/* Hero with Search */}
            <Suspense fallback={<div className="h-80 bg-gray-100 rounded-2xl animate-pulse mb-8" />}>
                <CompaniesHero stats={stats} />
            </Suspense>

            {/* Featured Companies */}
            <Suspense fallback={<div className="h-48 bg-gray-50 rounded-xl animate-pulse mb-8" />}>
                <FeaturedCompanies companies={featured} />
            </Suspense>

            {/* Industry Categories */}
            <Suspense fallback={<div className="h-24 bg-gray-50 rounded-xl animate-pulse mb-8" />}>
                <IndustryCategories />
            </Suspense>

            {/* Main Content: Filters + Grid */}
            <Suspense fallback={<CompaniesLoadingSkeleton />}>
                <CompaniesContent
                    companies={companiesResult.companies}
                    totalPages={companiesResult.totalPages}
                    currentPage={companiesResult.page}
                    totalCount={companiesResult.totalCount}
                    industries={industries}
                    locations={locations}
                />
            </Suspense>
        </div>
    );
}

function CompaniesLoadingSkeleton() {
    return (
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
            <div className="hidden lg:block w-[280px] shrink-0">
                <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-56 bg-gray-100 rounded-xl animate-pulse" />
                ))}
            </div>
        </div>
    );
}
