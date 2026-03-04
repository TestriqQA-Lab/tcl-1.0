"use client";

import { useState } from "react";
import { ActiveJobsStrip } from "./ActiveJobsStrip";
import { StatusFilterTabs } from "./StatusFilterTabs";
import { ApplicantsTable } from "./ApplicantsTable";
import { ApplicationsPagination } from "./ApplicationsPagination";

export function ApplicationsContent() {
    const [selectedJob, setSelectedJob] = useState("all");

    return (
        <>
            {/* Active Jobs Strip */}
            <div className="px-4 md:px-6 lg:px-10 pt-4 lg:pt-5">
                <ActiveJobsStrip selectedJob={selectedJob} onJobChange={setSelectedJob} />
            </div>

            {/* Status Filter Tabs */}
            <div className="px-4 md:px-6 lg:px-10 mt-3">
                <StatusFilterTabs />
            </div>

            {/* Table + Pagination */}
            <div className="flex flex-col gap-4 px-4 md:px-6 lg:px-10 py-5 lg:py-6 pb-24 md:pb-6">
                <ApplicantsTable selectedJob={selectedJob} />
                <ApplicationsPagination />
            </div>
        </>
    );
}
