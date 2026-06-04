"use client";

import { useState } from "react";
import { X, ChevronDown, Search, MapPin, Briefcase, Clock } from "lucide-react";

const statuses = [
    { label: "Shortlisted", color: "bg-[#DCFCE7] text-[#16A34A]" },
    { label: "In Review", color: "bg-[#FEF3C7] text-[#D97706]" },
    { label: "Interview", color: "bg-[#DBEAFE] text-[#2563EB]" },
    { label: "Rejected", color: "bg-[#FEE2E2] text-[#EF4444]" },
];

interface FilterPanelProps {
    open: boolean;
    onClose: () => void;
    showJobTitle: boolean;
}

export function FilterPanel({ open, onClose, showJobTitle }: FilterPanelProps) {
    const [jobTitle, setJobTitle] = useState("");
    const [location, setLocation] = useState("");
    const [experience, setExperience] = useState("");
    const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());
    const [expandedSection, setExpandedSection] = useState<string | null>(
        showJobTitle ? "jobTitle" : "location"
    );

    const toggleStatus = (label: string) => {
        const next = new Set(selectedStatuses);
        if (next.has(label)) next.delete(label);
        else next.add(label);
        setSelectedStatuses(next);
    };

    const hasFilters =
        jobTitle.trim() !== "" ||
        location.trim() !== "" ||
        experience.trim() !== "" ||
        selectedStatuses.size > 0;

    const totalCount =
        (jobTitle.trim() ? 1 : 0) +
        (location.trim() ? 1 : 0) +
        (experience.trim() ? 1 : 0) +
        selectedStatuses.size;

    const clearAll = () => {
        setJobTitle("");
        setLocation("");
        setExperience("");
        setSelectedStatuses(new Set());
    };

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/30 z-[200]" onClick={onClose} />

            {/* Panel */}
            <div className="fixed top-0 right-0 h-full w-[320px] md:w-[360px] bg-white z-[210] shadow-2xl flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="flex items-center justify-between px-5 h-[60px] border-b border-[#E2E8F0] shrink-0">
                    <div className="flex items-center gap-2.5">
                        <span className="text-[16px] font-bold text-[#0e1b1a]">Filters</span>
                        {totalCount > 0 && (
                            <span className="px-2 py-0.5 bg-[#0f766d] text-white text-[11px] font-semibold rounded-full">
                                {totalCount}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="size-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] transition-colors"
                    >
                        <X size={18} className="text-[#64748B]" />
                    </button>
                </div>

                {/* Filter Sections */}
                <div className="flex-1 overflow-y-auto py-2">
                    {/* Job Title (input) */}
                    {showJobTitle && (
                        <div className="border-b border-[#F1F5F9]">
                            <button
                                onClick={() => toggleSection("jobTitle")}
                                className="flex items-center justify-between w-full px-5 py-3.5 text-left hover:bg-[#F8FAFB] transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Briefcase size={15} className="text-[#94A3B8]" />
                                    <span className="text-[14px] font-semibold text-[#0e1b1a]">Job Title</span>
                                    {jobTitle.trim() && (
                                        <span className="size-2 bg-[#0f766d] rounded-full" />
                                    )}
                                </div>
                                <ChevronDown
                                    size={16}
                                    className={`text-[#94A3B8] transition-transform duration-200 ${expandedSection === "jobTitle" ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            {expandedSection === "jobTitle" && (
                                <div className="px-5 pb-4">
                                    <div className="flex items-center gap-2 h-10 px-3 bg-[#F8FAFB] rounded-lg border border-[#E2E8F0] focus-within:border-[#0f766d] focus-within:ring-1 focus-within:ring-[#0f766d]/20 transition-all">
                                        <Search size={15} className="text-[#94A3B8] shrink-0" />
                                        <input
                                            type="text"
                                            value={jobTitle}
                                            onChange={(e) => setJobTitle(e.target.value)}
                                            placeholder="e.g. Frontend Developer"
                                            className="bg-transparent text-[13px] text-[#0e1b1a] placeholder-[#94A3B8] outline-none w-full"
                                        />
                                        {jobTitle && (
                                            <button onClick={() => setJobTitle("")} className="shrink-0">
                                                <X size={14} className="text-[#94A3B8] hover:text-[#64748B]" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Location (input) */}
                    <div className="border-b border-[#F1F5F9]">
                        <button
                            onClick={() => toggleSection("location")}
                            className="flex items-center justify-between w-full px-5 py-3.5 text-left hover:bg-[#F8FAFB] transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <MapPin size={15} className="text-[#94A3B8]" />
                                <span className="text-[14px] font-semibold text-[#0e1b1a]">Location</span>
                                {location.trim() && (
                                    <span className="size-2 bg-[#0f766d] rounded-full" />
                                )}
                            </div>
                            <ChevronDown
                                size={16}
                                className={`text-[#94A3B8] transition-transform duration-200 ${expandedSection === "location" ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {expandedSection === "location" && (
                            <div className="px-5 pb-4">
                                <div className="flex items-center gap-2 h-10 px-3 bg-[#F8FAFB] rounded-lg border border-[#E2E8F0] focus-within:border-[#0f766d] focus-within:ring-1 focus-within:ring-[#0f766d]/20 transition-all">
                                    <MapPin size={15} className="text-[#94A3B8] shrink-0" />
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="e.g. Mumbai, Bengaluru"
                                        className="bg-transparent text-[13px] text-[#0e1b1a] placeholder-[#94A3B8] outline-none w-full"
                                    />
                                    {location && (
                                        <button onClick={() => setLocation("")} className="shrink-0">
                                            <X size={14} className="text-[#94A3B8] hover:text-[#64748B]" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Experience (input) */}
                    <div className="border-b border-[#F1F5F9]">
                        <button
                            onClick={() => toggleSection("experience")}
                            className="flex items-center justify-between w-full px-5 py-3.5 text-left hover:bg-[#F8FAFB] transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <Clock size={15} className="text-[#94A3B8]" />
                                <span className="text-[14px] font-semibold text-[#0e1b1a]">Experience</span>
                                {experience.trim() && (
                                    <span className="size-2 bg-[#0f766d] rounded-full" />
                                )}
                            </div>
                            <ChevronDown
                                size={16}
                                className={`text-[#94A3B8] transition-transform duration-200 ${expandedSection === "experience" ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {expandedSection === "experience" && (
                            <div className="px-5 pb-4">
                                <div className="flex items-center gap-2 h-10 px-3 bg-[#F8FAFB] rounded-lg border border-[#E2E8F0] focus-within:border-[#0f766d] focus-within:ring-1 focus-within:ring-[#0f766d]/20 transition-all">
                                    <Clock size={15} className="text-[#94A3B8] shrink-0" />
                                    <input
                                        type="text"
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                        placeholder="e.g. 3-5 years"
                                        className="bg-transparent text-[13px] text-[#0e1b1a] placeholder-[#94A3B8] outline-none w-full"
                                    />
                                    {experience && (
                                        <button onClick={() => setExperience("")} className="shrink-0">
                                            <X size={14} className="text-[#94A3B8] hover:text-[#64748B]" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Status (checkboxes) */}
                    <div className="border-b border-[#F1F5F9]">
                        <button
                            onClick={() => toggleSection("status")}
                            className="flex items-center justify-between w-full px-5 py-3.5 text-left hover:bg-[#F8FAFB] transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-[14px] font-semibold text-[#0e1b1a]">Status</span>
                                {selectedStatuses.size > 0 && (
                                    <span className="px-1.5 py-0.5 bg-[#0f766d]/10 text-[#0f766d] text-[10px] font-bold rounded-full">
                                        {selectedStatuses.size}
                                    </span>
                                )}
                            </div>
                            <ChevronDown
                                size={16}
                                className={`text-[#94A3B8] transition-transform duration-200 ${expandedSection === "status" ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {expandedSection === "status" && (
                            <div className="px-5 pb-3 flex flex-col gap-1">
                                {statuses.map((s) => {
                                    const isChecked = selectedStatuses.has(s.label);
                                    return (
                                        <label
                                            key={s.label}
                                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${isChecked ? "bg-[#0f766d]/5" : "hover:bg-[#F8FAFB]"
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => toggleStatus(s.label)}
                                                className="size-4 rounded border-[#CBD5E1] accent-[#0f766d]"
                                            />
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[12px] font-medium ${s.color}`}>
                                                {s.label}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center gap-3 px-5 py-4 border-t border-[#E2E8F0] shrink-0">
                    <button
                        onClick={clearAll}
                        disabled={!hasFilters}
                        className="flex-1 h-10 rounded-lg border border-[#E2E8F0] text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 h-10 rounded-lg bg-[#0f766d] hover:bg-[#0d635c] text-white text-[13px] font-semibold transition-colors"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>

            {/* Slide-in animation */}
            <style jsx>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in-right {
                    animation: slideInRight 0.25s ease-out;
                }
            `}</style>
        </>
    );
}
