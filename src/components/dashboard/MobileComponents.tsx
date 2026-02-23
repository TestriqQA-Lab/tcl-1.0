"use client";

import React from "react";
import Image from "next/image";
import { Check, Edit3, Briefcase } from "lucide-react";

export const MobileProfileCard = () => {
    const completionPercentage = 63;

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center gap-4 mb-5">
                {/* Avatar */}
                <div className="relative w-16 h-16 flex-shrink-0">
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#f0f9f8]">
                        <Image
                            src="https://ui-avatars.com/api/?name=Rohan+Bhatia&background=0D8ABC&color=fff"
                            alt="Rohan"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                        <h2 className="text-lg font-bold text-gray-900">Rohan Bhatia</h2>
                        <div className="bg-[#0f766d] rounded-full p-0.5">
                            <Check className="w-2 h-2 text-white stroke-[3]" />
                        </div>
                    </div>
                    <p className="text-[#0f766d] text-sm font-semibold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        63% profile complete
                    </p>
                </div>
            </div>

            {/* Progress */}
            <div className="mb-2">
                <div className="flex justify-between text-sm font-semibold text-[#0f766d] mb-2">
                    <span>Profile Strength</span>
                    <span>63%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0f766d] rounded-full w-[63%]"></div>
                </div>
            </div>

            <p className="text-xs text-gray-500 mb-5">
                Add your skills to reach 100% and get 3x more visibility.
            </p>

            <button className="w-full bg-[#0f766d] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#0d655d] transition-colors">
                <Edit3 className="w-4 h-4" />
                Complete Profile
            </button>
        </div>
    );
};

export const MobileEmptyState = () => {
    return (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
                No recommendations yet
            </h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">
                Tailor your job feed by sharing your career preferences and skills with us.
            </p>
            <button className="bg-[#E8F3F2] text-[#0f766d] px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#d0e6e4] transition-colors">
                Update preferences
            </button>
        </div>
    );
};

export const MobileSafetyCard = () => {
    return (
        <div className="bg-[#effefb] rounded-2xl p-5 border border-[#cff7ef] flex gap-4 items-start">
            <div className="flex-shrink-0 mt-0.5">
                <div className="w-8 h-8 rounded-full bg-[#0f766d] flex items-center justify-center">
                    <div className="bg-white rounded-full p-0.5">
                        <Check className="w-3 h-3 text-[#0f766d] stroke-[3]" />
                    </div>
                </div>
            </div>
            <div>
                <h4 className="font-bold text-[#064e48] text-sm mb-1">Safety Advisory</h4>
                <p className="text-xs text-[#0f766d]/80 leading-relaxed mb-1.5">
                    TopCareerLive never asks for payment to secure jobs. Always verify recruiters through our official channels.
                </p>
                <a href="#" className="text-xs font-bold text-[#0f766d] underline decoration-1 underline-offset-2">
                    Learn more
                </a>
            </div>
        </div>
    );
};
