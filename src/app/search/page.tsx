"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SearchJobCard } from "@/components/search/SearchJobCard";
import { JOB_TYPE_FILTERS, DATE_POSTED_FILTERS } from "@/data/search-mock-data";
import { getJobs } from "@/actions/job.actions";

function SearchContent() {
    const searchParams = useSearchParams();
    
    // Read initial values from URL if they exist
    const initialKeyword = searchParams.get("keyword") || "";
    const initialLocation = searchParams.get("location") || "";

    const [searchKeyword, setSearchKeyword] = useState(initialKeyword);
    const [searchLocation, setSearchLocation] = useState(initialLocation);
    const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
    const [selectedDateFilter, setSelectedDateFilter] = useState("Last 7 days");
    const [minSalary, setMinSalary] = useState(0); // Add minSalary state (in thousands)
    const [debouncedMinSalary, setDebouncedMinSalary] = useState(0); // Debounced version for fetching
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Debounce the salary slider value
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedMinSalary(minSalary);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [minSalary]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const data = await getJobs({
                keyword: searchKeyword,
                location: searchLocation,
                jobTypes: selectedJobTypes,
                salaryMin: debouncedMinSalary * 1000, // Multiply slider value by 1000 to match DB
            });
            setJobs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [selectedJobTypes, debouncedMinSalary]); // re-fetch when filters change

    const toggleJobType = (type: string) => {
        setSelectedJobTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Search Bar Section */}
            <div className="bg-white border-b border-slate-200 py-6 my-5 rounded-xl">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1 flex items-center">
                            <span className="material-symbols-outlined absolute left-4 text-slate-400">search</span>
                            <input
                                type="text"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d] outline-none"
                                placeholder="Job title or keyword"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                            />
                        </div>
                        <div className="relative flex-1 flex items-center">
                            <span className="material-symbols-outlined absolute left-4 text-slate-400">location_on</span>
                            <input
                                type="text"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d] outline-none"
                                placeholder="Location"
                                value={searchLocation}
                                onChange={(e) => setSearchLocation(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={fetchJobs}
                            className="w-full md:w-auto rounded-xl bg-[#0f766d] px-8 py-3 font-bold text-white shadow-lg shadow-[#0f766d]/20 hover:bg-[#0f766d]/90 active:scale-[0.98] transition-all"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Header */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-6 min-w-0">
                <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <p className="text-md md:text-lg font-bold text-slate-900 truncate">
                            {jobs.length} job{jobs.length === 1 ? "" : "s"} found
                            {searchKeyword ? ` for '${searchKeyword}'` : ""}
                            {searchLocation ? ` in ${searchLocation}` : ""}
                        </p>
                    </div>

                    {/* Mobile Filter Button */}
                    <button
                        className="md:hidden flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shrink-0"
                        onClick={() => setShowMobileFilters(true)}
                    >
                        <span className="material-symbols-outlined text-sm">tune</span>
                        Filter
                        {selectedJobTypes.length > 0 && (
                            <span className="flex size-5 items-center justify-center rounded-full bg-[#0f766d] text-[10px] text-white">
                                {selectedJobTypes.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content: Sidebar + Job Listings */}
            <div className="max-w-7xl mx-auto pb-12 px-4 md:px-6 lg:px-10 min-w-0">
                <div className="flex flex-col md:flex-row gap-8 min-w-0">
                    {/* Desktop Filters Sidebar */}
                    <aside className="hidden md:block w-64 shrink-0">
                        <div className="sticky top-24 bg-white rounded-xl border border-slate-200 p-5 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-slate-900">Filters</h3>
                                <button className="text-sm text-[#0f766d] font-medium hover:underline">Clear all</button>
                            </div>

                            {/* Job Type */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Job Type</h4>
                                <div className="space-y-2">
                                    {JOB_TYPE_FILTERS.map((type) => (
                                        <label key={type} className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="size-4 rounded border-slate-300 text-[#0f766d] focus:ring-[#0f766d]"
                                                checked={selectedJobTypes.includes(type)}
                                                onChange={() => toggleJobType(type)}
                                            />
                                            <span className="text-sm text-slate-700">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Salary Range */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Salary Range</h4>
                                <div className="space-y-3">
                                    <input
                                        type="range"
                                        min="0"
                                        max="200"
                                        value={minSalary}
                                        onChange={(e) => setMinSalary(Number(e.target.value))}
                                        className="w-full accent-[#0f766d]"
                                    />
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span className="font-bold text-[#0f766d]">₹{minSalary}L</span>
                                        <span>₹200L+</span>
                                    </div>
                                </div>
                            </div>

                            {/* Date Posted */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Date Posted</h4>
                                <div className="space-y-2">
                                    {DATE_POSTED_FILTERS.map((date) => (
                                        <label key={date} className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="datePosted"
                                                className="size-4 border-slate-300 text-[#0f766d] focus:ring-[#0f766d]"
                                                checked={selectedDateFilter === date}
                                                onChange={() => setSelectedDateFilter(date)}
                                            />
                                            <span className="text-sm text-slate-700">{date}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Job Listings */}
                    <main className="flex-1 space-y-4 min-w-0 w-full overflow-hidden">
                        {loading ? (
                            <div className="flex justify-center items-center h-64 w-full">
                                <span className="material-symbols-outlined text-4xl animate-spin text-[#0f766d]">refresh</span>
                            </div>
                        ) : jobs.length > 0 ? (
                            jobs.map((job) => (
                                <SearchJobCard key={job.id} job={job} />
                            ))
                        ) : (
                            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">search_off</span>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">No jobs found</h3>
                                <p className="text-slate-500">We couldn't find any jobs matching your criteria. Try adjusting your filters.</p>
                            </div>
                        )}

                        {/* Load More Button */}
                        {jobs.length > 0 && (
                            <div className="pt-6 text-center">
                                <button className="rounded-full border-2 border-slate-200 bg-white px-8 py-3 text-sm font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                                    Load more jobs
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Mobile Filters Modal */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setShowMobileFilters(false)}>
                    <div
                        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg text-slate-900">Filters</h3>
                            <button onClick={() => setShowMobileFilters(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Job Type */}
                        <div className="mb-6">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Job Type</h4>
                            <div className="space-y-3">
                                {JOB_TYPE_FILTERS.map((type) => (
                                    <label key={type} className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="size-5 rounded border-slate-300 text-[#0f766d] focus:ring-[#0f766d]"
                                            checked={selectedJobTypes.includes(type)}
                                            onChange={() => toggleJobType(type)}
                                        />
                                        <span className="text-sm text-slate-700">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Salary Range</h4>
                            <div className="space-y-3">
                                <input
                                    type="range"
                                    min="0"
                                    max="200"
                                    value={minSalary}
                                    onChange={(e) => setMinSalary(Number(e.target.value))}
                                    className="w-full accent-[#0f766d]"
                                />
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span className="font-bold text-[#0f766d]">₹{minSalary}L</span>
                                    <span>₹200L+</span>
                                </div>
                            </div>
                        </div>

                        {/* Date Posted */}
                        <div className="mb-6">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Date Posted</h4>
                            <div className="space-y-3">
                                {DATE_POSTED_FILTERS.map((date) => (
                                    <label key={date} className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="datePostedMobile"
                                            className="size-5 border-slate-300 text-[#0f766d] focus:ring-[#0f766d]"
                                            checked={selectedDateFilter === date}
                                            onChange={() => setSelectedDateFilter(date)}
                                        />
                                        <span className="text-sm text-slate-700">{date}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            className="w-full rounded-xl bg-[#0f766d] py-4 font-bold text-white"
                            onClick={() => {
                                setShowMobileFilters(false);
                                fetchJobs();
                            }}
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#0f766d]"><span className="material-symbols-outlined text-4xl animate-spin">refresh</span></div>}>
            <SearchContent />
        </Suspense>
    );
}
