import React from "react";
import { type Metadata } from "next";
import JobApprovalsContent from "@/components/admin-dashboard/JobApprovalsContent";

export const metadata: Metadata = {
    title: "Job Approvals | Admin Dashboard",
    description: "Review pending job postings and approve or reject them.",
};

export default function JobApprovalsPage() {
    return <JobApprovalsContent />;
}
