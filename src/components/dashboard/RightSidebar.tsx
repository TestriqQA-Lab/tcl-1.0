"use client";

import React from "react";
import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

export const SafetyAdvisoryCard = () => {
    return (
        <div className="bg-[#FFFBF0] rounded-2xl p-6 border border-orange-100">
            <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 fill-orange-500/10" />
                <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider">SAFETY ADVISORY</h4>
            </div>
            <p className="text-xs text-[#7A5C32] leading-relaxed mb-3 font-medium">
                TopCareerLive never asks for money for job offers. Beware of fraudulent calls or emails claiming to be from our recruiters.
            </p>
            <Link href="#" className="text-xs font-bold text-[#A67C41] hover:underline">
                Learn how to stay safe
            </Link>
        </div>
    );
};

export const ResourcesCard = () => {
    return (
        <div className="bg-[#D3C7BD] rounded-2xl relative overflow-hidden h-60 flex flex-col justify-end p-6">
            {/* Background Shape is implied by color/image in design - simplified here */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

            <div className="relative z-10">
                <div className="text-[10px] font-bold text-white/90 uppercase tracking-wider mb-2">RESOURCES</div>
                <h3 className="text-lg font-bold text-white leading-tight mb-2">
                    15 Best Career Objective Samples for 2024
                </h3>
                <p className="text-xs text-white/90 mb-4 line-clamp-2">
                    Learn how to craft a compelling summary that grabs attention in seconds...
                </p>

                <div className="flex items-center justify-between text-white/80 text-[10px] font-bold">
                    <span>5 min read</span>
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
};

export const DashboardFooter = () => {
    return (
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-gray-400 font-medium px-2">
            <Link href="#" className="hover:text-gray-600">About</Link>
            <Link href="#" className="hover:text-gray-600">Help Center</Link>
            <Link href="#" className="hover:text-gray-600">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-600">Terms of Use</Link>
            <span className="text-gray-300">© 2024 TopCareerLive</span>
        </div>
    );
};
