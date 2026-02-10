import { Company } from '@/data/company-mock';

interface CompanySidebarProps {
    company: Company;
}

export function CompanySidebar({ company }: CompanySidebarProps) {
    return (
        <div className="space-y-8">
            {/* Perks Section */}
            <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Perks & Benefits</h3>
                <div className="flex flex-wrap gap-2">
                    {company.perks.map((perk, index) => (
                        <span
                            key={index}
                            className={`px-4 py-2 text-sm font-semibold rounded-full ${perk.bg} ${perk.text} ${perk.border ? `border ${perk.border}` : ''}`}
                        >
                            {perk.label}
                        </span>
                    ))}
                </div>
            </div>

            {/* Office Location */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="h-48 bg-slate-200 relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0f766d]/10 to-[#0f766d]/30 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#0f766d] text-4xl opacity-50 group-hover:scale-110 transition-transform">map</span>
                    </div>
                    <img
                        src={company.headquarters.map_image}
                        alt={company.headquarters.map_alt}
                        className="w-full h-full object-cover mix-blend-multiply opacity-60"
                        data-location={company.location}
                    />
                </div>
                <div className="p-6">
                    <h3 className="font-bold text-slate-900 mb-2">Headquarters</h3>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                        {company.headquarters.address.map((line, i) => (
                            <span key={i} className="block">{line}</span>
                        ))}
                    </p>
                    <button className="w-full py-2 bg-slate-50 text-slate-700 text-sm font-bold rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
                        Get Directions
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
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
        </div>
    );
}
