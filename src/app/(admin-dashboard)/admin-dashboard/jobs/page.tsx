import React from "react";
import { type Metadata } from "next";
import JobPostingsContent from "@/components/admin-dashboard/JobPostingsContent";

export const metadata: Metadata = {
    title: "Job Postings | Admin Dashboard",
    description: "Manage all job postings on the platform.",
};

export default function JobPostingsPage() {
    return <JobPostingsContent />;
}
