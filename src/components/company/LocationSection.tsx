import { Company } from '@/data/company-mock';

interface LocationSectionProps {
    company: Company;
}

export function LocationSection({ company }: LocationSectionProps) {
    return (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0f766d]">business_chip</span>
                Company Snapshot
            </h3>
            
            <div className="space-y-5">
                <div className="flex gap-4">
                    <div className="size-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-slate-500 text-[20px]">domain</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900 mb-0.5">Primary Sector</p>
                        <p className="text-sm text-slate-500">
                            {company.tagline && company.tagline.includes(" in ") 
                                ? company.tagline.split(" in ")[0] 
                                : (company.tagline || "Technology & Services")}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="size-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-slate-500 text-[20px]">public</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900 mb-0.5">Global Presence</p>
                        <p className="text-sm text-slate-500">{company.location || "Global Regions"}</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="size-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-slate-500 text-[20px]">groups</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900 mb-0.5">Company Size</p>
                        <p className="text-sm text-slate-500">{company.employees || "N/A"}</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="size-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#0f766d] text-[20px]">bolt</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[#0f766d] mb-0.5">Hiring Activity</p>
                        <p className="text-sm text-[#0f766d]/80 font-medium">Actively recruiting ({company.roles?.length || 0} open roles)</p>
                    </div>
                </div>
            </div>
            
            {company.verified && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                    <div className="bg-[#0f766d]/[0.03] border border-[#0f766d]/10 rounded-2xl p-4 flex items-start gap-3 shadow-inner">
                        <span className="material-symbols-outlined text-[#0f766d] mt-0.5">verified_user</span>
                        <div>
                            <p className="text-sm font-bold text-[#0f766d]">Verified Employer</p>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">This company profile and its associated jobs have been officially verified by our trust and safety team.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
