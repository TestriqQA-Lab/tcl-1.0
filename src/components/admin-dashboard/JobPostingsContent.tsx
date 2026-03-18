"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { getAllJobsAction } from "@/actions/admin.actions";

type JobStatusUI = "Active" | "Paused" | "Closed";
type TabType = "Active" | "Paused" | "Closed";

interface Job {
    id: string;
    title: string;
    companyName: string;
    createdAt: Date;
    applicationsCount: number;
    status: "OPEN" | "PAUSED" | "CLOSED";
}

const statusMap: Record<string, JobStatusUI> = {
    OPEN: "Active",
    PAUSED: "Paused",
    CLOSED: "Closed",
};

const statusBadge: Record<JobStatusUI, { bg: string; text: string; label: string }> = {
    Active: { bg: "#ECFDF5", text: "#059669", label: "Active" },
    Paused: { bg: "#FFFBEB", text: "#B45309", label: "Paused" },
    Closed: { bg: "#FEF2F2", text: "#DC2626", label: "Closed" },
};

export default function JobPostingsContent() {
    const [activeTab, setActiveTab] = useState<TabType>("Active");
    const [searchQuery, setSearchQuery] = useState("");
    const [jobs, setJobs] = useState<Job[]>([]);
    const [counts, setCounts] = useState<Record<string, number>>({ OPEN: 0, PAUSED: 0, CLOSED: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const uiToDbStatus: Record<TabType, "OPEN" | "PAUSED" | "CLOSED"> = {
        Active: "OPEN",
        Paused: "PAUSED",
        Closed: "CLOSED",
    };

    useEffect(() => {
        async function fetchJobs() {
            setIsLoading(true);
            try {
                const dbStatus = uiToDbStatus[activeTab];
                const result = await getAllJobsAction(dbStatus);
                if (result.success && result.data) {
                    setJobs(result.data.jobs as Job[]);
                    setCounts(result.data.counts);
                } else {
                    setError(result.error || "Failed to fetch jobs");
                }
            } catch (err) {
                setError("An unexpected error occurred");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchJobs();
    }, [activeTab]);

    const filtered = jobs.filter(
        (j) =>
            j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            j.companyName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const tabCounts: Record<TabType, number> = {
        Active: counts.OPEN,
        Paused: counts.PAUSED,
        Closed: counts.CLOSED,
    };

    const tabs: TabType[] = ["Active", "Paused", "Closed"];

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="w-full min-h-full p-4 md:p-8 lg:py-12 lg:px-14 bg-[#F9FAFB] flex flex-col gap-5 md:gap-6 lg:gap-8 overflow-y-auto">
            {/* ── Header ── */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 md:gap-4">
                <h1 className="text-xl md:text-2xl lg:text-[32px] font-bold text-[#111827] font-inter">
                    Job Postings
                </h1>

                {/* Search Bar */}
                <div className="relative w-full lg:w-[320px]">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                        size={16}
                    />
                    <input
                        type="text"
                        placeholder="Search job postings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg lg:rounded-[10px] bg-white text-sm text-[#111827] placeholder:text-[#9CA3AF] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-inter"
                    />
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="hidden md:flex bg-[#F3F4F6] rounded-[10px] p-1 w-fit md:w-full lg:w-fit gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-inter transition-colors md:flex-1 lg:flex-none text-center ${
                            activeTab === tab
                                ? "bg-white text-[#1F2937] font-semibold shadow-sm"
                                : "text-[#6B7280] font-medium hover:text-[#374151]"
                        }`}
                    >
                        {tab}
                        <span className="hidden lg:inline"> ({tabCounts[tab]})</span>
                    </button>
                ))}
            </div>

            <div className="flex md:hidden gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-[13px] font-inter transition-colors ${
                            activeTab === tab
                                ? "text-[#3B82F6] font-semibold"
                                : "text-[#6B7280] font-medium"
                        }`}
                    >
                        {tab} ({tabCounts[tab]})
                    </button>
                ))}
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
                <div className="hidden lg:block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    {/* Table Header */}
                    <div className="flex items-center bg-[#F9FAFB] px-6 py-4 border-b border-gray-100">
                        <span className="w-[300px] text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wider">
                            Job Role
                        </span>
                        <span className="w-[250px] text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wider">
                            Company
                        </span>
                        <span className="w-[150px] text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wider">
                            Date Posted
                        </span>
                        <span className="w-[120px] text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wider">
                            Apps
                        </span>
                        <span className="w-[120px] text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wider">
                            Status
                        </span>
                        <span className="w-[150px] text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wider">
                            Actions
                        </span>
                    </div>

                    {/* Table Body */}
                    {filtered.length === 0 ? (
                        <div className="px-6 py-10 text-center text-sm text-[#6B7280]">
                            No job postings found.
                        </div>
                    ) : (
                        filtered.map((job) => (
                            <div
                                key={job.id}
                                className="flex items-center px-6 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                            >
                                <div className="w-[300px]">
                                    <span className="text-sm font-semibold text-[#111827] font-inter truncate block">
                                        {job.title}
                                    </span>
                                </div>

                                <div className="w-[250px]">
                                    <span className="text-sm text-[#4B5563] font-inter truncate block">
                                        {job.companyName}
                                    </span>
                                </div>

                                <div className="w-[150px]">
                                    <span className="text-[13px] text-[#6B7280] font-inter">
                                        {formatDate(job.createdAt)}
                                    </span>
                                </div>

                                <div className="w-[120px]">
                                    <span className="text-sm font-semibold text-[#111827] font-inter">
                                        {job.applicationsCount}
                                    </span>
                                </div>

                                <div className="w-[120px]">
                                    <span
                                        className="text-xs font-semibold px-2 py-1 rounded-full font-inter"
                                        style={{
                                            backgroundColor: statusBadge[statusMap[job.status]].bg,
                                            color: statusBadge[statusMap[job.status]].text,
                                        }}
                                    >
                                        {statusBadge[statusMap[job.status]].label}
                                    </span>
                                </div>

                                <div className="w-[150px] flex items-center gap-3">
                                    <Link
                                        href={`/admin-dashboard/jobs/${job.id}`}
                                        className="text-[13px] font-semibold text-[#3B82F6] hover:underline font-inter"
                                    >
                                        Details
                                    </Link>
                                    <button className="text-[13px] font-semibold text-[#EF4444] hover:underline font-inter">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* ── Tablet Card List ── */}
            {!isLoading && !error && (
                <div className="hidden md:flex lg:hidden flex-col gap-4">
                    {filtered.length === 0 ? (
                        <div className="bg-white rounded-xl p-6 text-center text-sm text-[#6B7280]">
                            No job postings found.
                        </div>
                    ) : (
                        filtered.map((job) => (
                            <div
                                key={job.id}
                                className="bg-white rounded-xl p-5 flex flex-col gap-3 shadow-sm border border-gray-100"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                                        <span className="text-base font-bold text-[#111827] font-inter truncate">
                                            {job.title}
                                        </span>
                                        <span className="text-[13px] text-[#4B5563] font-inter truncate">
                                            {job.companyName} • {formatDate(job.createdAt)}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                        <span className="text-sm font-semibold text-[#111827] font-inter">
                                            {job.applicationsCount} Applications
                                        </span>
                                        <span
                                            className="text-xs font-semibold px-2 py-0.5 rounded-full font-inter"
                                            style={{
                                                backgroundColor: statusBadge[statusMap[job.status]].bg,
                                                color: statusBadge[statusMap[job.status]].text,
                                            }}
                                        >
                                            {statusBadge[statusMap[job.status]].label}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                                    <Link
                                        href={`/admin-dashboard/jobs/${job.id}`}
                                        className="text-sm font-semibold text-[#3B82F6] bg-[#EFF6FF] px-4 py-2 rounded-lg hover:bg-[#DBEAFE] transition-colors font-inter flex items-center justify-center"
                                    >
                                        View Details
                                    </Link>
                                    <button className="text-sm font-semibold text-[#DC2626] bg-[#FEF2F2] px-4 py-2 rounded-lg hover:bg-[#FEE2E2] transition-colors font-inter">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* ── Mobile Card List ── */}
            {!isLoading && !error && (
                <div className="flex flex-col gap-3 md:hidden">
                    {filtered.length === 0 ? (
                        <div className="bg-white rounded-xl p-6 text-center text-sm text-[#6B7280]">
                            No job postings found.
                        </div>
                    ) : (
                        filtered.map((job) => (
                            <div
                                key={job.id}
                                className="bg-white rounded-2xl p-5 flex flex-col gap-4 shadow-sm border border-gray-100"
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="text-[15px] font-bold text-[#111827] font-inter truncate">
                                        {job.title}
                                    </span>
                                    <span className="text-[13px] text-[#4B5563] font-inter truncate">
                                        {job.companyName}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <span className="text-[11px] text-[#9CA3AF] font-inter">
                                        📅 {formatDate(job.createdAt)}
                                    </span>
                                    <span className="text-[11px] font-semibold text-[#3B82F6] font-inter">
                                        {job.applicationsCount} Applications
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[11px] text-[#6B7280] font-inter">Status:</span>
                                        <span
                                            className="text-[11px] font-semibold px-2 py-0.5 rounded-full font-inter"
                                            style={{
                                                backgroundColor: statusBadge[statusMap[job.status]].bg,
                                                color: statusBadge[statusMap[job.status]].text,
                                            }}
                                        >
                                            {statusBadge[statusMap[job.status]].label}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2.5 pt-3 border-t border-gray-100">
                                    <Link
                                        href={`/admin-dashboard/jobs/${job.id}`}
                                        className="flex-1 text-sm font-semibold text-white bg-[#3B82F6] py-2.5 rounded-lg hover:bg-[#2563EB] transition-colors font-inter text-center flex items-center justify-center"
                                    >
                                        View Details
                                    </Link>
                                    <button className="flex-1 text-sm font-semibold text-white bg-[#EF4444] py-2.5 rounded-lg hover:bg-[#DC2626] transition-colors font-inter text-center">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
