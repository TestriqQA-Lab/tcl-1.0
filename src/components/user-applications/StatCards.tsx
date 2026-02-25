"use client";

import React from "react";
import { Briefcase, Zap, MessageSquare, Award, XCircle, Clock } from "lucide-react";
import { applicationStats } from "@/data/applications-mock";

const stats = [
    {
        label: "Total Applied",
        value: applicationStats.total,
        icon: Briefcase,
        color: "text-[#0f766d]",
        bg: "bg-[#e8f5f3]",
        ring: "ring-[#0f766d]/10",
    },
    {
        label: "Pending",
        value: applicationStats.pending,
        icon: Zap,
        color: "text-amber-600",
        bg: "bg-amber-50",
        ring: "ring-amber-600/10",
    },
    {
        label: "Reviewed",
        value: applicationStats.reviewed,
        icon: MessageSquare,
        color: "text-blue-600",
        bg: "bg-blue-50",
        ring: "ring-blue-600/10",
    },
    {
        label: "Rejected",
        value: applicationStats.rejected,
        icon: Award,
        color: "text-red-500",
        bg: "bg-red-50",
        ring: "ring-red-600/10",
    },
];

export const StatCards = () => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {stats.map((s) => (
                <div
                    key={s.label}
                    className={`relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow duration-300 group`}
                >
                    <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${s.bg} ${s.ring} ring-1 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <s.icon className={`w-5 h-5 ${s.color}`} strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[11px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide truncate">{s.label}</p>
                        <p className="text-xl sm:text-2xl font-extrabold text-[#0e1b1a] mt-0.5 leading-none">{s.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
