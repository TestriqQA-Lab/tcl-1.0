import Link from "next/link";
import { QrCode, Star, ArrowRight, ShieldCheck, Zap, UserCheck } from "lucide-react";

export function RecruiterCTA() {
    return (
        <section className="py-12 bg-white flex justify-center px-4 md:px-6">
            <div className="w-full max-w-[1280px] bg-gradient-to-br from-[#f8faff] to-[#f0f5ff] rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden border border-blue-100 flex flex-col lg:flex-row items-center justify-between gap-12">

                {/* Left Side: Headlines & Input Capture */}
                <div className="flex-1 max-w-xl relative z-10">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#0a1a3a] leading-[1.15] mb-4">
                        Build your dream team <br className="hidden md:block" />
                        with <span className="text-[#0f766d]">unmatched speed.</span>
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 max-w-md">
                        Access a curated pool of verified professionals. Start receiving high-quality applications within 24 hours.
                    </p>

                    {/* Email Capture Input */}
                    <div className="flex bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-2 max-w-md border border-gray-100 mb-6 relative overflow-hidden focus-within:ring-2 focus-within:ring-[#0f766d] focus-within:border-transparent transition-all">
                        <input
                            type="email"
                            placeholder="Enter work email..."
                            className="flex-1 outline-none px-4 text-gray-700 bg-transparent placeholder-gray-400"
                        />
                        <Link
                            href="/employer-dashboard/post-job"
                            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-3 px-8 rounded-full transition-colors flex items-center gap-2"
                        >
                            Get Started
                        </Link>
                    </div>

                </div>

                {/* Right Side: Mockup Layout */}
                <div className="relative w-full lg:w-[450px] min-h-[400px] flex justify-center items-center z-10 shrink-0">

                    {/* Character Illustration (from standard Unsplash graphics or drawn) 
                        Since we can't easily inline vector characters, we'll use a neat glassmorphic "Mobile Frame" 
                        which gives the exact same structural vibe as the reference! 
                    */}
                    <div className="relative w-[280px] h-[480px] bg-white rounded-[3rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden shrink-0 transform translate-x-12 translate-y-12 lg:translate-y-0">
                        {/* Notch */}
                        <div className="absolute top-0 inset-x-0 h-6 bg-gray-800 rounded-b-3xl mx-16 z-20"></div>

                        {/* Screen Content */}
                        <div className="pt-10 px-4 bg-gray-50 h-full flex flex-col gap-4 relative">
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-800">24 Recommended<br /><span className="text-[10px] text-gray-500 font-normal">Based on requirements</span></h3>
                                </div>
                                <span className="text-[10px] text-blue-600 font-bold">View All</span>
                            </div>

                            {/* Mobile Card 1 */}
                            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 relative">
                                <div className="absolute top-3 right-3 text-[9px] text-gray-400">1h ago</div>
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold text-lg mb-2">
                                    <UserCheck size={20} />
                                </div>
                                <h4 className="text-sm font-bold text-gray-900 leading-tight">Sarah Jenkins</h4>
                                <p className="text-[10px] text-gray-500 mb-2">Senior Product Designer • 7 Yrs Exp</p>
                                <div className="flex items-center gap-1 text-[9px] text-gray-400">
                                    <span className="text-yellow-500">★ 98% Match</span> • Remote
                                </div>
                            </div>

                            {/* Mobile Card 2 */}
                            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 relative">
                                <div className="absolute top-3 right-3 text-[9px] text-gray-400">3h ago</div>
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-lg mb-2">
                                    <Zap size={20} />
                                </div>
                                <h4 className="text-sm font-bold text-gray-900 leading-tight">David Chen</h4>
                                <p className="text-[10px] text-gray-500 mb-2">Lead React Developer • 5 Yrs Exp</p>
                                <div className="flex items-center gap-1 text-[9px] text-gray-400">
                                    <span className="text-yellow-500">★ 95% Match</span> • New York
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Hero Card 1 (Out of screen frame) */}
                    <div className="absolute top-12 -left-16 sm:-left-24 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 w-56 transform -rotate-6 hover:rotate-0 transition-transform hidden sm:block">
                        <div className="flex items-center gap-3">
                            <img className="w-10 h-10 rounded-full object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150" alt="Avatar" />
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 leading-none">Emily R. <span className="text-[10px] text-gray-400 font-normal">applied</span></h4>
                                <p className="text-[11px] text-[#0f766d] font-bold mt-1">Full-Stack Engineer</p>
                            </div>
                        </div>
                    </div>

                    {/* Floating Hero Card 2 (Right side) */}
                    <div className="absolute bottom-0 -right-4 sm:-right-8 bg-white rounded-2xl p-3 shadow-xl border border-gray-100 w-48 transform rotate-3 hover:translate-x-2 transition-transform hidden sm:block">
                        <div className="flex justify-between items-start mb-1">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <Star size={14} className="fill-current" />
                            </div>
                            <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Top 1%</span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 mt-2">Perfect Match Found!</h4>
                        <p className="text-[10px] text-gray-500">Based on your requirements</p>
                    </div>

                </div>

            </div>
        </section>
    );
}
