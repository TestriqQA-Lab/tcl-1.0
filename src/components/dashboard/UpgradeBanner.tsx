"use client";

import React from "react";
import { Rocket } from "lucide-react";

export const UpgradeBanner = ({ userName }: { userName?: string | null }) => {
    const firstName = userName ? userName.split(" ")[0] : "";
    return (
        <div className="bg-[#1D7F75] rounded-2xl p-8 relative overflow-hidden text-white shadow-sm">
            {/* Background Pattern/Gradient overlay if needed */}
            <div className="relative z-10 max-w-lg">
                <h2 className="text-2xl font-bold mb-3 leading-tight">
                    {firstName ? `${firstName}, you are missing out on 3x more views!` : "You are missing out on 3x more views!"}
                </h2>
                <p className="text-white/90 text-sm mb-6 leading-relaxed max-w-sm">
                    Top recruiters prefer candidates with completed Pro profiles. Unlock exclusive features and premium placement today.
                </p>
                <button className="bg-white text-[#0f766d] px-6 py-2.5 rounded-full font-bold text-sm inline-flex items-center gap-2 hover:bg-gray-50 transition-colors">
                    Upgrade to Pro
                    <Rocket className="w-4 h-4" />
                </button>
            </div>

            {/* Decorative Element - blurred circle or graphical element */}
            <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>
    );
};
