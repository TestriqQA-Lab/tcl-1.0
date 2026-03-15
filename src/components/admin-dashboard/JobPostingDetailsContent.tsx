"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface JobPostingDetailsContentProps {
    showApprovalControls?: boolean;
    backUrl?: string;
}

export default function JobPostingDetailsContent({
    showApprovalControls = false,
    backUrl = "/admin-dashboard/jobs",
}: JobPostingDetailsContentProps) {
    return (
        <div className="w-full min-h-full p-4 md:p-8 lg:py-10 lg:px-12 bg-[#F9FAFB] flex flex-col gap-5 md:gap-6 lg:gap-7">
            {/* ── Header ── */}
            <div className="flex flex-col gap-3 md:gap-4 lg:gap-4">
                <Link
                    href={backUrl}
                    className="flex items-center gap-2 text-sm font-medium text-[#374151] hover:text-[#111827] bg-white w-fit px-3 py-2 rounded-lg border border-gray-200 shadow-sm transition-colors"
                >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                </Link>
                <div className="flex flex-col gap-1.5 md:gap-2">
                    <h1 className="text-xl md:text-[22px] lg:text-[28px] font-bold text-[#111827] font-inter">
                        Job Post Verification
                    </h1>
                    <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-3 lg:gap-4 mt-1">
                        <span className="w-fit text-[11px] md:text-xs lg:text-[13px] font-semibold text-[#92400E] bg-[#FEF3C7] px-3 md:px-3.5 py-1.5 rounded-full font-inter">
                            ⏳ Pending Verification
                        </span>
                        <span className="text-[11px] md:text-xs lg:text-[13px] text-[#6B7280] font-inter">
                            Submitted 2 hours ago by TechNova Solutions
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Section 1: Job Details ── */}
            <section className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 flex flex-col gap-4 md:gap-4 lg:gap-5 shadow-sm border border-gray-100">
                <h2 className="text-[15px] md:text-base lg:text-lg font-bold text-[#111827] font-inter">
                    Job Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                    <div className="flex flex-col gap-1 md:gap-1.5 text-sm md:text-sm lg:text-base">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            Job Title
                        </span>
                        <span className="text-[13px] md:text-sm lg:text-[15px] font-medium text-[#111827] font-inter">
                            Senior Frontend Developer
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 md:gap-1.5 text-sm md:text-sm lg:text-base">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            Company
                        </span>
                        <span className="text-[13px] md:text-sm lg:text-[15px] font-medium text-[#111827] font-inter">
                            TechNova Solutions
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 md:gap-1.5 text-sm md:text-sm lg:text-base">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            Experience
                        </span>
                        <span className="text-[13px] md:text-sm lg:text-[15px] font-medium text-[#111827] font-inter">
                            3 - 6 years
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 md:gap-1.5 text-sm md:text-sm lg:text-base">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            Salary Per Month
                        </span>
                        <span className="text-[13px] md:text-sm lg:text-[15px] font-medium text-[#111827] font-inter">
                            ₹50,000 - ₹1,20,000
                        </span>
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            Perks & Benefits
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {["Health Insurance", "Annual Bonus", "Provident Fund"].map(
                                (perk) => (
                                    <span
                                        key={perk}
                                        className="text-[10px] md:text-[11px] lg:text-xs font-medium text-[#0F766D] bg-[#EFF6F5] px-2.5 md:px-3 py-1 md:py-1 lg:py-1 rounded-full font-inter"
                                    >
                                        {perk}
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 2: Candidate Preferences ── */}
            <section className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 flex flex-col gap-4 md:gap-4 lg:gap-5 shadow-sm border border-gray-100">
                <h2 className="text-[15px] md:text-base lg:text-lg font-bold text-[#111827] font-inter">
                    Candidate Preferences
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                    <div className="flex flex-col gap-1 md:gap-1.5">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            Location Requirement
                        </span>
                        <span className="text-[13px] md:text-sm lg:text-[15px] font-medium text-[#111827] font-inter">
                            In a specific city — Bangalore
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 md:gap-1.5">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            Relocation Allowance
                        </span>
                        <span className="text-[13px] md:text-sm lg:text-[15px] font-medium text-[#10B981] font-inter">
                            Yes
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 md:gap-1.5">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            Educational Qualification
                        </span>
                        <span className="text-[13px] md:text-sm lg:text-[15px] font-medium text-[#111827] font-inter">
                            Graduate
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 md:gap-1.5">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            Preferred Gender
                        </span>
                        <span className="text-[13px] md:text-sm lg:text-[15px] font-medium text-[#111827] font-inter">
                            Any
                        </span>
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            Required Skills
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {["React.js", "TypeScript", "Next.js", "Tailwind CSS"].map(
                                (skill) => (
                                    <span
                                        key={skill}
                                        className="text-[10px] md:text-[11px] lg:text-xs font-medium text-[#1D4ED8] bg-[#EFF6FF] px-2.5 md:px-3 py-1 rounded-full font-inter"
                                    >
                                        {skill}
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section 3: Screening Questions ── */}
            <section className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 flex flex-col gap-4 md:gap-4 lg:gap-5 shadow-sm border border-gray-100">
                <h2 className="text-[15px] md:text-base lg:text-lg font-bold text-[#111827] font-inter">
                    Screening Questions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                    <div className="flex flex-col gap-1 md:gap-1.5">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            Minimum Experience
                        </span>
                        <span className="text-[13px] md:text-sm lg:text-[15px] font-medium text-[#111827] font-inter">
                            3 years
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 md:gap-1.5">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            Minimum Education
                        </span>
                        <span className="text-[13px] md:text-sm lg:text-[15px] font-medium text-[#111827] font-inter">
                            Graduate
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 md:gap-1.5">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            English Level
                        </span>
                        <span className="text-[13px] md:text-sm lg:text-[15px] font-medium text-[#111827] font-inter">
                            Good English
                        </span>
                    </div>
                </div>
            </section>

            {/* ── Section 4: Job Description ── */}
            <section className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 flex flex-col gap-4 md:gap-4 lg:gap-5 shadow-sm border border-gray-100">
                <h2 className="text-[15px] md:text-base lg:text-lg font-bold text-[#111827] font-inter">
                    Job Description
                </h2>
                <div className="flex flex-col gap-4 md:gap-5">
                    <p className="text-xs md:text-[13px] lg:text-[14px] text-[#374151] font-inter leading-relaxed whitespace-pre-wrap">
                        {`We are looking for a Senior Frontend Developer to join our engineering team. You will be responsible for building and maintaining high-performance web applications using React.js and Next.js.

Responsibilities:
• Build responsive, accessible UI components
• Collaborate with backend engineers and designers
• Write clean, maintainable TypeScript code
• Participate in code reviews and architecture discussions`}
                    </p>
                    <div className="flex flex-col gap-1 md:gap-1.5">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            About Company
                        </span>
                        <p className="text-xs md:text-[13px] lg:text-[14px] text-[#374151] font-inter leading-relaxed">
                            TechNova Solutions is a fast-growing product company specializing in
                            SaaS platforms for HR technology. Founded in 2019, we serve 500+
                            enterprise clients across India and Southeast Asia.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Section 5: Communication Preferences ── */}
            <section className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 flex flex-col gap-4 md:gap-4 lg:gap-5 shadow-sm border border-gray-100">
                <h2 className="text-[15px] md:text-base lg:text-lg font-bold text-[#111827] font-inter">
                    Communication Preferences
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                    <div className="flex flex-col gap-1 md:gap-1.5">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            Recruiter Name
                        </span>
                        <span className="text-[13px] md:text-sm lg:text-[15px] font-medium text-[#111827] font-inter">
                            Rajesh Kumar
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 md:gap-1.5">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            Contact Number
                        </span>
                        <span className="text-[13px] md:text-sm lg:text-[15px] font-medium text-[#111827] font-inter">
                            +91 98765 43210
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 md:gap-1.5">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            Allow Calls
                        </span>
                        <span className="text-[13px] md:text-sm lg:text-[15px] font-medium text-[#10B981] font-inter">
                            Yes
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 md:gap-1.5">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            Call Timing
                        </span>
                        <span className="text-[13px] md:text-sm lg:text-[15px] font-medium text-[#111827] font-inter">
                            09:00 AM - 06:00 PM, Mon-Sat
                        </span>
                    </div>
                </div>
            </section>

            {/* ── Action Buttons ── */}
            {showApprovalControls && (
                <div className="flex flex-row gap-2.5 md:gap-4 lg:gap-4 lg:mt-2 w-full md:w-fit">
                    <button className="flex-1 md:flex-none text-[13px] md:text-sm lg:text-[15px] font-semibold text-white bg-[#EF4444] px-4 md:px-8 lg:px-10 py-3 md:py-3 lg:py-3 rounded-lg lg:rounded-[10px] hover:bg-[#DC2626] transition-colors font-inter text-center">
                        Reject Job Post
                    </button>
                    <button className="flex-1 md:flex-none text-[13px] md:text-sm lg:text-[15px] font-semibold text-white bg-[#10B981] px-4 md:px-8 lg:px-10 py-3 md:py-3 lg:py-3 rounded-lg lg:rounded-[10px] hover:bg-[#059669] transition-colors font-inter text-center">
                        Approve Job Post
                    </button>
                </div>
            )}
        </div>
    );
}
