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
