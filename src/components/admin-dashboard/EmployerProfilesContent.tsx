"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { getAllEmployerProfilesAction } from "@/actions/admin.actions";

interface Employer {
    id: string;
    userId: string;
    name: string | null;
    companyName: string | null;
    companyIndustry: string | null;
    email: string;
    status: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
    logoUrl: string | null;
    createdAt: Date;
}

const statusStyles: Record<string, { bg: string; text: string }> = {
    VERIFIED: { bg: "#DCFCE7", text: "#16A34A" },
    PENDING: { bg: "#FEF9C3", text: "#CA8A04" },
    REJECTED: { bg: "#FEE2E2", text: "#DC2626" },
    UNVERIFIED: { bg: "#F3F4F6", text: "#6B7280" },
};

export default function EmployerProfilesContent() {
    const [searchQuery, setSearchQuery] = useState("");
    const [employers, setEmployers] = useState<Employer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchEmployers() {
            try {
                const result = await getAllEmployerProfilesAction();
                if (result.success && result.data) {
                    setEmployers(result.data as Employer[]);
                } else {
                    setError(result.error || "Failed to fetch employers");
                }
            } catch (err) {
                setError("An unexpected error occurred");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchEmployers();
    }, []);

    const filtered = employers.filter(
        (e) =>
            (e.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
            (e.companyIndustry?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
            (e.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (e.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
    );

    const getLogoColor = (name: string | null) => {
        if (!name) return "#3B82F6";
        const colors = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className="w-full min-h-full p-5 md:p-8 lg:py-12 lg:px-14 bg-[#F9FAFB] flex flex-col gap-6 md:gap-8 overflow-y-auto">
            {/* ── Header ── */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl md:text-[28px] lg:text-[30px] font-bold text-[#111827] font-inter">
                        Employer Profiles
                    </h1>
                    <p className="text-sm md:text-[15px] lg:text-base text-[#6B7280] font-normal font-inter hidden md:block">
                        Manage all registered companies.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full lg:w-[320px]">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                        size={16}
                    />
                    <input
                        type="text"
                        placeholder="Search employers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white text-sm text-[#111827] placeholder:text-[#9CA3AF] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-inter"
                    />
                </div>
            </div>

            {/* ── Status Messages ── */}
            {isLoading && (
                <div className="flex items-center justify-center p-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium">
                    {error}
                </div>
            )}

            {/* ── Desktop Table ── */}
            {!isLoading && !error && (
                <div className="hidden lg:block bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                    {/* Table Header */}
                    <div className="grid grid-cols-[2fr_1.5fr_2fr_1fr_1fr] bg-[#F9FAFB] px-5 py-4 border-b border-gray-100">
                        <span className="text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wider">
                            Company
                        </span>
                        <span className="text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wider">
                            Industry
                        </span>
                        <span className="text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wider">
                            Email
                        </span>
                        <span className="text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wider">
                            Status
                        </span>
                        <span className="text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wider">
                            Actions
                        </span>
                    </div>

                    {/* Table Body */}
                    {filtered.length === 0 ? (
                        <div className="px-5 py-10 text-center text-sm text-[#6B7280]">
                            No employers found matching your search.
                        </div>
                    ) : (
                        filtered.map((employer) => (
                            <div
                                key={employer.id}
                                className="grid grid-cols-[2fr_1.5fr_2fr_1fr_1fr] items-center px-5 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                            >
                                {/* Company */}
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-white font-bold"
                                        style={{ backgroundColor: getLogoColor(employer.companyName || employer.name) }}
                                    >
                                        {(employer.companyName || employer.name || "E")[0].toUpperCase()}
                                    </div>
                                    <span className="text-sm font-semibold text-[#111827] font-inter truncate">
                                        {employer.companyName || employer.name || "Unnamed Employer"}
                                    </span>
                                </div>

                                {/* Industry */}
                                <span className="text-sm text-[#4B5563] font-inter">
                                    {employer.companyIndustry || "Not specified"}
                                </span>

                                {/* Email */}
                                <span className="text-sm text-[#4B5563] font-inter truncate">
                                    {employer.email}
                                </span>

                                {/* Status Badge */}
                                <div>
                                    <span
                                        className="inline-block text-xs font-semibold px-2 py-1 rounded-full font-inter"
                                        style={{
                                            backgroundColor: statusStyles[employer.status]?.bg || "#F3F4F6",
                                            color: statusStyles[employer.status]?.text || "#6B7280",
                                        }}
                                    >
                                        {employer.status}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div>
                                    <Link
                                        href={`/admin-dashboard/employers-profile/${employer.id}`}
                                        className="text-sm text-[#4B5563] hover:text-[#111827] font-medium font-inter border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* ── Mobile / Tablet Card List ── */}
            {!isLoading && !error && (
                <div className="flex flex-col gap-4 lg:hidden">
                    {filtered.length === 0 ? (
                        <div className="bg-white rounded-xl p-6 text-center text-sm text-[#6B7280]">
                            No employers found matching your search.
                        </div>
                    ) : (
                        filtered.map((employer) => (
                            <div
                                key={employer.id}
                                className="bg-white rounded-[10px] p-4 flex flex-col gap-4 shadow-sm border border-gray-100"
                            >
                                {/* Card Top: Logo + Name/Industry + Badge */}
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-white font-bold"
                                        style={{ backgroundColor: getLogoColor(employer.companyName || employer.name) }}
                                    >
                                        {(employer.companyName || employer.name || "E")[0].toUpperCase()}
                                    </div>
                                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                        <span className="text-sm font-semibold text-[#111827] font-inter truncate">
                                            {employer.companyName || employer.name}
                                        </span>
                                        <span className="text-xs text-[#6B7280] font-inter">
                                            {employer.companyIndustry || "Not specified"}
                                        </span>
                                    </div>
                                    <span
                                        className="text-xs font-semibold px-2 py-1 rounded-full font-inter shrink-0"
                                        style={{
                                            backgroundColor: statusStyles[employer.status]?.bg || "#F3F4F6",
                                            color: statusStyles[employer.status]?.text || "#6B7280",
                                        }}
                                    >
                                        {employer.status}
                                    </span>
                                </div>

                                {/* Card Bottom: Email + View Profile */}
                                <div className="flex flex-col gap-3">
                                    <span className="text-[13px] text-[#4B5563] font-inter">
                                        {employer.email}
                                    </span>
                                    <Link
                                        href={`/admin-dashboard/employers-profile/${employer.id}`}
                                        className="text-sm text-[#4B5563] hover:text-[#111827] font-medium font-inter border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 transition-colors w-fit"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
