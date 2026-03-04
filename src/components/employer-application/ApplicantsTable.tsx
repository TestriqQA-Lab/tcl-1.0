"use client";

import { useState, useEffect } from "react";
import { Eye, MoreHorizontal } from "lucide-react";

const statusStyles: Record<string, { bg: string; text: string }> = {
    Shortlisted: { bg: "bg-[#DCFCE7]", text: "text-[#16A34A]" },
    "In Review": { bg: "bg-[#FEF3C7]", text: "text-[#D97706]" },
    Interview: { bg: "bg-[#DBEAFE]", text: "text-[#2563EB]" },
    Rejected: { bg: "bg-[#FEE2E2]", text: "text-[#EF4444]" },
};

const avatarColors: Record<string, string> = {
    PS: "bg-[#0f766d]",
    RM: "bg-[#6366F1]",
    AD: "bg-[#F59E0B]",
    VS: "bg-[#EF4444]",
    NK: "bg-[#8B5CF6]",
    AK: "bg-[#0EA5E9]",
    SP: "bg-[#EC4899]",
    RG: "bg-[#14B8A6]",
};

const applicants = [
    {
        id: "ps-1",
        initials: "PS",
        name: "Priya Sharma",
        email: "priya.sharma@email.com",
        position: "Sr. Frontend Developer",
        jobId: "frontend",
        experience: "5 years",
        status: "Shortlisted",
        date: "Mar 3, 2026",
    },
    {
        id: "rm-1",
        initials: "RM",
        name: "Rahul Mehta",
        email: "rahul.mehta@email.com",
        position: "Backend Engineer",
        jobId: "backend",
        experience: "3 years",
        status: "In Review",
        date: "Mar 2, 2026",
    },
    {
        id: "ad-1",
        initials: "AD",
        name: "Anita Desai",
        email: "anita.desai@email.com",
        position: "Product Designer",
        jobId: "designer",
        experience: "4 years",
        status: "Interview",
        date: "Mar 1, 2026",
    },
    {
        id: "vs-1",
        initials: "VS",
        name: "Vikram Singh",
        email: "vikram.singh@email.com",
        position: "Data Analyst",
        jobId: "analyst",
        experience: "2 years",
        status: "Rejected",
        date: "Feb 28, 2026",
    },
    {
        id: "nk-1",
        initials: "NK",
        name: "Neha Kapoor",
        email: "neha.kapoor@email.com",
        position: "DevOps Engineer",
        jobId: "devops",
        experience: "6 years",
        status: "Shortlisted",
        date: "Feb 27, 2026",
    },
    {
        id: "ak-1",
        initials: "AK",
        name: "Amit Kumar",
        email: "amit.kumar@email.com",
        position: "Sr. Frontend Developer",
        jobId: "frontend",
        experience: "4 years",
        status: "In Review",
        date: "Feb 26, 2026",
    },
    {
        id: "sp-1",
        initials: "SP",
        name: "Sneha Patel",
        email: "sneha.patel@email.com",
        position: "Backend Engineer",
        jobId: "backend",
        experience: "5 years",
        status: "Interview",
        date: "Feb 25, 2026",
    },
    {
        id: "rg-1",
        initials: "RG",
        name: "Rohan Gupta",
        email: "rohan.gupta@email.com",
        position: "Product Designer",
        jobId: "designer",
        experience: "3 years",
        status: "Shortlisted",
        date: "Feb 24, 2026",
    },
];

interface ApplicantsTableProps {
    selectedJob?: string;
}

