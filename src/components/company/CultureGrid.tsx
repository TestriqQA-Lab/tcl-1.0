import { Company } from '@/data/company-mock';

interface CultureGridProps {
    company: Company;
}

export function CultureGrid({ company }: CultureGridProps) {
    return (
        <section className="w-full overflow-hidden">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 md:mb-8">Culture Highlights</h2>

            {/* Mobile: Horizontal Scroll (Snap), Desktop: Grid */}
            <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-2">
                {company.culture.map((item, index) => (
                    <div
                        key={index}
                        className="min-w-[280px] w-[85vw] md:w-auto md:min-w-0 snap-center bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex-shrink-0"
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${item.icon_bg} ${item.icon_color}`}>
                            <span className="material-symbols-outlined">{item.icon}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
