"use client";

import React, { useEffect } from "react";
import {
    ChevronDown,
    ArrowUpDown,
    MapPin,
    Clock,
    Sparkles,
    ExternalLink,
    MoreHorizontal,
    Briefcase,
} from "lucide-react";
import { ApplicationMock, ApplicationStatus } from "@/data/applications-mock";

interface ApplicationTableProps {
    data: ApplicationMock[];
    activeFilter: string;
    onFilterChange: (filter: string) => void;
    onViewDetails: (app: ApplicationMock) => void;
    hasMore: boolean;
    onLoadMore: () => void;
    isLoadingMore: boolean;
    totalCount: number;
    isMobileFilterOpen: boolean;
    onToggleMobileFilter: () => void;
}

const statusConfig: Record<ApplicationStatus, { dot: string; text: string; bg: string; border: string }> = {
    Pending: { dot: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
    Reviewed: { dot: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
    Rejected: { dot: "bg-red-400", text: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
};

const filters = ["All", "Pending", "Reviewed", "Rejected"];

export const ApplicationTable = ({ data, activeFilter, onFilterChange, onViewDetails, hasMore, onLoadMore, isLoadingMore, totalCount, isMobileFilterOpen, onToggleMobileFilter }: ApplicationTableProps) => {

    // Lock body scroll when mobile filter panel is open
    useEffect(() => {
        if (isMobileFilterOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isMobileFilterOpen]);

    const handleMobileFilterSelect = (filter: string) => {
        onFilterChange(filter);
        onToggleMobileFilter();
    };

    const renderStatusPill = (status: ApplicationStatus) => {
        const cfg = statusConfig[status];
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {status}
            </span>
        );
    };

    const renderMatchScore = (score: number) => {
        let color = "text-emerald-600";
        if (score < 70) color = "text-amber-600";
        if (score < 50) color = "text-red-500";
        return (
            <div className="flex items-center gap-1.5">
                <Sparkles className={`w-3.5 h-3.5 ${color}`} />
                <span className={`text-sm font-bold ${color}`}>{score}%</span>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">

            {/* ── Filter Bar (Desktop only) ──────────────────────────── */}
            <div className="hidden lg:flex px-4 sm:px-6 py-4 border-b border-gray-100 sm:items-center justify-between gap-3">
                {/* Filters — scrollable on mobile */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                    {filters.map((f) => {
                        const isActive = activeFilter === f;
                        return (
                            <button
                                key={f}
                                onClick={() => onFilterChange(f)}
                                className={`whitespace-nowrap text-[13px] font-semibold px-3.5 py-1.5 rounded-lg transition-all duration-200
                                    ${isActive
                                        ? "bg-[#0f766d] text-white shadow-sm"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                {f}
                            </button>
                        );
                    })}
                </div>

                {/* Sort */}
                <button className="hidden sm:flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-[#0f766d] transition-colors shrink-0">
                    <ArrowUpDown className="w-3.5 h-3.5" /> Sort by Date
                </button>
            </div>

            {/* ── Mobile Card List ─────────────────────────────────────── */}
            <div className="block lg:hidden divide-y divide-gray-100">
                {data.map((app) => (
                    <button
                        key={app.id}
                        onClick={() => onViewDetails(app)}
                        className="w-full text-left px-4 py-4 hover:bg-gray-50/60 transition-colors active:bg-gray-100 focus:outline-none"
                    >
                        <div className="flex gap-3">
                            {/* Avatar */}
                            <div className={`w-10 h-10 rounded-xl ${app.companyColor} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}>
                                {app.companyInitials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-bold text-[#0e1b1a] truncate">{app.jobTitle}</h4>
                                        <p className="text-xs text-gray-500 font-medium truncate">{app.company}</p>
                                    </div>
                                    {renderStatusPill(app.status)}
                                </div>
                                <div className="flex items-center gap-3 mt-2.5 text-[11px] text-gray-400 font-medium">
                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{app.location}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{app.daysAgo}d ago</span>
                                    {renderMatchScore(app.matchScore)}
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* ── Desktop Table ────────────────────────────────────────── */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/40">
                            <th className="pl-6 pr-3 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Job Role & Company</th>
                            <th className="px-3 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Location</th>
                            <th className="px-3 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Applied</th>
                            <th className="px-3 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Match</th>
                            <th className="px-3 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.map((app) => (
                            <tr
                                key={app.id}
                                className="group hover:bg-[#f0fdf9]/50 transition-colors duration-200 cursor-pointer"
                                onClick={() => onViewDetails(app)}
                            >
                                {/* Job + Company */}
                                <td className="pl-6 pr-3 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl ${app.companyColor} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}>
                                            {app.companyInitials}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-[#0e1b1a] truncate group-hover:text-[#0f766d] transition-colors">{app.jobTitle}</p>
                                            <p className="text-xs text-gray-500 font-medium">{app.company}</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Location */}
                                <td className="px-3 py-4">
                                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                        <span className="truncate max-w-[140px]">{app.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                                        <Briefcase className="w-3 h-3 shrink-0" />
                                        {app.workMode} · {app.jobType}
                                    </div>
                                </td>

                                {/* Date Applied */}
                                <td className="px-3 py-4">
                                    <p className="text-sm text-gray-700 font-medium">{app.dateApplied}</p>
                                    <p className="text-xs text-gray-400">{app.daysAgo} days ago</p>
                                </td>

                                {/* Match */}
                                <td className="px-3 py-4">
                                    {renderMatchScore(app.matchScore)}
                                </td>

                                {/* Status */}
                                <td className="px-3 py-4">
                                    {renderStatusPill(app.status)}
                                </td>

                                {/* Action */}
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onViewDetails(app); }}
                                            className="opacity-0 group-hover:opacity-100 text-xs font-semibold text-[#0f766d] bg-[#e8f5f3] hover:bg-[#d1ede9] px-3 py-1.5 rounded-lg transition-all duration-200"
                                        >
                                            View Details
                                        </button>
                                        <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Load More / Count ──────────────────────────────────── */}
            <div className="px-4 sm:px-6 py-5 border-t border-gray-100 flex flex-col items-center gap-3">
                <p className="text-xs text-gray-400 font-medium">
                    Showing <span className="text-[#0e1b1a] font-bold">{data.length}</span> of <span className="text-[#0e1b1a] font-bold">{totalCount}</span> applications
                </p>
                {hasMore && (
                    <button
                        onClick={onLoadMore}
                        disabled={isLoadingMore}
                        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-white border border-gray-200 hover:border-[#0f766d] hover:text-[#0f766d] hover:bg-[#f0fdf9] text-gray-700 font-semibold text-sm px-8 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoadingMore ? (
                            <>
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Loading...
                            </>
                        ) : (
                            "Load More Applications"
                        )}
                    </button>
                )}
            </div>

            {/* ── Mobile Filter Bottom Sheet ───────────────────────────── */}
            {/* Backdrop */}
            <div
                className={`lg:hidden fixed inset-0 bg-black/30 z-50 transition-opacity duration-300
                    ${isMobileFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={onToggleMobileFilter}
            />

            {/* Sheet */}
            <div
                className={`lg:hidden fixed inset-x-0 bottom-0 z-[60] bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)]
                    transition-transform duration-400 ease-out
                    ${isMobileFilterOpen ? "translate-y-0" : "translate-y-full"}`}
            >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-2">
                    <div className="w-10 h-1 rounded-full bg-gray-300" />
                </div>

                {/* Header */}
                <div className="px-5 pb-3 border-b border-gray-100">
                    <h3 className="text-base font-bold text-[#0e1b1a]">Filter Applications</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Select a status to filter by</p>
                </div>

                {/* Filter Options */}
                <div className="px-5 py-4 space-y-2">
                    {["All", "Pending", "Reviewed", "Rejected"].map((f) => {
                        const isActive = activeFilter === f;
                        return (
                            <button
                                key={f}
                                onClick={() => handleMobileFilterSelect(f)}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                                    ${isActive
                                        ? "bg-[#0f766d] text-white shadow-sm"
                                        : "text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-100"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{f}</span>
                                    {isActive && (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Safe area padding */}
                <div className="h-6" />
            </div>
        </div>
    );
};
