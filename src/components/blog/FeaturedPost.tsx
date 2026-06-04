"use client";

import Image from "next/image";
import Link from "next/link";

export function FeaturedPost() {
    return (
        <section className="max-w-[1440px] pb-16">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 grid grid-cols-1 lg:grid-cols-2">
                {/* Image Side */}
                <div className="relative h-[300px] lg:h-auto bg-gray-200 min-h-[400px]">
                    <Image
                        src="/images/blog-remote-work.png"
                        alt="Featured Article - The Future of Remote Work in 2026"
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Content Side */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-sm font-medium mb-4">
                        <span className="bg-[#e0f2f1] text-[#0f766d] px-3 py-1 rounded-md uppercase text-xs tracking-wide font-bold">
                            Trending Now
                        </span>
                        <div className="flex items-center text-gray-500 gap-1">
                            <span className="material-symbols-outlined text-base">schedule</span>
                            <span>5 min read</span>
                        </div>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        The Future of Remote Work in 2026
                    </h2>

                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                        Discover how hybrid models are evolving and what critical soft skills you need to stay ahead in the rapidly changing digital economy.
                    </p>

                    <div className="flex items-center gap-3 mt-auto">
                        <div className="size-10 rounded-full overflow-hidden">
                            <Image
                                src="https://ui-avatars.com/api/?name=Sarah+Jenkins&background=0f766d&color=fff&size=80"
                                alt="Sarah Jenkins"
                                width={40}
                                height={40}
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">Sarah Jenkins</span>
                            <span className="text-xs text-gray-500">Senior HR Strategist</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
