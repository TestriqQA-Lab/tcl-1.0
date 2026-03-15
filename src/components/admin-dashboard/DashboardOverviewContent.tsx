"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { getAdminDashboardStatsAction } from "@/actions/admin.actions";

interface Stats {
    employers: number;
    seekers: number;
    jobs: number;
}

export default function DashboardOverviewContent() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                const result = await getAdminDashboardStatsAction();
                if (result.success && result.data) {
                    setStats(result.data);
                } else {
                    setError(result.error || "Failed to fetch stats");
                }
            } catch (err) {
                setError("An unexpected error occurred");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20 w-full">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium w-full">
                {error}
            </div>
        );
    }

    const cards = [
        {
            title: "Employer Profiles",
            value: stats?.employers || 0,
            href: "/admin-dashboard/employers-profile",
            subtext: "Total registered employers",
        },
        {
            title: "Seeker Profiles",
            value: stats?.seekers || 0,
            href: "/admin-dashboard/seekers-profile",
            subtext: "Total registered seekers",
        },
        {
            title: "Job Postings",
            value: stats?.jobs || 0,
            href: "/admin-dashboard/jobs",
            subtext: "Total jobs listed",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-6 w-full">
            {cards.map((card) => (
                <Link
                    key={card.title}
                    href={card.href}
                    className="bg-white rounded-xl p-5 md:p-6 flex flex-col gap-3 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer"
                >
                    <p className="text-[#6B7280] text-sm font-medium font-inter">{card.title}</p>
                    <div className="flex flex-col gap-1">
                        <span className="text-[#111827] text-2xl md:text-3xl font-bold font-inter tracking-tight">
                            {card.value.toLocaleString()}
                        </span>
                        <span className="text-[#6B7280] text-xs font-medium font-inter">
                            {card.subtext}
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    );
}
