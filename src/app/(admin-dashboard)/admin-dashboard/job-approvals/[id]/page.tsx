import React from "react";
import { type Metadata } from "next";
import JobPostingDetailsContent from "@/components/admin-dashboard/JobPostingDetailsContent";

export const metadata: Metadata = {
    title: "Job Post Verification | Admin Dashboard",
    description: "Verify and approve or reject job postings.",
};

export default function JobApprovalDetailsPage() {
    // In approval context, we show the Approve/Reject controls
    // and route the "Back" button to /admin-dashboard/job-approvals
    return (
        <JobPostingDetailsContent
            showApprovalControls={true}
            backUrl="/admin-dashboard/job-approvals"
        />
    );
}
