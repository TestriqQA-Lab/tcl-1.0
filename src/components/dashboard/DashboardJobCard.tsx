"use client";

import React from "react";
import Image from "next/image";
import { Bookmark, MapPin, Banknote, Clock } from "lucide-react";

interface DashboardJobCardProps {
    title?: string;
    company?: string;
    location?: string;
    salary?: string;
    timeAgo?: string;
    logoUrl?: string;
}

export const DashboardJobCard = ({
    title = "Fullstack Developer",
    company = "GlobalStream Systems",
    location = "Hybrid, Mumbai",
    salary = "₹12L - ₹18L",
    timeAgo = "2 days ago",
    logoUrl
}: DashboardJobCardProps) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-shadow hover:shadow-md cursor-pointer">
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                    {/* Company Logo Placeholder */}
                    <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                        {logoUrl ? (
                            <Image src={logoUrl} alt={company} width={48} height={48} className="rounded-lg" />
                        ) : "GS"}
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
                        <p className="text-gray-600 text-sm font-medium">{company}</p>
                    </div>
                </div>

                <button className="text-gray-400 hover:text-[#0f766d] transition-colors">
                    <Bookmark className="w-5 h-5" />
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {location}
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                    <Banknote className="w-3.5 h-3.5 text-gray-400" />
                    {salary}
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {timeAgo}
                </div>
            </div>
        </div>
    );
};
