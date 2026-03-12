"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Eye } from "lucide-react";

// Dummy data for the detailed employer profile
const employerData = {
    id: 1,
    name: "TechNova Solutions",
    email: "contact@technova.com",
    industry: "IT Services",
    status: "Verified",
    accountStatus: "Active",
    joinDate: "Oct 12, 2023",
    logoColor: "#3B82F6",
    totalJobsPosted: 142,
    activeJobs: 12,
    applicationsReceived: 4829,
    hireRate: "22%",
    jobsBreakdown: "Active (12) · Paused (4) · Expired (126)",
    documentName: "Registration_Doc.pdf",
    documentSize: "2.4 MB • PDF Document",
};

export default function DetailedEmployerProfileContent() {
    return (
        <div className="w-full min-h-full p-5 md:p-8 lg:py-12 lg:px-14 bg-[#F9FAFB] flex flex-col gap-6 md:gap-8">
            {/* ── Back Navigation ── */}
            <Link
                href="/admin-dashboard/employers-profile"
                className="flex items-center gap-3 md:gap-4 w-fit group"
            >
                <span className="bg-[#F3F4F6] p-1.5 md:p-2 rounded-lg text-[#4B5563] font-bold text-sm group-hover:bg-[#E5E7EB] transition-colors">
                    <ArrowLeft size={16} />
                </span>
                <span className="text-[#6B7280] text-sm font-normal font-inter group-hover:text-[#4B5563] transition-colors">
                    Back to Employers All
                </span>
            </Link>

            {/* ── Hero Card ── */}
            <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 lg:p-8 flex flex-col gap-4 md:gap-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 md:gap-5 lg:gap-6">
                    <div
                        className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg md:rounded-[10px] lg:rounded-xl shrink-0"
                        style={{ backgroundColor: employerData.logoColor }}
                    />
                    <div className="flex flex-col gap-1">
                        <h1 className="text-lg md:text-2xl lg:text-[28px] font-bold text-[#111827] font-inter">
                            {employerData.name}
                        </h1>
                        <span className="text-[13px] md:text-sm lg:text-[15px] text-[#4B5563] font-inter">
                            {employerData.email}
                        </span>
                    </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-[11px] md:text-xs font-semibold text-[#166534] bg-[#DCFCE7] px-2 md:px-2.5 py-1 rounded-full font-inter">
                        Verified Account
                    </span>
                    <span className="text-[11px] md:text-xs font-semibold text-[#1D4ED8] bg-[#DBEAFE] px-2 md:px-2.5 py-1 rounded-full font-inter">
                        {employerData.industry}
                    </span>
                </div>
            </div>

            {/* ── Two Column Layout (Desktop/Tablet) / Stacked (Mobile) ── */}
            <div className="flex flex-col lg:flex-row gap-6 md:gap-6 lg:gap-8">
                {/* ── LEFT COLUMN: Verification & Trust (shown first on mobile) ── */}
                <div className="order-1 lg:order-2 lg:w-[400px] lg:shrink-0">
                    <div className="bg-white rounded-xl p-4 md:p-6 flex flex-col gap-5 md:gap-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-[#111827] font-inter">
                            Verification &amp; Trust
                        </h2>

                        {/* Account Status */}
                        <div className="flex flex-col gap-2">
                            <span className="text-[13px] font-medium text-[#6B7280] font-inter">Account Status</span>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-[#10B981] rounded-full" />
                                <span className="text-sm font-semibold text-[#111827] font-inter">
                                    {employerData.accountStatus}
                                </span>
                            </div>
                        </div>

                        {/* Join Date */}
                        <div className="flex flex-col gap-2">
                            <span className="text-[13px] font-medium text-[#6B7280] font-inter">Join Date</span>
                            <span className="text-sm font-medium text-[#111827] font-inter">
                                {employerData.joinDate}
                            </span>
                        </div>

                        {/* Business Documents */}
                        <div className="flex flex-col gap-2">
                            <span className="text-[13px] font-medium text-[#6B7280] font-inter">Business Documents</span>
                            <div className="bg-[#F9FAFB] rounded-lg p-2.5 md:p-3 flex items-center gap-2.5 md:gap-3">
                                <div className="w-8 h-8 bg-[#FEE2E2] rounded-md flex items-center justify-center shrink-0">
                                    <FileText size={16} className="text-[#DC2626]" />
                                </div>
                                <div className="flex flex-col gap-0 flex-1 min-w-0">
                                    <span className="text-sm font-medium text-[#111827] font-inter truncate">
                                        {employerData.documentName}
                                    </span>
                                    <span className="text-xs text-[#6B7280] font-inter">
                                        {employerData.documentSize}
                                    </span>
                                </div>
                                <button className="bg-white p-1.5 rounded-md hover:bg-gray-100 transition-colors">
                                    <Eye size={14} className="text-[#6B7280]" />
                                </button>
                            </div>
                        </div>

                        {/* Verification Decision */}
                        <div className="flex flex-col gap-3">
                            <span className="text-[13px] font-medium text-[#6B7280] font-inter">Verification Decision</span>
                            <div className="flex items-center gap-2">
                                <button className="bg-[#10B981] text-white text-sm font-semibold px-3 md:px-4 py-2 rounded-md hover:bg-[#059669] transition-colors font-inter">
                                    Approve
                                </button>
                                <button className="bg-[#EF4444] text-white text-sm font-semibold px-3 md:px-4 py-2 rounded-md hover:bg-[#DC2626] transition-colors font-inter">
                                    Reject
                                </button>
                            </div>
                        </div>

                        {/* Reason for Suspension */}
                        <div className="flex flex-col gap-2">
                            <span className="text-[13px] font-medium text-[#6B7280] font-inter">Reason for Suspension (if any)</span>
                            <textarea
                                placeholder="No issues reported yet..."
                                className="w-full h-20 bg-[#F9FAFB] border border-gray-200 rounded-lg p-3 text-[13px] text-[#9CA3AF] placeholder:text-[#9CA3AF] font-inter resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                readOnly
                            />
                        </div>

                        {/* Account Moderation */}
                        <div className="flex flex-col gap-3">
                            <span className="text-[13px] font-medium text-[#6B7280] font-inter">Account Moderation</span>
                            <div className="flex flex-col gap-2">
                                <button className="text-sm font-semibold text-[#B45309] bg-[#FFFBEB] px-4 py-2.5 rounded-lg hover:bg-[#FEF3C7] transition-colors font-inter text-left">
                                    Suspend Account
                                </button>
                                <button className="text-sm font-semibold text-[#B91C1C] bg-[#FEF2F2] px-4 py-2.5 rounded-lg hover:bg-[#FEE2E2] transition-colors font-inter text-left">
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT COLUMN: Performance & Activity Metrics ── */}
                <div className="order-2 lg:order-1 flex-1">
                    <div className="bg-white rounded-xl p-4 md:p-6 flex flex-col gap-5 md:gap-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-[#111827] font-inter">
                            Performance &amp; Activity Metrics
                        </h2>

                        {/* Jobs Breakdown */}
                        <span className="text-[13px] font-medium text-[#4B5563] font-inter">
                            Jobs Breakdown: {employerData.jobsBreakdown}
                        </span>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Total Jobs Posted */}
                            <div className="bg-[#F9FAFB] rounded-lg p-4 flex flex-col gap-2">
                                <span className="text-[13px] text-[#6B7280] font-normal font-inter">Total Jobs Posted</span>
                                <span className="text-[28px] font-bold text-[#111827] font-inter">
                                    {employerData.totalJobsPosted}
                                </span>
                            </div>

                            {/* Active Jobs */}
                            <div className="bg-[#F9FAFB] rounded-lg p-4 flex flex-col gap-2">
                                <span className="text-[13px] text-[#6B7280] font-normal font-inter">Active Jobs</span>
                                <span className="text-[28px] font-bold text-[#3B82F6] font-inter">
                                    {employerData.activeJobs}
                                </span>
                            </div>

                            {/* Applications Received */}
                            <div className="bg-[#F9FAFB] rounded-lg p-4 flex flex-col gap-2">
                                <span className="text-[13px] text-[#6B7280] font-normal font-inter">Applications Received</span>
                                <span className="text-[28px] font-bold text-[#111827] font-inter">
                                    {employerData.applicationsReceived.toLocaleString()}
                                </span>
                            </div>

                            {/* Hire Rate */}
                            <div className="bg-[#F9FAFB] rounded-lg p-4 flex flex-col gap-2">
                                <span className="text-[13px] text-[#6B7280] font-normal font-inter">Hire Rate</span>
                                <span className="text-[28px] font-bold text-[#10B981] font-inter">
                                    {employerData.hireRate}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
