"use client";

import { useState, useEffect } from "react";
import { Eye, MoreHorizontal } from "lucide-react";
import { ApplicantStatusDropdown, ApplicationStatus } from "./ApplicantStatusDropdown";
import { ApplicantDetailsModal } from "./ApplicantDetailsModal";
interface ApplicantsTableProps {
    applicants: any[];
    isLoading?: boolean;
    selectedJob?: string;
    searchQuery?: string;
    activeStatus?: string;
    onSelectionChange?: (count: number) => void;
}

const DEFAULT_AVATAR_COLOR = "bg-[#0f766d]";

export function ApplicantsTable({ 
    applicants = [], 
    isLoading = false,
    selectedJob = "all", 
    searchQuery = "", 
    activeStatus = "All", 
    onSelectionChange 
}: ApplicantsTableProps) {
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [viewingApplicant, setViewingApplicant] = useState<any>(null);

    // Clear selections when job filter changes
    useEffect(() => {
        setSelected(new Set());
        onSelectionChange?.(0);
    }, [selectedJob]);

    const updateSelected = (next: Set<string>) => {
        setSelected(next);
        onSelectionChange?.(next.size);
    };

    const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
        try {
            const { updateApplicationStatusAction } = await import("@/actions/employer.application.actions");
            const result = await updateApplicationStatusAction(id, newStatus);
            
            if (result.success) {
                // Update local state for immediate feedback
                // Re-fetching is handled by the parent if we want, but local update is faster
                window.location.reload(); // Simple way to ensure everything (counts, etc) is consistent
            } else {
                alert("Failed to update status: " + result.error);
            }
        } catch (error) {
            console.error("Status change error:", error);
            alert("An unexpected error occurred.");
        }
    };

    const filtered = applicants; // Filtering is now done in the server action

    const allFilteredIds = filtered.map((a) => a.id);
    const allSelected = filtered.length > 0 && allFilteredIds.every((id) => selected.has(id));
    const someSelected = allFilteredIds.some((id) => selected.has(id));

    const toggleAll = () => {
        if (allSelected) {
            const next = new Set(selected);
            allFilteredIds.forEach((id) => next.delete(id));
            updateSelected(next);
        } else {
            const next = new Set(selected);
            allFilteredIds.forEach((id) => next.add(id));
            updateSelected(next);
        }
    };

    const toggleOne = (id: string) => {
        const next = new Set(selected);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        updateSelected(next);
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl border border-[#E2E8F0] flex flex-col items-center justify-center py-20 px-6">
                <div className="animate-spin size-10 border-4 border-[#0f766d] border-t-transparent rounded-full mb-4" />
                <span className="text-[15px] font-medium text-[#64748B]">Loading applications...</span>
            </div>
        );
    }

    if (filtered.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-[#E2E8F0] flex flex-col items-center justify-center py-16 px-6">
                <div className="size-14 bg-[#F1F5F9] rounded-full flex items-center justify-center mb-4">
                    <Eye size={24} className="text-[#94A3B8]" />
                </div>
                <span className="text-[15px] font-semibold text-[#0e1b1a] mb-1">No applications found</span>
                <span className="text-[13px] text-[#94A3B8] text-center">
                    No results match your current filters or search query.
                </span>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-[#E2E8F0]">
            {/* Header Banner */}
            {(selected.size > 0 || selectedJob !== "all") && (
                <div className="flex items-center justify-between px-5 md:px-6 py-2.5 bg-[#0f766d]/5 border-b border-[#E2E8F0]">
                    <div className="flex items-center gap-2.5">
                        {selected.size > 0 ? (
                            <span className="text-[13px] font-semibold text-[#0f766d]">
                                {selected.size} applicant{selected.size !== 1 ? "s" : ""} selected
                            </span>
                        ) : (
                            <>
                                <div className="size-2 bg-[#0f766d] rounded-full" />
                                <span className="text-[13px] font-semibold text-[#0e1b1a]">
                                    {filtered[0]?.jobTitle || "Job View"}
                                </span>
                            </>
                        )}
                    </div>
                    {selected.size > 0 && (
                        <button
                            onClick={() => updateSelected(new Set())}
                            className="text-[12px] font-medium text-[#0f766d] hover:text-[#0d635c] underline transition-colors"
                        >
                            Clear Selection
                        </button>
                    )}
                </div>
            )}

            {/* ===== Desktop Table (lg+) ===== */}
            <div className="hidden lg:block">
                {/* Column Headers */}
                <div className="flex items-center px-6 py-3.5 bg-[#F8FAFB]">
                    <div className="w-9 shrink-0">
                        <input
                            type="checkbox"
                            checked={allSelected}
                            ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                            onChange={toggleAll}
                            className="size-4 rounded border-[#CBD5E1] accent-[#0f766d] cursor-pointer"
                        />
                    </div>
                    <span className="flex-1 text-xs font-semibold text-[#64748B]">Candidate</span>
                    <span className="flex-1 text-xs font-semibold text-[#64748B]">Position Applied</span>
                    <span className="w-[110px] text-xs font-semibold text-[#64748B]">Experience</span>
                    <span className="w-[100px] text-xs font-semibold text-[#64748B]">Notice Period</span>
                    <span className="w-[120px] text-xs font-semibold text-[#64748B]">Status</span>
                    <span className="w-[110px] text-xs font-semibold text-[#64748B]">Applied Date</span>
                    <span className="w-[80px] text-xs font-semibold text-[#64748B]">Actions</span>
                </div>

                {/* Rows */}
                {filtered.map((app, i) => {
                    const isChecked = selected.has(app.id);
                    return (
                        <div
                            key={app.id}
                            className={`flex items-center px-6 py-3.5 transition-colors ${isChecked ? "bg-[#0f766d]/5" : "hover:bg-[#F8FAFB]"
                                } ${i < filtered.length - 1 ? "border-b border-[#F1F5F9]" : ""}`}
                        >
                            <div className="w-9 shrink-0">
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleOne(app.id)}
                                    className="size-4 rounded border-[#CBD5E1] accent-[#0f766d] cursor-pointer"
                                />
                            </div>
                            <div className="flex-1 flex items-center gap-2.5 min-w-0">
                                <div className={`size-9 rounded-full flex items-center justify-center shrink-0 ${DEFAULT_AVATAR_COLOR}`}>
                                    <span className="text-white text-[11px] font-bold">{app.initials}</span>
                                </div>
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <span className="text-[13px] font-semibold text-[#0e1b1a] truncate">{app.name}</span>
                                    <span className="text-[11px] text-[#94A3B8] truncate">{app.email}</span>
                                </div>
                            </div>
                            <span className="flex-1 text-[13px] text-[#334155] truncate">{app.position}</span>
                            <span className="w-[110px] text-[13px] text-[#64748B]">{app.experience}</span>
                            <div className="w-[100px]">
                                <span className="text-[12px] font-medium text-[#0f766d] bg-[#f0fdf4] px-2 py-0.5 rounded border border-[#bbf7d0]">
                                    {app.noticePeriod.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="w-[120px]">
                                <ApplicantStatusDropdown
                                    currentStatus={app.status as ApplicationStatus}
                                    onStatusChange={(newStatus) => handleStatusChange(app.id, newStatus)}
                                />
                            </div>
                            <span className="w-[110px] text-xs text-[#94A3B8]">{app.date}</span>
                            <div className="w-[80px] flex items-center gap-2">
                                <button 
                                    onClick={() => {
                                        setViewingApplicant(app);
                                        setIsDetailsModalOpen(true);
                                    }}
                                    className="size-8 flex items-center justify-center rounded-md hover:bg-[#F1F5F9] transition-colors"
                                >
                                    <Eye size={16} className="text-[#94A3B8]" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ===== Tablet Table (md to lg) ===== */}
            <div className="hidden md:block lg:hidden">
                {/* Column Headers */}
                <div className="grid grid-cols-[36px_1fr_1fr_100px_80px] items-center px-5 py-2.5 bg-[#F8FAFB]">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                        onChange={toggleAll}
                        className="size-4 rounded border-[#CBD5E1] accent-[#0f766d] cursor-pointer"
                    />
                    <span className="text-[11px] font-semibold text-[#64748B]">Candidate</span>
                    <span className="text-[11px] font-semibold text-[#64748B]">Position</span>
                    <span className="text-[11px] font-semibold text-[#64748B]">Status</span>
                    <span className="text-[11px] font-semibold text-[#64748B]">Date</span>
                </div>

                {/* Rows */}
                {filtered.map((app, i) => {
                    const isChecked = selected.has(app.id);
                    return (
                        <div
                            key={app.id}
                            className={`grid grid-cols-[36px_1fr_1fr_100px_80px] items-center px-5 py-3 transition-colors ${isChecked ? "bg-[#0f766d]/5" : ""
                                } ${i < filtered.length - 1 ? "border-b border-[#F1F5F9]" : ""}`}
                        >
                            <div className="flex items-center justify-between px-5 py-3 border-b border-[#F1F5F9]">
                                <div className="flex items-center gap-2.5">
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => toggleOne(app.id)}
                                        className="size-4 rounded border-[#CBD5E1] accent-[#0f766d] cursor-pointer"
                                    />
                                    <div 
                                        className={`size-8 rounded-full flex items-center justify-center shrink-0 cursor-pointer ${DEFAULT_AVATAR_COLOR}`}
                                        onClick={() => {
                                            setViewingApplicant(app);
                                            setIsDetailsModalOpen(true);
                                        }}
                                    >
                                        <span className="text-white text-[10px] font-bold">{app.initials}</span>
                                    </div>
                                    <span 
                                        className="text-[13px] font-medium text-[#0e1b1a] truncate cursor-pointer"
                                        onClick={() => {
                                            setViewingApplicant(app);
                                            setIsDetailsModalOpen(true);
                                        }}
                                    >
                                        {app.name}
                                    </span>
                                </div>
                                <span className="text-[13px] text-[#334155] truncate">{app.position}</span>
                            </div>
                            <ApplicantStatusDropdown
                                currentStatus={app.status as ApplicationStatus}
                                onStatusChange={(newStatus) => handleStatusChange(app.id, newStatus)}
                            />
                            <span className="text-xs text-[#94A3B8]">{app.date}</span>
                        </div>
                    );
                })}
            </div>

            {/* ===== Mobile Card List (below md) ===== */}
            <div className="md:hidden flex flex-col">
                {filtered.map((app, i) => {
                    const isChecked = selected.has(app.id);
                    return (
                        <div
                            key={app.id}
                            className={`p-4 transition-colors ${isChecked ? "bg-[#0f766d]/5" : ""
                                } ${i < filtered.length - 1 ? "border-b border-[#F1F5F9]" : ""}`}
                        >
                            {/* Top: Checkbox + Avatar + Name/Email + Status */}
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2.5">
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => toggleOne(app.id)}
                                        className="size-4 rounded border-[#CBD5E1] accent-[#0f766d] cursor-pointer mt-0.5"
                                    />
                                    <div 
                                        className={`size-10 rounded-full flex items-center justify-center shrink-0 cursor-pointer ${DEFAULT_AVATAR_COLOR}`}
                                        onClick={() => {
                                            setViewingApplicant(app);
                                            setIsDetailsModalOpen(true);
                                        }}
                                    >
                                        <span className="text-white text-xs font-bold">{app.initials}</span>
                                    </div>
                                    <div 
                                        className="flex flex-col gap-0.5 cursor-pointer"
                                        onClick={() => {
                                            setViewingApplicant(app);
                                            setIsDetailsModalOpen(true);
                                        }}
                                    >
                                        <span className="text-[14px] font-semibold text-[#0e1b1a]">{app.name}</span>
                                        <span className="text-[11px] text-[#94A3B8]">{app.email}</span>
                                    </div>
                                </div>
                                <ApplicantStatusDropdown
                                    currentStatus={app.status as ApplicationStatus}
                                    onStatusChange={(newStatus) => handleStatusChange(app.id, newStatus)}
                                />
                            </div>
                            {/* Bottom: Position + Experience + Date */}
                            <div className="flex items-center justify-between text-[12px] text-[#64748B] ml-[66px]">
                                <span>{app.position} • {app.experience} • <span className="text-[#0f766d] font-semibold">{app.noticePeriod.replace('_', ' ')}</span></span>
                                <span className="text-[#94A3B8]">{app.date}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Applicant Details Modal */}
            <ApplicantDetailsModal 
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                applicant={viewingApplicant}
            />
        </div>
    );
}
