export function HiringProcessSection() {
    const steps = [
        {
            icon: "storefront",
            title: "Create Profile",
            desc: "Build your employer brand presence with a beautiful company page that attracts the right talent.",
            color: "text-[#0f766d]",
            bgColor: "bg-[#0f766d]/10"
        },
        {
            icon: "post_add",
            title: "Post Job",
            desc: "Create detailed job descriptions and reach targeted candidates instantly across our vast network.",
            color: "text-[#0f766d]",
            bgColor: "bg-[#0f766d]/10"
        },
        {
            icon: "group",
            title: "Review Applicants",
            desc: "Filter, rank, and manage your talent pipeline with ease through our intuitive review dashboard.",
            color: "text-[#0f766d]",
            bgColor: "bg-[#0f766d]/10"
        }
    ];

    return (
        <section id="how-it-works" className="bg-[#F8FAFC] py-10 border-y border-slate-100">
            <div className="w-full">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">The 3-Step Hiring Process</h2>
                    <p className="text-lg text-slate-500 font-medium font-inter">Simple, streamlined, and stress-free recruitment.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, idx) => (
                        <div key={idx} className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative">
                            {/* Exact matching icon box from design */}
                            <div className={`w-14 h-14 ${step.bgColor} rounded-2xl flex items-center justify-center text-[#0f766d] mb-8`}>
                                <span className="material-symbols-outlined text-2xl">{step.icon}</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-slate-900">{step.title}</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
