"use client";

import { useState } from "react";
import { SearchJobCard } from "@/components/search/SearchJobCard";
import { SEARCH_JOBS, JOB_TYPE_FILTERS, DATE_POSTED_FILTERS } from "@/data/search-mock-data";

export default function SearchPage() {
    const [searchKeyword, setSearchKeyword] = useState("Product Designer");
    const [searchLocation, setSearchLocation] = useState("Bengaluru");
    const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>(["Full-time"]);
    const [selectedDateFilter, setSelectedDateFilter] = useState("Last 7 days");
    const [showMobileFilters, setShowMobileFilters] = useState(false);

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
                        <button className="w-full md:w-auto rounded-xl bg-[#0f766d] px-8 py-3 font-bold text-white shadow-lg shadow-[#0f766d]/20 hover:bg-[#0f766d]/90 active:scale-[0.98] transition-all">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Header */}
            <div className="max-w-7xl mx-auto md:px-2 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-md md:text-lg font-bold text-slate-900">
                            238 jobs found for '{searchKeyword}' in {searchLocation}
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-3 text-sm">
                        <span className="text-slate-500">Sort by</span>
                        <select className="border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#0f766d]">
                            <option>Most Relevant</option>
                            <option>Latest</option>
                            <option>Salary: High to Low</option>
                        </select>
                    </div>
                    {/* Mobile Filter Button */}
                    <button
                        className="md:hidden flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold"
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
            <div className="max-w-7xl mx-auto pb-12">
                <div className="flex gap-8">
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
                                        defaultValue="150"
                                        className="w-full accent-[#0f766d]"
                                    />
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>$0</span>
                                        <span>$200k+</span>
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
                    <main className="flex-1 space-y-4">
                        {SEARCH_JOBS.map((job) => (
                            <SearchJobCard key={job.id} job={job} />
                        ))}

                        {/* Load More Button */}
                        <div className="pt-6 text-center">
                            <button className="rounded-full border-2 border-slate-200 bg-white px-8 py-3 text-sm font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                                Load more jobs
                            </button>
                        </div>
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
                            onClick={() => setShowMobileFilters(false)}
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
