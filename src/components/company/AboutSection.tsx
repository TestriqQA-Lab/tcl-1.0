import { Company } from '@/data/company-mock';

interface AboutSectionProps {
    company: Company;
}

export function AboutSection({ company }: AboutSectionProps) {
    return (
        <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">About {company.name}</h2>
            <div className="prose prose-slate max-w-none">
                {company.about.map((paragraph, index) => (
                    <p key={index} className="text-slate-600 leading-relaxed text-lg mb-4">
                        {paragraph}
                    </p>
                ))}
            </div>
        </section>
    );
}
