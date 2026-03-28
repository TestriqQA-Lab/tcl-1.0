"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { getJobDetailAction, updateJobApprovalStatusAction } from "@/actions/admin.actions";
import { useRouter } from "next/navigation";

interface JobPostingDetailsContentProps {
    jobId?: string;
    showApprovalControls?: boolean;
    backUrl?: string;
}

export default function JobPostingDetailsContent({
    jobId,
    showApprovalControls = false,
    backUrl = "/admin-dashboard/jobs",
}: JobPostingDetailsContentProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [jobData, setJobData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!jobId) {
            setIsLoading(false);
            return;
        }

        async function fetchJob() {
            setIsLoading(true);
            try {
                const result = await getJobDetailAction(jobId!);
                if (result.success) {
                    setJobData(result.data);
                } else {
                    setError(result.error || "Failed to fetch job details");
                }
            } catch (err) {
                setError("An unexpected error occurred");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchJob();
    }, [jobId]);

    const [rejectionReason, setRejectionReason] = useState("");

    const handleUpdateStatus = async (status: "APPROVED" | "REJECTED") => {
        if (!jobId || isProcessing) return;

        if (status === "REJECTED" && !rejectionReason.trim()) {
            alert("Please provide a reason for rejection.");
            return;
        }

        setIsProcessing(true);
        try {
            const result = await updateJobApprovalStatusAction(jobId, status, rejectionReason);
            if (result.success) {
                router.push(backUrl);
                router.refresh();
            } else {
                alert(result.error || `Failed to ${status.toLowerCase()} job post`);
            }
        } catch (err) {
            alert("An unexpected error occurred");
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-8">
                <Loader2 className="w-10 h-10 text-[#0F766D] animate-spin mb-4" />
                <p className="text-[#6B7280] font-medium">Loading job details...</p>
            </div>
        );
    }

    if (error || !jobData) {
        return (
            <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-8">
                <XCircle className="w-10 h-10 text-red-500 mb-4" />
                <p className="text-red-500 font-medium">{error || "Job post not found"}</p>
                <Link href={backUrl} className="mt-4 text-[#0F766D] hover:underline font-semibold">
                    Go Back
                </Link>
            </div>
        );
    }

    const { job, employer } = jobData;

    const formatCurrency = (amt: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amt);
    };

    const formatDateAgo = (date: Date) => {
        const now = new Date();
        const diffInMs = now.getTime() - new Date(date).getTime();
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    };

    const statusBadge: Record<string, { bg: string; text: string; label: string }> = {
        PENDING: { bg: "#FEF3C7", text: "#92400E", label: "Pending Verification" },
        APPROVED: { bg: "#ECFDF5", text: "#059669", label: "Approved" },
        REJECTED: { bg: "#FEF2F2", text: "#DC2626", label: "Rejected" },
    };

    const currentStatus = statusBadge[job.approvalStatus] || statusBadge.PENDING;

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
                        <span
                            className="w-fit text-[11px] md:text-xs lg:text-[13px] font-semibold px-3 md:px-3.5 py-1.5 rounded-full font-inter"
                            style={{ backgroundColor: currentStatus.bg, color: currentStatus.text }}
                        >
                            {job.approvalStatus === "PENDING" ? "⏳ " : ""}{currentStatus.label}
                        </span>
                        <span className="text-[11px] md:text-xs lg:text-[13px] text-[#6B7280] font-inter">
                            Submitted {formatDateAgo(job.createdAt)} by {employer.companyName}
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
                            {job.title}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 md:gap-1.5 text-sm md:text-sm lg:text-base">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            Company
                        </span>
                        <span className="text-[13px] md:text-sm lg:text-[15px] font-medium text-[#111827] font-inter">
                            {employer.companyName}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 md:gap-1.5 text-sm md:text-sm lg:text-base">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            Experience
                        </span>
                        <span className="text-[13px] md:text-sm lg:text-[15px] font-medium text-[#111827] font-inter">
                            {job.workExperienceMin} - {job.workExperienceMax} years
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 md:gap-1.5 text-sm md:text-sm lg:text-base">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            Salary Per Month
                        </span>
                        <span className="text-[13px] md:text-sm lg:text-[15px] font-medium text-[#111827] font-inter">
                            {formatCurrency(job.monthlySalaryMin)} - {formatCurrency(job.monthlySalaryMax)}
                        </span>
                    </div>
                    {job.perksAndBenefits && job.perksAndBenefits.length > 0 && (
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                                Perks & Benefits
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {job.perksAndBenefits.map(
                                    (perk: string) => (
                                        <span
                                            key={perk}
                                            className="text-[10px] md:text-[11px] lg:text-xs font-medium text-[#0F766D] bg-[#EFF6F5] px-2.5 md:px-3 py-1 rounded-full font-inter"
                                        >
                                            {perk}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                    )}
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
                            {job.candidateLocationRequirement === "ANYWHERE" ? "Anywhere" : `In a specific city — ${job.location}`}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 md:gap-1.5">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            Educational Qualification
                        </span>
                        <span className="text-[13px] md:text-sm lg:text-[15px] font-medium text-[#111827] font-inter">
                            {job.candidateEducationLevel}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 md:gap-1.5">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            Preferred Gender
                        </span>
                        <span className="text-[13px] md:text-sm lg:text-[15px] font-medium text-[#111827] font-inter font-inter capitalize">
                            {job.preferredCandidateGender?.toLowerCase() || "Any"}
                        </span>
                    </div>
                    {job.requiredSkills && job.requiredSkills.length > 0 && (
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                                Required Skills
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {job.requiredSkills.map(
                                    (skill: string) => (
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
                    )}
                </div>
            </section>

            {/* ── Section 3: Screening Questions ── */}
            <section className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 flex flex-col gap-4 md:gap-4 lg:gap-5 shadow-sm border border-gray-100">
                <h2 className="text-[15px] md:text-base lg:text-lg font-bold text-[#111827] font-inter">
                    Screening Requirements
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                    <div className="flex flex-col gap-1 md:gap-1.5">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            Minimum Experience
                        </span>
                        <span className="text-[13px] md:text-sm lg:text-[15px] font-medium text-[#111827] font-inter">
                            {job.screeningExperienceMin} years
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 md:gap-1.5">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            Minimum Education
                        </span>
                        <span className="text-[13px] md:text-sm lg:text-[15px] font-medium text-[#111827] font-inter capitalize">
                            {job.screeningEducationLevel}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 md:gap-1.5">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            English Level
                        </span>
                        <span className="text-[13px] md:text-sm lg:text-[15px] font-medium text-[#111827] font-inter capitalize">
                            {job.screeningEnglishLevel}
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
                    <div 
                        className="text-xs md:text-[13px] lg:text-[14px] text-[#374151] font-inter leading-relaxed whitespace-pre-wrap [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:mb-1 [&_p]:mb-2"
                        dangerouslySetInnerHTML={{ __html: job.jobResponsibilitiesText || job.description || "N/A" }}
                    />
                    <div className="flex flex-col gap-1 md:gap-1.5 mt-4">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            About Company
                        </span>
                        <div 
                            className="text-xs md:text-[13px] lg:text-[14px] text-[#374151] font-inter leading-relaxed whitespace-pre-wrap [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_li]:mb-1 [&_p]:mb-2"
                            dangerouslySetInnerHTML={{ __html: job.aboutCompany || employer.companyDescription || "N/A" }}
                        />
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
                            {job.recruiterName || "N/A"}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 md:gap-1.5">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            Contact Number
                        </span>
                        <span className="text-[13px] md:text-sm lg:text-[15px] font-medium text-[#111827] font-inter">
                            {job.recruiterContact || "N/A"}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 md:gap-1.5">
                        <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                            Allow Calls
                        </span>
                        <span className={`text-[13px] md:text-sm lg:text-[15px] font-medium font-inter ${job.allowCalls ? "text-[#10B981]" : "text-red-500"}`}>
                            {job.allowCalls ? "Yes" : "No"}
                        </span>
                    </div>
                    {job.allowCalls && (
                        <div className="flex flex-col gap-1 md:gap-1.5">
                            <span className="text-[10px] md:text-[11px] lg:text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wide">
                                Call Timing
                            </span>
                            <span className="text-[13px] md:text-sm lg:text-[15px] font-medium text-[#111827] font-inter">
                                {job.callTimeFrom} - {job.callTimeTo}, {job.callDays}
                            </span>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Action Buttons ── */}
            {showApprovalControls && job.approvalStatus === "PENDING" && (
                <div className="flex flex-col gap-4 bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="rejectionReason" className="text-sm font-semibold text-[#374151]">
                            Reason for Rejection (Required if rejecting)
                        </label>
                        <textarea
                            id="rejectionReason"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Please explain why this job post is being rejected..."
                            className="w-full min-h-[100px] p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F766D] focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div className="flex flex-row gap-2.5 md:gap-4 lg:gap-4 lg:mt-2 w-full md:w-fit">
                        <button
                            disabled={isProcessing}
                            onClick={() => handleUpdateStatus("REJECTED")}
                            className="flex-1 md:flex-none text-[13px] md:text-sm lg:text-[15px] font-semibold text-white bg-[#EF4444] px-4 md:px-8 lg:px-10 py-3 md:py-3 lg:py-3 rounded-lg lg:rounded-[10px] hover:bg-[#DC2626] transition-colors font-inter text-center disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isProcessing ? <Loader2 size={16} className="animate-spin" /> : null}
                            Reject Job Post
                        </button>
                        <button
                            disabled={isProcessing}
                            onClick={() => handleUpdateStatus("APPROVED")}
                            className="flex-1 md:flex-none text-[13px] md:text-sm lg:text-[15px] font-semibold text-white bg-[#10B981] px-4 md:px-8 lg:px-10 py-3 md:py-3 lg:py-3 rounded-lg lg:rounded-[10px] hover:bg-[#059669] transition-colors font-inter text-center disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isProcessing ? <Loader2 size={16} className="animate-spin" /> : null}
                            Approve Job Post
                        </button>
                    </div>
                </div>
            )}

            {job.approvalStatus !== "PENDING" && (
                <div className="flex items-center gap-2 text-sm font-semibold text-[#6B7280] bg-white border border-gray-100 rounded-lg px-4 py-3 w-fit">
                    {job.approvalStatus === "APPROVED" ? (
                        <CheckCircle2 className="text-[#10B981]" size={18} />
                    ) : (
                        <XCircle className="text-red-500" size={18} />
                    )}
                    <span>This job post has been {job.approvalStatus.toLowerCase()}.</span>
                </div>
            )}
        </div>
    );
}
