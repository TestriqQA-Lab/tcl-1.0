"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, MapPin, Banknote, Clock } from "lucide-react";

interface DashboardJobCardProps {
    id: string;
    title?: string;
    company?: string;
    location?: string;
    salary?: string;
    timeAgo?: string;
    logoUrl?: string;
}

export const DashboardJobCard = ({
    id,
    title = "Fullstack Developer",
    company = "GlobalStream Systems",
    location = "Hybrid, Mumbai",
    salary = "₹12L - ₹18L",
    timeAgo = "2 days ago",
    logoUrl
}: DashboardJobCardProps) => {
    return (
        <Link href={`/job/${id}`} className="block">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-shadow hover:shadow-md cursor-pointer h-full">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                        {/* Company Logo Placeholder */}
                        <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-xs font-bold text-gray-400 overflow-hidden">
                            {logoUrl ? (
                                <Image src={logoUrl} alt={company} width={48} height={48} className="object-contain" />
                            ) : "GS"}
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{title}</h3>
                            <p className="text-gray-600 text-sm font-medium line-clamp-1">{company}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 font-medium">
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
        </Link>
    );
};
