import { Company } from '@/data/company-mock';

interface LocationSectionProps {
    company: Company;
}

export function LocationSection({ company }: LocationSectionProps) {
    return (
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
    );
}
