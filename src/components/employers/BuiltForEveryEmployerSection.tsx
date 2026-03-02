import Link from "next/link";

export function BuiltForEveryEmployerSection() {
    const types = [
        {
            icon: "business_center",
            title: "Professionals",
            desc: "For small teams looking to hire dedicated developers, designers, writers, and marketers.",
            color: "text-[#0f766d]",
            bgColor: "bg-[#0f766d]/10"
        },
        {
            icon: "rocket_launch",
            title: "Startups & SMBs",
            desc: "Fast-growing companies that need to scale their headcount quickly with pre-vetted talent.",
            color: "text-blue-600",
            bgColor: "bg-blue-600/10"
        },
        {
            icon: "groups",
            title: "Staffing Agencies",
            desc: "Agencies that need powerful tools to manage multiple clients and high-volume applicant pipelines.",
            color: "text-purple-600",
            bgColor: "bg-purple-600/10"
        }
    ];

    return (
        <section className="md:bg-[#F4F7F9] py-10 md:px-10">
            <div className="w-full">
                <div className="mb-16 text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Built for Every Kind of Employer</h2>
                    <p className="text-lg text-slate-500 font-medium">A unified platform that adapts to your hiring needs, no matter your size.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {types.map((type, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col hover:-translate-y-1 transition-transform duration-300">
                            <div className={`w-12 h-12 ${type.bgColor} rounded-2xl flex items-center justify-center ${type.color} mb-6`}>
                                <span className="material-symbols-outlined">{type.icon}</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900">{type.title}</h3>
                            <p className="text-slate-500 leading-relaxed font-medium text-sm mb-8 flex-1">{type.desc}</p>
                            <Link href="#" className={`text-sm font-bold ${type.color} flex items-center gap-1 hover:gap-2 transition-all`}>
                                Learn More <span className="material-symbols-outlined text-[1rem]">arrow_forward</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
