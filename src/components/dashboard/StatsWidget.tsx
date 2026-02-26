"use client";

import React from "react";

export const StatsWidget = () => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                DASHBOARD STATS
            </h4>

            <div className="space-y-4">
                <div className="bg-[#f8fafc] rounded-xl p-4">
                    <div className="text-2xl font-bold text-gray-900 mb-1">0</div>
                    <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                        Search Appearances
                    </div>
                </div>

                <div className="bg-[#f8fafc] rounded-xl p-4">
                    <div className="text-2xl font-bold text-gray-900 mb-1">0</div>
                    <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                        Recruiter Actions
                    </div>
                </div>
            </div>
        </div>
    );
};
