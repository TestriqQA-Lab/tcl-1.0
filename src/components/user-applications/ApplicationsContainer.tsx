"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, Search, SlidersHorizontal, Briefcase, Zap, MessageSquare, Award, Loader2 } from "lucide-react";
import { ApplicationTable } from "./ApplicationTable";
import { ApplicationSlideOver } from "./ApplicationSlideOver";
import { getUserApplicationsAction } from "@/actions/job.actions";
import type { ApplicationMock } from "@/data/applications-mock";

export const ApplicationsContainer = () => {
    const [applications, setApplications] = useState<ApplicationMock[]>([]);
    const [appStats, setAppStats] = useState({ total: 0, pending: 0, reviewed: 0, rejected: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const [selectedApp, setSelectedApp] = useState<ApplicationMock | null>(null);
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(4);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const LOAD_BATCH = 4;

    // Fetch real data from the server
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const result = await getUserApplicationsAction();
                if (result.success && result.applications) {
                    setApplications(result.applications as unknown as ApplicationMock[]);
                    setAppStats(result.stats || { total: 0, pending: 0, reviewed: 0, rejected: 0 });
                }
            } catch (error) {
                console.error("Error fetching applications:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const stats = [
        { label: "Total", value: appStats.total, icon: Briefcase, color: "text-[#0f766d]", bg: "bg-[#e8f5f3]" },
        { label: "Pending", value: appStats.pending, icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Reviewed", value: appStats.reviewed, icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Rejected", value: appStats.rejected, icon: Award, color: "text-red-500", bg: "bg-red-50" },
    ];

    // Filtered data
    const filteredData = useMemo(() => {
        let result = applications;

        // Status filter
        if (activeFilter !== "All") {
            result = result.filter((app) => app.status === activeFilter);
        }

        // Search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (app) =>
                    app.jobTitle.toLowerCase().includes(q) ||
                    app.company.toLowerCase().includes(q) ||
                    app.location.toLowerCase().includes(q)
            );
        }

        return result;
    }, [activeFilter, searchQuery, applications]);

    const visibleData = filteredData.slice(0, visibleCount);
    const hasMore = visibleCount < filteredData.length;

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        setVisibleCount(LOAD_BATCH); // reset on filter change
    };

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleCount((prev) => prev + LOAD_BATCH);
            setIsLoadingMore(false);
        }, 300);
    };

    const handleViewDetails = (app: ApplicationMock) => {
        setSelectedApp(app);
        setIsSlideOverOpen(true);
    };

    const handleCloseSlideOver = () => {
        setIsSlideOverOpen(false);
        setTimeout(() => setSelectedApp(null), 500);
    };

    if (isLoading) {
        return (
            <div className="w-full pb-10">
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[#0f766d] animate-spin mb-4" />
                    <p className="text-gray-500 text-sm">Loading your applications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full pb-10">

            {/* ── Header with Inline Stats ─────────────────────────────── */}
            <div className="flex flex-col gap-5 mb-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0e1b1a] tracking-tight">
                            My Applications
                        </h1>
                        <p className="text-gray-500 text-sm sm:text-[15px] mt-1">
                            Track, manage, and stay on top of your job search journey.
                        </p>

                        {/* ── Inline Stats ──────────────────────────────── */}
                        <div className="grid grid-cols-4 sm:flex sm:items-center gap-2 sm:gap-3 mt-4">
                            {stats.map((s) => (
                                <div
                                    key={s.label}
                                    className={`inline-flex items-center justify-center sm:justify-start gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-100 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow duration-200`}
                                >
                                    <div className={`w-5 h-5 rounded-md ${s.bg} flex items-center justify-center shrink-0`}>
                                        <s.icon className={`w-3 h-3 ${s.color}`} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-gray-500 font-medium hidden sm:inline">{s.label}</span>
                                    <span className="text-[#0e1b1a] font-bold">{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Search Bar ───────────────────────────────────────────── */}
            <div className="mb-4 flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by job title, company, or location..."
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl
                            placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f766d]/20 focus:border-[#0f766d]
                            transition-all duration-200"
                    />
                </div>
                <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden shrink-0 w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                </button>
            </div>

            {/* ── Table / Cards ─────────────────────────────────────────── */}
            <ApplicationTable
                data={visibleData}
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                onViewDetails={handleViewDetails}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                isLoadingMore={isLoadingMore}
                totalCount={filteredData.length}
                isMobileFilterOpen={isMobileFilterOpen}
                onToggleMobileFilter={() => setIsMobileFilterOpen(false)}
            />

            {/* ── No Results ───────────────────────────────────────────── */}
            {filteredData.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Search className="w-7 h-7 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium text-sm">
                        {applications.length === 0
                            ? "You haven't applied to any jobs yet. Start browsing jobs!"
                            : "No applications match your search."}
                    </p>
                    {applications.length > 0 && (
                        <button
                            onClick={() => { setSearchQuery(""); setActiveFilter("All"); }}
                            className="mt-3 text-[#0f766d] font-semibold text-sm hover:underline"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            )}

            {/* ── Slide-over ───────────────────────────────────────────── */}
            <ApplicationSlideOver
                isOpen={isSlideOverOpen}
                onClose={handleCloseSlideOver}
                application={selectedApp}
            />
        </div>
    );
};
