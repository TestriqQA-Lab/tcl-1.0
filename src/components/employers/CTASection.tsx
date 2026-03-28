import Link from "next/link";

export function CTASection() {
    return (
        <section className="py-10 w-full">
            <div className="bg-[#0f766d] rounded-[3rem] p-12 md:p-24 text-center text-white relative flex flex-col items-center justify-center overflow-hidden">
                {/* Background Watermark exactly like image */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <span className="material-symbols-outlined text-[400px]">work</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10 tracking-tight">
                    Ready to find your next great hire?
                </h2>
                <p className="text-white/90 text-xl mb-12 max-w-xl mx-auto relative z-10 font-medium">
                    Join thousands of companies scaling their teams with TopCareerLive.
                </p>
                <div className="flex flex-wrap justify-center gap-4 relative z-10">
                    <Link href="/employers/client-registration" className="bg-white text-[#0f766d] hover:bg-slate-50 md:px-10 px-4 py-5 rounded-xl text-lg font-bold shadow-xl transition-all">
                        Get Started Now
                    </Link>
                </div>
            </div>
        </section>
    );
}
