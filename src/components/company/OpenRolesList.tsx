import { Company } from '@/data/company-mock';

interface OpenRolesListProps {
    company: Company;
}

export function OpenRolesList({ company }: OpenRolesListProps) {
    return (
        <section>
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Open Roles</h2>
                <span className="text-[#0f766d] text-sm font-semibold">{company.roles.length} active</span>
            </div>
            <div className="space-y-4">
                {company.roles.map((role) => (
                    <div key={role.id} className="bg-white p-5 rounded-full md:rounded-xl border border-slate-100 hover:border-[#0f766d]/50 transition-all flex items-center justify-between cursor-pointer group shadow-sm hover:shadow-md">
                        <div>
                            <h4 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-[#0f766d] transition-colors line-clamp-1">{role.title}</h4>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                <span className="px-2.5 py-0.5 bg-[#0f766d]/10 text-[#0f766d] text-[10px] md:text-xs font-bold rounded-full">{role.type}</span>
                                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] md:text-xs font-bold rounded-full">{role.location}</span>
                                <span className="px-2.5 py-0.5 text-slate-400 text-[10px] md:text-xs font-medium flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">schedule</span> {role.posted_at}
                                </span>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-slate-300 group-hover:text-[#0f766d] group-hover:translate-x-1 transition-all pl-2">arrow_forward</span>
                    </div>
                ))}
            </div>
            {/* Sticky/Prominent Mobile Button */}
            <div className="mt-8 md:mt-6">
                <button className="w-full py-4 bg-[#0f766d] text-white font-bold text-lg md:rounded-2xl rounded-full shadow-xl shadow-[#0f766d]/20 hover:bg-[#0e6b63] transition-all cursor-pointer">
                    View Open Jobs
                </button>
            </div>
        </section>
    );
}
