"use client";

import { Company } from '@/data/company-mock';

interface CompanyHeroProps {
    company: Company;
}

export function CompanyHero({ company }: CompanyHeroProps) {
    const handleScrollToRoles = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const element = document.getElementById("open-roles");
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 100; // Offset for navbar
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 mb-8 md:mb-12">
            <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-6 md:gap-8">
                <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                    {/* Logo Box */}
                    <div className="relative shrink-0">
                        <div className="size-24 md:size-32 rounded-2xl md:rounded-3xl bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden shadow-sm bg-white">
                            {company.logo_url ? (
                                <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain p-2 md:p-4" />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center ${company.logo_bg}`}>
                                    <span className="material-symbols-outlined text-[#0f766d] text-5xl md:text-7xl">
                                        {company.logo_icon}
                                    </span>
                                </div>
                            )}
                        </div>
                        {company.verified && (
                            <div className="absolute -bottom-2 -right-2 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-50 z-10 p-0.5">
                                <span className="material-symbols-outlined text-[#0f766d]" style={{ fontSize: "24px", fontVariationSettings: "'FILL' 1" }} title="Verified Employer">verified</span>
                            </div>
                        )}
                    </div>

                    {/* Text Content */}
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{company.name}</h1>
                            {company.verified && (
                                <span className="material-symbols-outlined text-[#0f766d]" style={{ fontSize: "28px", fontVariationSettings: "'FILL' 1" }} title="Verified Employer">verified</span>
                            )}
                        </div>
                        <p className="text-base md:text-lg text-slate-600 font-medium mb-3 md:mb-4 mt-0.5">
                            {company.tagline}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-slate-600 font-medium">
                                <span className="material-symbols-outlined text-slate-400 text-lg">location_on</span>
                                {company.location}
                            </span>
                            <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-slate-600 font-medium">
                                <span className="material-symbols-outlined text-slate-400 text-lg">groups</span>
                                {company.employees}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-6 md:mt-0">
                    {company.roles && company.roles.length > 0 ? (
                        <button
                            onClick={handleScrollToRoles}
                            className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-[#0f766d] text-white font-bold hover:bg-[#0e6b63] transition-all cursor-pointer shadow-md shadow-[#0f766d]/20 text-center flex items-center justify-center gap-2"
                        >
                            View Open Roles
                            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full border border-white/20">{company.roles.length}</span>
                        </button>
                    ) : (
                        <div className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-slate-100 text-slate-400 font-bold text-center flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200">
                            No Open Roles
                        </div>
                    )}

                    {company.website && company.website !== "#" && (
                        <a 
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:text-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2 bg-white hover:bg-slate-50 shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[#0f766d]" style={{ fontSize: "20px" }}>language</span>
                            Visit Website
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}
