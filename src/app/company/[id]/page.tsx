"use client";

import { CompanyHero } from "@/components/company/CompanyHero";
import { AboutSection } from "@/components/company/AboutSection";
import { CultureGrid } from "@/components/company/CultureGrid";
import { OpenRolesList } from "@/components/company/OpenRolesList";
import { PerksSection } from "@/components/company/PerksSection";
import { LocationSection } from "@/components/company/LocationSection";
import { StatsSection } from "@/components/company/StatsSection";
import { COMPANY_DATA } from "@/data/company-mock";
import { use } from "react";

export default function CompanyProfilePage({ params }: { params: Promise<{ id: string }> }) {
    // In a real app, we would fetch data based on the ID.
    // For now, we use the mock data directly.
    const { id } = use(params);
    const company = COMPANY_DATA;

    return (
        <main className="max-w-[1240px] mx-auto py-10">
            {/* Hero Section */}
            <CompanyHero company={company} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-12">
                {/* 
                    Mobile Order: About -> Culture -> Perks -> HQ -> Stats -> Roles 
                    Desktop Order: 
                        Left (Span 8): About, Culture, Roles
                        Right (Span 4): Perks, HQ, Stats
                */}

                {/* About Section */}
                {/* Desktop: Col 1-8, Row 1 */}
                <div className="lg:col-span-8 lg:col-start-1 lg:row-start-1">
                    <AboutSection company={company} />
                </div>

                {/* Culture Section */}
                {/* Desktop: Col 1-8, Row 2 */}
                <div className="lg:col-span-8 lg:col-start-1 lg:row-start-2">
                    <CultureGrid company={company} />
                </div>

                {/* Perks Section */}
                {/* Desktop: Col 9-12, Row 1 */}
                <div className="lg:col-span-4 lg:col-start-9 lg:row-start-1">
                    <PerksSection company={company} />
                </div>

                {/* Location Section */}
                {/* Desktop: Col 9-12, Row 2 */}
                <div className="lg:col-span-4 lg:col-start-9 lg:row-start-2">
                    <LocationSection company={company} />
                </div>

                {/* Stats Section -- Placed after HQ on mobile */}
                {/* Desktop: Col 9-12, Row 3 */}
                <div className="lg:col-span-4 lg:col-start-9 lg:row-start-3">
                    <StatsSection company={company} />
                </div>

                {/* Open Roles Section */}
                {/* Desktop: Col 1-8, Row 3 */}
                <div className="lg:col-span-8 lg:col-start-1 lg:row-start-3">
                    <OpenRolesList company={company} />
                </div>
            </div>
        </main>
    );
}
