"use client";

import Image from "next/image";

export function BlogHero() {
    return (
        <section className="bg-[#f8fafc] w-full py-12 md:py-20">
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left Content */}
                <div className="flex flex-col gap-6 max-w-xl">
                    <h1 className="text-5xl md:text-6xl font-bold text-[#0e1b1a] leading-[1.1] tracking-tight">
                        Navigate Your <br />
                        <span className="text-[#0f766d]">Career</span>
                    </h1>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        Join 50,000+ professionals getting weekly insights on growth, leadership, and the future of work.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-2">
                        <div className="relative flex-grow">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                                <span className="material-symbols-outlined text-xl">mail</span>
                            </span>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d] transition-all bg-white"
                            />
                        </div>
                        <button className="bg-[#0f766d] hover:bg-[#0d6b63] text-white font-semibold px-6 py-3 rounded-lg transition-colors whitespace-nowrap">
                            Subscribe
                        </button>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                        <div className="flex -space-x-2">
                            {/* Placeholder avatars */}
                            <div className="size-8 rounded-full border-2 border-white bg-gray-200" />
                            <div className="size-8 rounded-full border-2 border-white bg-gray-300" />
                            <div className="size-8 rounded-full border-2 border-white bg-gray-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">+2k Join the community</span>
                    </div>
                </div>

                {/* Right Image/Graphic area */}
                <div className="relative h-[400px] md:h-[500px] w-full bg-[#4F7F70] rounded-2xl overflow-hidden shadow-xl flex items-center justify-center">
                    {/* Placeholder for the abstract 3D wooden steps image */}
                    <div className="text-white/50 font-medium text-lg">
                        [Abstract 3D Career Growth Image]
                    </div>
                    <div className="absolute bottom-10 left-10 flex items-end gap-4">
                        {/* Simulate the wooden blocks */}
                        <div className="w-12 h-20 bg-[#d4b595] rounded-t-lg opacity-90"></div>
                        <div className="w-12 h-32 bg-[#d4b595] rounded-t-lg opacity-90"></div>
                        <div className="w-12 h-44 bg-[#d4b595] rounded-t-lg opacity-90"></div>
                        <div className="w-12 h-60 bg-[#d4b595] rounded-t-lg opacity-90"></div>
                        <div className="w-12 h-80 bg-[#d4b595] rounded-t-lg opacity-90"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
