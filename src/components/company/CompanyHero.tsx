import { Company } from '@/data/company-mock';

interface CompanyHeroProps {
    company: Company;
}

export function CompanyHero({ company }: CompanyHeroProps) {
    return (
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 mb-8 md:mb-12">
            <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-6 md:gap-8">
                <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                    {/* Logo Box */}
                    <div className="size-24 md:size-32 rounded-2xl md:rounded-3xl bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden shrink-0">
                        <div className={`w-full h-full flex items-center justify-center ${company.logo_bg}`}>
                            <span className="material-symbols-outlined text-[#0f766d] text-5xl md:text-7xl">
                                {company.logo_icon}
                            </span>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{company.name}</h1>
                        <p className="text-base md:text-lg text-slate-600 font-medium mb-3 md:mb-4">
                            {company.tagline}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-lg">location_on</span>
                                {company.location}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-lg">groups</span>
                                {company.employees}
                            </span>
                            {company.verified && (
                                <span className="flex items-center gap-1.5 text-[#0f766d]">
                                    <span className="material-symbols-outlined text-lg">verified</span>
                                    Verified Profile
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-8 py-3 rounded-full bg-[#0f766d] text-white font-bold hover:bg-[#0e6b63] transition-all cursor-pointer shadow-lg shadow-[#0f766d]/20">
                        Follow
                    </button>
                    <button className="p-3 rounded-full border border-slate-200 text-slate-400 hover:text-slate-600 transition-all cursor-pointer flex items-center justify-center bg-white hover:bg-slate-50">
                        <span className="material-symbols-outlined">share</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
