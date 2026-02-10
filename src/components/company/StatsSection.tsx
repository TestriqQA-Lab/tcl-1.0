import { Company } from '@/data/company-mock';

interface StatsSectionProps {
    company: Company;
}

export function StatsSection({ company }: StatsSectionProps) {
    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-500 text-xl">language</span>
                </div>
                <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Website</p>
                    <a href={`https://${company.website}`} className="text-sm font-medium text-[#0f766d] hover:underline">
                        {company.website}
                    </a>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-500 text-xl">calendar_today</span>
                </div>
                <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Founded</p>
                    <p className="text-sm font-medium text-slate-700">{company.founded}</p>
                </div>
            </div>
        </div>
    );
}
