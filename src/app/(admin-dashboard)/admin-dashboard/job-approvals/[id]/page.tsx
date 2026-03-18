import React from "react";
import { type Metadata } from "next";
import JobPostingDetailsContent from "@/components/admin-dashboard/JobPostingDetailsContent";

export const metadata: Metadata = {
    title: "Job Post Verification | Admin Dashboard",
    description: "Verify and approve or reject job postings.",
};

export default function JobApprovalDetailsPage({ params }: { params: { id: string } }) {
    const { id } = React.use(params as any) as any;
    // In approval context, we show the Approve/Reject controls
    // and route the "Back" button to /admin-dashboard/job-approvals
    return (
        <JobPostingDetailsContent
            jobId={id}
            showApprovalControls={true}
            backUrl="/admin-dashboard/job-approvals"
        />
    );
}
