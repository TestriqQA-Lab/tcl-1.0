"use client";

import { Lightbulb, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const tips = [
    {
        title: "Optimize Job Descriptions",
        desc: "Use clear, benefit-driven language to attract top talent.",
    },
    {
        title: "Speed Up Screening",
        desc: "Use our status filters to quickly organize candidates.",
    },
    {
        title: "Complete Your Profile",
        desc: "A verified profile increases applicant trust by 40%.",
    },
];

export function HiringTipsCard() {
    return (
        <div className="flex flex-col bg-white rounded-xl border border-[#E2E8F0] p-5 gap-4">
            <div className="flex items-center gap-2">
                <div className="size-8 bg-[#fefce8] rounded-lg flex items-center justify-center">
                    <Lightbulb size={18} className="text-[#ca8a04]" />
                </div>
                <h3 className="text-[15px] font-bold text-[#0e1b1a]">
                    Hiring Tips
                </h3>
            </div>
            
            <div className="flex flex-col gap-4">
                {tips.map((tip, i) => (
                    <div key={i} className="flex gap-3">
                        <div className="mt-1 shrink-0">
                            <CheckCircle2 size={14} className="text-[#0f766d]" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[13px] font-semibold text-[#0e1b1a]">
                                {tip.title}
                            </span>
                            <span className="text-xs text-[#64748B] leading-relaxed">
                                {tip.desc}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <Link 
                href="/employer-dashboard/post-job"
                className="group flex items-center justify-between mt-2 p-3 bg-[#F8FAFB] rounded-lg hover:bg-[#F1F5F9] transition-colors"
            >
                <span className="text-xs font-semibold text-[#0f766d]">Post a new role</span>
                <ArrowRight size={14} className="text-[#0f766d] group-hover:translate-x-0.5 transition-transform" />
            </Link>
        </div>
    );
}
