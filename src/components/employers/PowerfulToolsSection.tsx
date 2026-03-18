import Link from "next/link";
import Image from "next/image";

export function PowerfulToolsSection() {
    const tools = [
        {
            title: "Job Management",
            desc: "Complete control over your listings. Edit, renew, or pause positions with a single click.",
            imgContent: (
                <Image
                    src="/images/employers/tools/job-management.png"
                    alt="Job Management Interface"
                    fill
                    className="object-cover object-top"
                />
            )
        },
        {
            title: "Applicant List",
            desc: "Centralized database for all incoming talent. Track progress through custom hiring stages.",
            imgContent: (
                <Image
                    src="/images/employers/tools/applicant-list.png"
                    alt="Applicant Tracking Interface"
                    fill
                    className="object-cover object-left-top"
                />
            )
        },
        {
            title: "Resume Download",
            desc: "Quickly export candidate data and resumes in PDF format for offline review or sharing.",
            imgContent: (
                <Image
                    src="/images/employers/tools/resume-download.png"
                    alt="Resume Download Interface"
                    fill
                    className="object-cover object-center"
                />
            )
        }
    ];

    return (
        <section className="py-10 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div className="max-w-2xl space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Powerful tools for modern teams</h2>
                    <p className="text-lg text-slate-500 font-medium">Everything you need to manage your hiring cycle from start to finish without leaving the platform.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {tools.map((tool, idx) => (
                    <div key={idx} className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all p-8 flex flex-col">
                        <div className="mb-8 w-full aspect-[4/3] rounded-2xl bg-slate-100 border border-slate-200 relative overflow-hidden flex-shrink-0">
                            {tool.imgContent}
                        </div>
                        <h4 className="text-xl font-bold mb-3 text-slate-900">{tool.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed font-medium">{tool.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
