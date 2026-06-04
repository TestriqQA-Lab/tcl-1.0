import { CompanyHero } from "@/components/company/CompanyHero";
import { AboutSection } from "@/components/company/AboutSection";
import { CultureGrid } from "@/components/company/CultureGrid";
import { OpenRolesList } from "@/components/company/OpenRolesList";
import { PerksSection } from "@/components/company/PerksSection";
import { LocationSection } from "@/components/company/LocationSection";
import { StatsSection } from "@/components/company/StatsSection";
import { getCompanyProfileById } from "@/actions/company.actions";
import Link from "next/link";

export default async function CompanyProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    // Fetch real data from the database
    const company = await getCompanyProfileById(id);

    if (!company) {
        return (
            <main className="max-w-[1240px] mx-auto py-20 px-6 text-center">
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-12 max-w-2xl mx-auto shadow-sm text-center flex flex-col items-center">
                    <span className="material-symbols-outlined text-6xl text-slate-300 mb-6">domain_disabled</span>
                    <h1 className="text-3xl font-bold text-slate-800 mb-4">Company Not Found</h1>
                    <p className="text-slate-500 mb-8 text-lg">
                        We couldn't find the company profile you're looking for. It may have been removed or the URL is incorrect.
                    </p>
                    <Link href="/companies" className="inline-flex items-center gap-2 bg-[#0f766d] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#0a5f57] transition-colors shadow-md shadow-[#0f766d]/10">
                        <span className="material-symbols-outlined">arrow_back</span>
                        Back to Companies
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-[1240px] mx-auto py-10 px-4 sm:px-6">
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
                <div className="lg:col-span-8 lg:col-start-1 lg:row-start-1">
                    <AboutSection company={company} />
                </div>

                {/* Culture Section */}
                <div className="lg:col-span-8 lg:col-start-1 lg:row-start-2">
                    <CultureGrid company={company} />
                </div>

                {/* Perks Section */}
                <div className="lg:col-span-4 lg:col-start-9 lg:row-start-1">
                    <PerksSection company={company} />
                </div>

                {/* Location Section */}
                <div className="lg:col-span-4 lg:col-start-9 lg:row-start-2">
                    <LocationSection company={company} />
                </div>

                {/* Stats Section */}
                <div className="lg:col-span-4 lg:col-start-9 lg:row-start-3">
                    <StatsSection company={company} />
                </div>

                {/* Open Roles Section */}
                <div className="lg:col-span-8 lg:col-start-1 lg:row-start-3">
                    <OpenRolesList company={company} />
                </div>
            </div>
        </main>
    );
}
