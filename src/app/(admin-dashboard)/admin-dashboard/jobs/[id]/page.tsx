import React from "react";
import { type Metadata } from "next";
import JobPostingDetailsContent from "@/components/admin-dashboard/JobPostingDetailsContent";

export const metadata: Metadata = {
    title: "Job Post Verification | Admin Dashboard",
    description: "Verify and approve or reject job postings.",
};

export default function JobPostingDetailsPage() {
    return <JobPostingDetailsContent />;
}
