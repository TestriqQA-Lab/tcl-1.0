"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

type ApprovalStatus = "Pending" | "Approved" | "Rejected";

interface ApprovalJob {
    id: number;
    role: string;
    company: string;
    dateSubmitted: string;
    status: ApprovalStatus;
}

// Dummy data for Job Approvals
const approvalJobs: ApprovalJob[] = [
    {
        id: 1,
        role: "Senior Frontend Developer",
        company: "TechNova Solutions",
        dateSubmitted: "2 hours ago",
        status: "Pending",
    },
    {
        id: 2,
        role: "Backend Engineer",
        company: "DataFlow Inc.",
        dateSubmitted: "1 day ago",
        status: "Approved",
    },
    {
        id: 3,
        role: "Product Manager",
        company: "InnoTech",
        dateSubmitted: "3 days ago",
        status: "Rejected",
    },
    {
        id: 4,
        role: "UI/UX Designer",
        company: "Creative Logic",
        dateSubmitted: "5 hours ago",
        status: "Pending",
    },
];

const statusBadge: Record<ApprovalStatus, { bg: string; text: string; label: string }> = {
    Pending: { bg: "#FEF3C7", text: "#92400E", label: "Pending" },
    Approved: { bg: "#ECFDF5", text: "#059669", label: "Approved" },
    Rejected: { bg: "#FEF2F2", text: "#DC2626", label: "Rejected" },
};

const tabCounts: Record<ApprovalStatus, number> = {
    Pending: approvalJobs.filter((j) => j.status === "Pending").length,
    Approved: approvalJobs.filter((j) => j.status === "Approved").length,
    Rejected: approvalJobs.filter((j) => j.status === "Rejected").length,
};

export default function JobApprovalsContent() {
    const [activeTab, setActiveTab] = useState<ApprovalStatus>("Pending");
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = approvalJobs
        .filter((j) => j.status === activeTab)
        .filter(
            (j) =>
                j.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                j.company.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const tabs: ApprovalStatus[] = ["Pending", "Approved", "Rejected"];

    return (
        <div className="w-full min-h-full p-4 md:p-8 lg:py-12 lg:px-14 bg-[#F9FAFB] flex flex-col gap-5 md:gap-6 lg:gap-8">
            {/* ── Header ── */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 md:gap-4">
                <h1 className="text-xl md:text-2xl lg:text-[32px] font-bold text-[#111827] font-inter">
                    Job Approvals
                </h1>

                {/* Search Bar */}
                <div className="relative w-full lg:w-[320px]">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                        size={16}
                    />
                    <input
                        type="text"
                        placeholder="Search approvals..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg lg:rounded-[10px] bg-white text-sm text-[#111827] placeholder:text-[#9CA3AF] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-inter"
                    />
                </div>
            </div>

            {/* ── Tabs ── */}
            {/* Desktop / Tablet: pill tabs */}
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

            {/* Mobile: text tabs */}
            <div className="flex md:hidden gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-[13px] font-inter transition-colors px-1 ${
                            activeTab === tab
                                ? "text-[#3B82F6] font-semibold"
                                : "text-[#6B7280] font-medium"
                        }`}
                    >
                        {tab} ({tabCounts[tab]})
                    </button>
                ))}
            </div>

            {/* ── Desktop Table ── */}
            <div className="hidden lg:block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                {/* Table Header */}
                <div className="flex items-center bg-[#F9FAFB] px-6 py-4 border-b border-gray-100">
                    <span className="w-[300px] text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wider">
                        Job Role
                    </span>
                    <span className="w-[250px] text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wider">
                        Company
                    </span>
                    <span className="w-[200px] text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wider">
                        Date Submitted
                    </span>
                    <span className="w-[150px] text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wider">
                        Status
                    </span>
                    <span className="flex-1 text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wider">
                        Actions
                    </span>
                </div>

                {/* Table Body */}
                {filtered.length === 0 ? (
                    <div className="px-6 py-10 text-center text-sm text-[#6B7280]">
                        No approvals found for this status.
                    </div>
                ) : (
                    filtered.map((job) => (
                        <div
                            key={job.id}
                            className="flex items-center px-6 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                        >
                            {/* Job Role */}
                            <div className="w-[300px]">
                                <span className="text-sm font-semibold text-[#111827] font-inter">
                                    {job.role}
                                </span>
                            </div>

                            {/* Company */}
                            <div className="w-[250px]">
                                <span className="text-sm text-[#4B5563] font-inter">
                                    {job.company}
                                </span>
                            </div>

                            {/* Date Submitted */}
                            <div className="w-[200px]">
                                <span className="text-[13px] text-[#6B7280] font-inter">
                                    {job.dateSubmitted}
                                </span>
                            </div>

                            {/* Status */}
                            <div className="w-[150px]">
                                <span
                                    className="text-xs font-semibold px-2.5 py-1 rounded-full font-inter"
                                    style={{
                                        backgroundColor: statusBadge[job.status].bg,
                                        color: statusBadge[job.status].text,
                                    }}
                                >
                                    {statusBadge[job.status].label}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex-1 flex items-center gap-3">
                                <Link
                                    href={`/admin-dashboard/job-approvals/${job.id}`}
                                    className="text-[13px] font-semibold text-[#3B82F6] hover:underline font-inter"
                                >
                                    Review
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ── Tablet / Mobile Card List ── */}
            <div className="flex lg:hidden flex-col gap-4">
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-xl p-6 text-center text-sm text-[#6B7280]">
                        No approvals found for this status.
                    </div>
                ) : (
                    filtered.map((job) => (
                        <div
                            key={job.id}
                            className="bg-white rounded-xl p-5 flex flex-col gap-4 shadow-sm border border-gray-100"
                        >
                            {/* Top Row  */}
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex flex-col gap-1 flex-1 min-w-0">
                                    <span className="text-base font-bold text-[#111827] font-inter">
                                        {job.role}
                                    </span>
                                    <span className="text-[13px] text-[#4B5563] font-inter">
                                        {job.company} • {job.dateSubmitted}
                                    </span>
                                </div>
                                <div className="shrink-0 pt-1">
                                    <span
                                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full font-inter"
                                        style={{
                                            backgroundColor: statusBadge[job.status].bg,
                                            color: statusBadge[job.status].text,
                                        }}
                                    >
                                        {statusBadge[job.status].label}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center pt-3 border-t border-gray-100">
                                <Link
                                    href={`/admin-dashboard/job-approvals/${job.id}`}
                                    className="text-sm font-semibold text-[#3B82F6] bg-[#EFF6FF] px-4 py-2 rounded-lg hover:bg-[#DBEAFE] transition-colors font-inter flex-1 text-center"
                                >
                                    Review Details
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
