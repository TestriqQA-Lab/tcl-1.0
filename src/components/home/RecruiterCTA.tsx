import { PLATFORM_STATS } from "@/data/mock-data";

export function RecruiterCTA() {
    return (
        <section className="py-24">
            <div className="bg-[#0f766d] rounded-3xl p-10 lg:p-20 relative overflow-hidden shadow-2xl">
                {/* Abstract Pattern Overlays */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight font-heading">
                            Looking to hire top global talent?
                        </h2>
                        <p className="text-white/80 text-lg leading-relaxed">
                            Join over 10,000+ companies hiring on TopCareerLive. Get access to a vetted pool of professionals and streamline your recruitment process.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <button className="bg-white text-[#0f766d] font-bold px-8 py-4 rounded-xl hover:shadow-xl transition-all">
                                Post a Job for Free
                            </button>
                            <button className="bg-transparent text-white border-2 border-white/30 font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all">
                                Contact Sales
                            </button>
                        </div>
                    </div>

                    <div className="hidden lg:flex justify-end">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-white w-48">
                                <p className="text-3xl font-black">{PLATFORM_STATS.activeCandidates}</p>
                                <p className="text-xs uppercase font-bold opacity-70">Active Candidates</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-white w-48 mt-8">
                                <p className="text-3xl font-black">{PLATFORM_STATS.companiesHiring}</p>
                                <p className="text-xs uppercase font-bold opacity-70">New Resumes Daily</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
