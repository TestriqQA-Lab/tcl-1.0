"use client";

import React from "react";
import { Lightbulb, HelpCircle } from "lucide-react";

interface OnboardingSidebarProps {
    progress?: number;
}

export const OnboardingSidebar = ({ progress = 50 }: OnboardingSidebarProps) => {
    // Calculate circle circumference for SVG dasharray
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    let strengthLabel = "Intermediate";
    let strengthColor = "text-[#0f766d]";
    if (progress < 40) {
        strengthLabel = "Beginner";
        strengthColor = "text-orange-500";
    } else if (progress >= 75) {
        strengthLabel = "Strong";
        strengthColor = "text-green-600";
    }

    return (
        <div className="space-y-6">
            {/* Profile Strength Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <h3 className="text-gray-900 font-bold mb-6">Profile Strength</h3>

                <div className="relative w-32 h-32 mx-auto mb-4">
                    {/* SVG Progress Circle */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-gray-100"
                        />
                        <circle
                            cx="64"
                            cy="64"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className={strengthColor}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-2xl font-bold leading-none mb-1 ${strengthColor}`}>{progress}%</span>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-normal">
                            {strengthLabel}
                        </span>
                    </div>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">
                    You&apos;re doing great! Complete your details to reach <span className="font-bold text-gray-900">100%</span>.
                </p>
            </div>

            {/* Quick Tip Card */}
            <div className="bg-[#FFFBF0] rounded-2xl p-6 border border-orange-100 relative overflow-hidden">
                <div className="flex gap-3">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                            <Lightbulb className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">Quick Tip</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Adding 5 or more skills increases your visibility to recruiters by <span className="font-bold">3x</span>. Highlight your core tech stack!
                        </p>
                    </div>
                </div>
            </div>

            {/* Help Link */}
            <div className="text-center">
                <button className="inline-flex items-center gap-2 text-xs font-semibold text-[#0f766d] hover:underline">
                    <HelpCircle className="w-4 h-4" />
                    Need help with this step?
                </button>
            </div>
        </div>
    );
};
