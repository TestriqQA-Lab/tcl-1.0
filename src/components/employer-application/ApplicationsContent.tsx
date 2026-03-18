"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ActiveJobsStrip } from "./ActiveJobsStrip";
import { StatusFilterTabs } from "./StatusFilterTabs";
import { ApplicantsTable } from "./ApplicantsTable";
import { ApplicationsPagination } from "./ApplicationsPagination";
import { FilterPanel } from "./FilterPanel";
import { Search, SlidersHorizontal, Download } from "lucide-react";
import { getEmployerJobsAction, getEmployerApplicationsAction } from "@/actions/employer.application.actions";

export function ApplicationsContent() {
    const [selectedJob, setSelectedJob] = useState("all");
    const [selectedCount, setSelectedCount] = useState(0);
    const [filterOpen, setFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeStatus, setActiveStatus] = useState("All");
    
    // Real Data State
    const [applicants, setApplicants] = useState<any[]>([]);
    const [jobsList, setJobsList] = useState<any[]>([]);
    const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
        "All": 0, "In Review": 0, "Shortlisted": 0, "Rejected": 0
    });
    const [isLoading, setIsLoading] = useState(true);

    const searchParams = useSearchParams();

    const urlJobId = searchParams.get("jobId");

    useEffect(() => {
        setSelectedJob(urlJobId || "all");
        
        // Initial fetch for jobs
        const fetchJobs = async () => {
            const result = await getEmployerJobsAction();
            if (result.data) {
                setJobsList(result.data);
            }
        };
        fetchJobs();
    }, [urlJobId]);

    useEffect(() => {
        const fetchApps = async () => {
            setIsLoading(true);
            const result = await getEmployerApplicationsAction({
                jobId: selectedJob,
                status: activeStatus,
                searchQuery
            });
            if (result.data) {
                setApplicants(result.data);
                if (result.counts) {
                    setStatusCounts(result.counts);
                }
            }
            setIsLoading(false);
        };
        
        const timer = setTimeout(() => {
            fetchApps();
        }, 300); // Small debounce for search

        return () => clearTimeout(timer);
    }, [selectedJob, activeStatus, searchQuery]);

    return (
        <>
            {/* Desktop: Applications Bar */}
            <div className="hidden lg:flex items-center justify-between w-full h-[72px] px-10 bg-white border-b border-[#E2E8F0]">
                <div className="flex items-center gap-4">
                    <h1 className="text-[22px] font-bold text-[#0e1b1a] tracking-[-0.5px]">
                        Applications
                    </h1>
                    <span className="px-2.5 py-1 bg-[#0f766d]/8 text-[#0f766d] text-xs font-semibold rounded-full min-w-[60px] text-center">
                        {isLoading ? "..." : applicants.length} total
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 w-[240px] h-[38px] px-3 bg-[#F1F5F9] rounded-lg border border-[#E2E8F0]">
                        <Search size={16} className="text-[#94A3B8]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search applicants..."
                            className="bg-transparent text-[13px] text-[#0e1b1a] placeholder-[#94A3B8] outline-none w-full"
                        />
                    </div>
                    <button onClick={() => setFilterOpen(true)} className="flex items-center gap-1.5 h-[38px] px-3.5 bg-white rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFB] transition-colors">
                        <SlidersHorizontal size={16} className="text-[#64748B]" />
                        <span className="text-[13px] font-medium text-[#64748B]">Filters</span>
                    </button>
                    <button
                        disabled={selectedCount === 0}
                        className={`flex items-center gap-1.5 h-[38px] px-3.5 rounded-lg border transition-colors ${selectedCount > 0
                            ? "bg-[#0f766d] border-[#0f766d] text-white hover:bg-[#0d635c]"
                            : "bg-white border-[#E2E8F0] text-[#CBD5E1] cursor-not-allowed"
                            }`}
                    >
                        <Download size={16} />
                        <span className="text-[13px] font-medium">
                            Export{selectedCount > 0 ? ` (${selectedCount})` : ""}
                        </span>
                    </button>
                </div>
            </div>

            {/* Tablet/Mobile Header */}
            <div className="lg:hidden px-4 md:px-6 pt-5 pb-3">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg md:text-xl font-bold text-[#0e1b1a]">
                            Applications
                        </h1>
                        <span className="px-2.5 py-0.5 bg-[#0f766d]/8 text-[#0f766d] text-[11px] font-semibold rounded-full">
                            {isLoading ? "..." : applicants.length}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setFilterOpen(true)} className="flex items-center gap-1.5 h-8 md:h-9 px-3 bg-white rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFB] transition-colors">
                            <SlidersHorizontal size={14} className="text-[#64748B]" />
                            <span className="text-[12px] font-medium text-[#64748B]">Filters</span>
                        </button>
                        <button
                            disabled={selectedCount === 0}
                            className={`flex items-center gap-1.5 h-8 md:h-9 px-3 rounded-lg border transition-colors ${selectedCount > 0
                                ? "bg-[#0f766d] border-[#0f766d] text-white hover:bg-[#0d635c]"
                                : "bg-white border-[#E2E8F0] text-[#CBD5E1] cursor-not-allowed"
                                }`}
                        >
                            <Download size={14} />
                            <span className="text-[12px] font-medium">
                                Export{selectedCount > 0 ? ` (${selectedCount})` : ""}
                            </span>
                        </button>
                    </div>
                </div>
                {/* Search Bar */}
                <div className="flex items-center gap-2 h-10 px-3 bg-[#F1F5F9] rounded-lg border border-[#E2E8F0]">
                    <Search size={16} className="text-[#94A3B8] shrink-0" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search applicants..."
                        className="bg-transparent text-[13px] text-[#0e1b1a] placeholder-[#94A3B8] outline-none w-full"
                    />
                </div>
            </div>

            {/* Active Jobs Strip */}
            <div className="px-4 md:px-6 lg:px-10 pt-4 lg:pt-5">
                <ActiveJobsStrip 
                    selectedJob={selectedJob} 
                    onJobChange={setSelectedJob} 
                    jobs={jobsList}
                    applicantsCount={applicants.length}
                />
            </div>

            {/* Status Filter Tabs */}
            <div className="px-4 md:px-6 lg:px-10 mt-3">
                <StatusFilterTabs 
                    activeStatus={activeStatus} 
                    selectedJob={selectedJob} 
                    onFilterChange={setActiveStatus} 
                    counts={statusCounts}
                />
            </div>

            {/* Table + Pagination */}
            <div className="flex flex-col gap-4 px-4 md:px-6 lg:px-10 py-5 lg:py-6 pb-24 md:pb-6">
                <ApplicantsTable 
                    applicants={applicants}
                    isLoading={isLoading}
                    selectedJob={selectedJob} 
                    searchQuery={searchQuery} 
                    activeStatus={activeStatus} 
                    onSelectionChange={setSelectedCount} 
                />
                {applicants.length > 20 && <ApplicationsPagination />}
            </div>

            {/* Filter Panel */}
            <FilterPanel
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                showJobTitle={selectedJob === "all"}
            />
        </>
    );
}