export function ApplicantsTable({ selectedJob = "all" }: ApplicantsTableProps) {
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const filtered = selectedJob === "all"
        ? applicants
        : applicants.filter((a) => a.jobId === selectedJob);

    // Clear selections when job filter changes
    useEffect(() => {
        setSelected(new Set());
    }, [selectedJob]);

    // Get job title for the selected job
    const jobTitle = selectedJob === "all"
        ? "All Positions"
        : filtered[0]?.position ?? "Unknown";

    const allFilteredIds = filtered.map((a) => a.id);
    const allSelected = filtered.length > 0 && allFilteredIds.every((id) => selected.has(id));
    const someSelected = allFilteredIds.some((id) => selected.has(id));

    const toggleAll = () => {
        if (allSelected) {
            // Deselect all filtered
            const next = new Set(selected);
            allFilteredIds.forEach((id) => next.delete(id));
            setSelected(next);
        } else {
            // Select all filtered
            const next = new Set(selected);
            allFilteredIds.forEach((id) => next.add(id));
            setSelected(next);
        }
    };

    const toggleOne = (id: string) => {
        const next = new Set(selected);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setSelected(next);
    };

    if (filtered.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-[#E2E8F0] flex flex-col items-center justify-center py-16 px-6">
                <div className="size-14 bg-[#F1F5F9] rounded-full flex items-center justify-center mb-4">
                    <Eye size={24} className="text-[#94A3B8]" />
                </div>
                <span className="text-[15px] font-semibold text-[#0e1b1a] mb-1">No applications yet</span>
                <span className="text-[13px] text-[#94A3B8] text-center">
                    No one has applied for this position yet. Share the job post to attract candidates.
                </span>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
            {/* Selected Count Banner */}
            {selected.size > 0 && (
                <div className="flex items-center justify-between px-5 md:px-6 py-2.5 bg-[#0f766d]/10 border-b border-[#0f766d]/20">
                    <span className="text-[13px] font-semibold text-[#0f766d]">
                        {selected.size} applicant{selected.size !== 1 ? "s" : ""} selected
                    </span>
                    <button
                        onClick={() => setSelected(new Set())}
                        className="text-[12px] font-medium text-[#0f766d] hover:text-[#0d635c] underline transition-colors"
                    >
                        Clear Selection
                    </button>
                </div>
            )}

            {/* Selected Job Header */}
            {selectedJob !== "all" && selected.size === 0 && (
                <div className="flex items-center gap-2.5 px-5 md:px-6 py-3 bg-[#0f766d]/5 border-b border-[#E2E8F0]">
                    <div className="size-2 bg-[#0f766d] rounded-full" />
                    <span className="text-[13px] font-semibold text-[#0f766d]">
                        {jobTitle}
                    </span>
                    <span className="text-[11px] text-[#64748B] ml-auto">
                        {filtered.length} applicant{filtered.length !== 1 ? "s" : ""}
                    </span>
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
                    <span className="w-[120px] text-xs font-semibold text-[#64748B]">Status</span>
                    <span className="w-[110px] text-xs font-semibold text-[#64748B]">Applied Date</span>
                    <span className="w-[80px] text-xs font-semibold text-[#64748B]">Actions</span>
                </div>

                {/* Rows */}
                {filtered.map((app, i) => {
                    const style = statusStyles[app.status];
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
                                <div className={`size-9 rounded-full flex items-center justify-center shrink-0 ${avatarColors[app.initials]}`}>
                                    <span className="text-white text-[11px] font-bold">{app.initials}</span>
                                </div>
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <span className="text-[13px] font-semibold text-[#0e1b1a] truncate">{app.name}</span>
                                    <span className="text-[11px] text-[#94A3B8] truncate">{app.email}</span>
                                </div>
                            </div>
                            <span className="flex-1 text-[13px] text-[#334155] truncate">{app.position}</span>
                            <span className="w-[110px] text-[13px] text-[#64748B]">{app.experience}</span>
                            <div className="w-[120px]">
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${style.bg} ${style.text}`}>
                                    {app.status}
                                </span>
                            </div>
                            <span className="w-[110px] text-xs text-[#94A3B8]">{app.date}</span>
                            <div className="w-[80px] flex items-center gap-2">
                                <button className="size-8 flex items-center justify-center rounded-md hover:bg-[#F1F5F9] transition-colors">
                                    <Eye size={16} className="text-[#94A3B8]" />
                                </button>
                                <button className="size-8 flex items-center justify-center rounded-md hover:bg-[#F1F5F9] transition-colors">
                                    <MoreHorizontal size={16} className="text-[#94A3B8]" />
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
                    const style = statusStyles[app.status];
                    const isChecked = selected.has(app.id);
                    return (
                        <div
                            key={app.id}
                            className={`grid grid-cols-[36px_1fr_1fr_100px_80px] items-center px-5 py-3 transition-colors ${isChecked ? "bg-[#0f766d]/5" : ""
                                } ${i < filtered.length - 1 ? "border-b border-[#F1F5F9]" : ""}`}
                        >
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleOne(app.id)}
                                className="size-4 rounded border-[#CBD5E1] accent-[#0f766d] cursor-pointer"
                            />
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${avatarColors[app.initials]}`}>
                                    <span className="text-white text-[10px] font-bold">{app.initials}</span>
                                </div>
                                <span className="text-[13px] font-medium text-[#0e1b1a] truncate">{app.name}</span>
                            </div>
                            <span className="text-[13px] text-[#334155] truncate">{app.position}</span>
                            <span className={`inline-flex w-fit px-2 py-0.5 rounded-full text-[11px] font-medium ${style.bg} ${style.text}`}>
                                {app.status}
                            </span>
                            <span className="text-xs text-[#94A3B8]">{app.date}</span>
                        </div>
                    );
                })}
            </div>

            {/* ===== Mobile Card List (below md) ===== */}
            <div className="md:hidden flex flex-col">
                {filtered.map((app, i) => {
                    const style = statusStyles[app.status];
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
                                    <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${avatarColors[app.initials]}`}>
                                        <span className="text-white text-xs font-bold">{app.initials}</span>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[14px] font-semibold text-[#0e1b1a]">{app.name}</span>
                                        <span className="text-[11px] text-[#94A3B8]">{app.email}</span>
                                    </div>
                                </div>
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${style.bg} ${style.text}`}>
                                    {app.status}
                                </span>
                            </div>
                            {/* Bottom: Position + Experience + Date */}
                            <div className="flex items-center justify-between text-[12px] text-[#64748B] ml-[66px]">
                                <span>{app.position} • {app.experience}</span>
                                <span className="text-[#94A3B8]">{app.date}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
