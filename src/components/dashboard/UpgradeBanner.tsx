"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export const UpgradeBanner = ({ userName }: { userName?: string | null }) => {
    const firstName = userName ? userName.split(" ")[0] : "";

    return (
        <div className="bg-[#0e1b1a] rounded-2xl p-6 sm:p-7 relative overflow-hidden">
            {/* Single subtle accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0f766d] to-transparent" />

            <div className="relative z-10">
                {/* Heading */}
                <h2 className="text-lg sm:text-xl font-bold text-white leading-snug mb-2">
                    {firstName
                        ? <>{firstName}, your next <span className="text-[#2dd4a8]">big opportunity</span> is waiting</>
                        : <>Your next <span className="text-[#2dd4a8]">big opportunity</span> is waiting</>
                    }
                </h2>

                {/* Description */}
                <p className="text-[13px] text-gray-400 leading-relaxed max-w-md mb-5">
                    Join <span className="text-gray-300 font-medium">50,000+</span> professionals who landed
                    their dream roles. Let recruiters from top companies discover you.
                </p>

                {/* CTA Row */}
                <div className="flex items-center gap-3 mb-5">
                    <Link
                        href="/search"
                        className="inline-flex items-center gap-2 bg-[#0f766d] hover:bg-[#0d6b63] text-white px-5 py-2 rounded-lg font-semibold text-sm transition-colors group"
                    >
                        Explore Jobs
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <Link
                        href="/user-profile"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                    >
                        Complete Profile
                    </Link>
                </div>

                {/* Social Proof — minimal */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                            {["bg-blue-500", "bg-violet-500", "bg-amber-500", "bg-rose-500"].map((color, i) => (
                                <div
                                    key={i}
                                    className={`w-5 h-5 rounded-full ${color} border-[1.5px] border-[#0e1b1a] text-[7px] font-bold text-white flex items-center justify-center`}
                                >
                                    {["A", "S", "M", "R"][i]}
                                </div>
                            ))}
                        </div>
                        <span className="text-[11px] text-gray-500">
                            <span className="text-gray-400 font-medium">2,400+</span> hired this month
                        </span>
                    </div>

                    <div className="hidden sm:flex items-center gap-1">
                        <div className="flex gap-px">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                            ))}
                        </div>
                        <span className="text-[11px] text-gray-500 ml-1">4.9/5</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
