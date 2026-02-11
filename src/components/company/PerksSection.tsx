import { Company } from '@/data/company-mock';

interface PerksSectionProps {
    company: Company;
}

export function PerksSection({ company }: PerksSectionProps) {
    return (
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
    );
}
