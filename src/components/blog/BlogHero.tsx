"use client";

import Image from "next/image";
import Link from "next/link";

export function BlogHero() {
    return (
        <section className="w-full py-14">
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

                {/* ─── Left: Content ─── */}
                <div className="flex flex-col">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 mb-6 self-start">
                        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#0f766d]/10">
                            <span className="material-symbols-outlined text-[16px] text-[#0f766d]">article</span>
                        </span>
                        <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#0f766d]">
                            TopCareerLive Blog
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-extrabold text-[#0e1b1a] leading-[1.08] tracking-tight">
                        Insights to build a{" "}
                        <span className="text-[#0f766d] underline decoration-[#0f766d]/20 decoration-[3px] underline-offset-[6px]">
                            smarter career
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="mt-5 text-gray-500 text-base sm:text-lg leading-[1.7] max-w-lg">
                        Expert-written articles on interviews, career growth, salary negotiation, leadership, and the future of work — trusted by thousands of professionals.
                    </p>

                    {/* CTA Row */}
                    <div className="flex flex-wrap items-center gap-3 mt-8">
                        <Link
                            href="#articles"
                            className="inline-flex items-center gap-2 bg-[#0f766d] hover:bg-[#0b635b] text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors shadow-sm"
                        >
                            Start Reading
                            <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                        </Link>
                        <Link
                            href="#subscribe"
                            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm px-6 py-3 rounded-lg border border-gray-200 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px] text-gray-400">mail</span>
                            Subscribe to Newsletter
                        </Link>
                    </div>

                    {/* Trust indicators */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-8 pt-8 border-t border-gray-100">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <span className="material-symbols-outlined text-[18px] text-[#0f766d]">group</span>
                            <span><span className="font-semibold text-gray-800">50,000+</span> weekly readers</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <span className="material-symbols-outlined text-[18px] text-[#0f766d]">description</span>
                            <span><span className="font-semibold text-gray-800">200+</span> articles</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <span className="material-symbols-outlined text-[18px] text-[#0f766d]">verified</span>
                            <span>Expert writers</span>
                        </div>
                    </div>
                </div>

                {/* ─── Right: Image ─── */}
                <div className="relative w-full aspect-[4/3] lg:aspect-[5/4] rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5">
                    <Image
                        src="/images/blog-hero.png"
                        alt="Professional workspace with laptop, notebook, and coffee — career resources"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                    />
                    {/* Subtle overlay to match brand */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0f766d]/5 via-transparent to-transparent" />
                </div>

            </div>
        </section>
    );
}
