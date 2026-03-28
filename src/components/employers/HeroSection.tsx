import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export function HeroSection() {
    return (
        <section className="w-full grid md:grid-cols-12 py-10 gap-16 lg:items-center">
            {/* Left Column: Copy */}
            <div className="flex flex-col gap-6 max-w-3xl md:col-span-6 lg:col-span-7 xl:col-span-8">
                <span className="flex items-center gap-2 text-[#0f766d] font-bold tracking-widest text-xs uppercase bg-[#0f766d]/10 w-fit px-3 py-1.5 rounded-full">
                    <CheckCircle2 className="w-4 h-4 fill-[#0f766d] text-white" />
                    For Forward-Thinking Teams
                </span>
                <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-slate-900">
                    Post jobs.
                    Review applicants.<br />
                    Hire faster.
                </h1>
                <p className="text-lg text-slate-500 leading-relaxed font-medium max-w-2xl">
                    TopCareerLive provides an end-to-end recruitment ecosystem designed for modern enterprises to source, evaluate, and onboard elite talent seamlessly.
                </p>

                {/* Professional Value Props */}
                <div className="flex flex-col gap-3 mt-2 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-1.5 rounded-full flex shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-slate-700 font-semibold">Access a curated pool of 5M+ verified professionals.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-1.5 rounded-full flex shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-slate-700 font-semibold">Reduce time-to-hire by 40% with smart applicant tracking.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-1.5 rounded-full flex shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-slate-700 font-semibold">Seamless ATS integrations with Workday, Greenhouse & more.</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                    <Link
                        href="/employers/client-registration"
                        className="w-full sm:w-auto bg-[#2563eb] hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-blue-500/20 transition-all text-center active:scale-[0.98]"
                    >
                        Get Started Now
                    </Link>
                    <div className="flex items-center gap-4 text-sm font-semibold text-slate-500 mt-4 sm:mt-0">
                        <div className="flex -space-x-3">
                            {/* Updated custom AI avatars */}
                            <div className="w-10 h-10 rounded-full border-[3px] border-white bg-slate-200 relative overflow-hidden shadow-sm">
                                <Image
                                    src="/images/avatar-1.png"
                                    alt="HR Professional 1"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="w-10 h-10 rounded-full border-[3px] border-white bg-slate-200 relative overflow-hidden shadow-sm">
                                <Image
                                    src="/images/avatar-2.png"
                                    alt="HR Professional 2"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="w-10 h-10 rounded-full border-[3px] border-white bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-600 shadow-sm z-10">
                                500+
                            </div>
                        </div>
                        <span className="leading-tight">Trusted by 500+ top companies</span>
                    </div>
                </div>
            </div>

            {/* Right Column: Form Card (Restored) */}
            <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto md:col-span-6 lg:col-span-5 xl:col-span-4">
                <div className="bg-white p-8 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100">
                    <h3 className="text-2xl font-bold mb-2">Start Hiring Today</h3>
                    <p className="text-slate-500 text-sm mb-8 font-medium">Reach millions of top talent instantly.</p>

                    <form className="flex flex-col gap-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Company Name</label>
                            <input
                                type="text"
                                placeholder="Acme Corp"
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f766d]/20 focus:border-[#0f766d] transition-all font-medium placeholder:text-slate-400"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Work Email</label>
                            <input
                                type="email"
                                placeholder="you@company.com"
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f766d]/20 focus:border-[#0f766d] transition-all font-medium placeholder:text-slate-400"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                            <input
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f766d]/20 focus:border-[#0f766d] transition-all font-medium placeholder:text-slate-400"
                            />
                        </div>
                        <Link
                            href="/employers/client-registration"
                            className="block w-full text-center bg-[#0f766d] hover:bg-[#0d635c] text-white py-4 rounded-xl font-semibold mt-2 shadow-lg shadow-[#0f766d]/30 transition-all active:scale-[0.98]"
                        >
                            Create Employer Account
                        </Link>
                        <p className="text-xs text-center text-slate-500 font-medium mt-2">
                            By registering you agree to our <Link href="#" className="underline hover:text-slate-800">Terms</Link> & <Link href="#" className="underline hover:text-slate-800">Conditions</Link>.
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
}
