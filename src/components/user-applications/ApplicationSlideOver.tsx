"use client";

import React, { useEffect } from "react";
import {
    X, MapPin, Briefcase, Calendar, Eye, Send, FileText,
    Video, CheckCircle2, XCircle, Sparkles, ExternalLink,
    Clock, FileDown, Flag,
} from "lucide-react";
import { ApplicationMock, TimelineEvent } from "@/data/applications-mock";

interface ApplicationSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    application: ApplicationMock | null;
}

const iconMap: Record<string, React.ElementType> = {
    calendar: Calendar,
    eye: Eye,
    send: Send,
    draft: FileText,
    check: CheckCircle2,
    x: XCircle,
    video: Video,
};

export const ApplicationSlideOver = ({ isOpen, onClose, application }: ApplicationSlideOverProps) => {
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKey);
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKey);
        };
    }, [isOpen, onClose]);

    if (!application && !isOpen) return null;

    // Status color derivation
    const statusColor = (() => {
        switch (application?.status) {
            case "Reviewed": return { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", border: "border-blue-200" };
            case "Rejected": return { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400", border: "border-red-200" };
            default: return { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400", border: "border-amber-200" };
        }
    })();

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 transition-opacity duration-400
                    ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />

            {/* Panel */}
            <aside
                className={`fixed inset-y-0 right-0 z-[60] w-full sm:w-[480px] md:w-[540px] lg:w-[600px]
                    bg-white shadow-[-8px_0_30px_rgba(0,0,0,0.08)] flex flex-col
                    transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
                    ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* ─── Sticky Header ────────────────────────────────────── */}
                <div className="shrink-0 px-5 sm:px-7 py-5 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-[#0e1b1a]">Application Details</h2>
                            <p className="text-xs text-gray-400 font-medium mt-0.5">ID: {application?.id}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 -m-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* ─── Scrollable Body ──────────────────────────────────── */}
                <div className="flex-1 overflow-y-auto overscroll-contain">
                    <div className="px-5 sm:px-7 py-6 space-y-7">

                        {/* ── Job Card ──────────────────────────────────── */}
                        <div className="bg-gradient-to-br from-[#f0fdf9] to-[#f8fafc] border border-[#d1ede9] rounded-2xl p-5 sm:p-6">
                            <div className="flex gap-4">
                                <div className={`w-14 h-14 rounded-2xl ${application?.companyColor || "bg-gray-600"} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md`}>
                                    {application?.companyInitials}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-lg font-bold text-[#0e1b1a] leading-snug">{application?.jobTitle}</h3>
                                    <p className="text-[#0f766d] font-semibold text-sm mt-0.5">{application?.company}</p>

                                    <div className="flex flex-wrap items-center gap-2 mt-3">
                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600 bg-white px-2.5 py-1 rounded-md border border-gray-200 shadow-sm">
                                            <MapPin className="w-3 h-3 text-gray-400" />{application?.location}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600 bg-white px-2.5 py-1 rounded-md border border-gray-200 shadow-sm">
                                            <Briefcase className="w-3 h-3 text-gray-400" />{application?.workMode} · {application?.jobType}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 mt-3">
                                        <span className="text-sm font-bold text-[#0e1b1a]">{application?.salary}</span>
                                        <div className="flex items-center gap-1">
                                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                            <span className="text-sm font-bold text-emerald-600">{application?.matchScore}% match</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Current Status Badge ─────────────────────── */}
                        <div className="flex items-center justify-between">
                            <h4 className="text-[11px] font-bold tracking-[0.1em] text-gray-400 uppercase">Current Status</h4>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusColor.bg} ${statusColor.text} ${statusColor.border}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${statusColor.dot} animate-pulse`} />
                                {application?.status}
                            </span>
                        </div>

                        {/* ── Timeline ──────────────────────────────────── */}
                        <div>
                            <h4 className="text-[11px] font-bold tracking-[0.1em] text-gray-400 uppercase mb-4">Activity Timeline</h4>
                            <div className="relative pl-8">
                                {/* Vertical line */}
                                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-[#0f766d] via-gray-200 to-gray-100" />

                                <div className="space-y-6">
                                    {application?.timeline.map((evt, i) => {
                                        const IconComp = iconMap[evt.icon] || Send;
                                        const isFirst = i === 0;
                                        return (
                                            <div key={i} className="relative">
                                                {/* Dot / Icon */}
                                                <div className={`absolute -left-8 top-0 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white
                                                    ${evt.isHighlighted ? "bg-[#0f766d] shadow-lg shadow-[#0f766d]/25" : "bg-white border-2 border-gray-200"}`}>
                                                    <IconComp className={`w-3 h-3 ${evt.isHighlighted ? "text-white" : "text-gray-400"}`} />
                                                </div>

                                                {/* Content */}
                                                <div className="pt-0.5">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h5 className={`text-sm font-semibold ${evt.isHighlighted ? "text-[#0e1b1a]" : "text-gray-700"}`}>
                                                            {evt.title}
                                                        </h5>
                                                        <span className={`text-[10px] font-medium shrink-0 mt-0.5
                                                            ${evt.isHighlighted ? "text-[#0f766d] bg-[#e8f5f3] px-2 py-0.5 rounded-full font-bold" : "text-gray-400"}`}>
                                                            {evt.date}
                                                        </span>
                                                    </div>
                                                    {evt.description && (
                                                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{evt.description}</p>
                                                    )}
                                                    {evt.actionLabel && (
                                                        <button className="mt-2.5 inline-flex items-center gap-1.5 bg-[#0f766d] hover:bg-[#0d6b63] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-sm">
                                                            <Video className="w-3.5 h-3.5" />
                                                            {evt.actionLabel}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* ── Job Summary ───────────────────────────────── */}
                        <div>
                            <h4 className="text-[11px] font-bold tracking-[0.1em] text-gray-400 uppercase mb-3">Job Summary</h4>
                            <div 
                                className="bg-[#f8fafc] border border-gray-200 rounded-xl p-4 text-sm text-gray-600 leading-relaxed max-w-none prose prose-sm line-clamp-3"
                                dangerouslySetInnerHTML={{ __html: application?.jobSummary || "" }}
                            />
                        </div>

                        {/* ── Required Skills ──────────────────────────── */}
                        <div>
                            <h4 className="text-[11px] font-bold tracking-[0.1em] text-gray-400 uppercase mb-3">Required Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {application?.requiredSkills.map((skill) => (
                                    <span key={skill} className="text-xs font-medium text-[#0f766d] bg-[#e8f5f3] border border-[#d1ede9] px-3 py-1.5 rounded-lg">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* ── Submitted Documents ──────────────────────── */}
                        <div>
                            <h4 className="text-[11px] font-bold tracking-[0.1em] text-gray-400 uppercase mb-3">Submitted Documents</h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                                    <FileText className="w-5 h-5 text-[#0f766d] shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-[#0e1b1a] truncate">{application?.resumeUsed}</p>
                                        <p className="text-[11px] text-gray-400">Resume</p>
                                    </div>
                                    <FileDown className="w-4 h-4 text-gray-400 hover:text-[#0f766d] cursor-pointer transition-colors" />
                                </div>
                                {application?.coverLetterAttached && (
                                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                                        <FileText className="w-5 h-5 text-[#0f766d] shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-[#0e1b1a] truncate">Cover Letter</p>
                                            <p className="text-[11px] text-gray-400">Attached</p>
                                        </div>
                                        <FileDown className="w-4 h-4 text-gray-400 hover:text-[#0f766d] cursor-pointer transition-colors" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── Sticky Footer ────────────────────────────────────── */}
                <div className="shrink-0 border-t border-gray-100 px-5 sm:px-7 py-4 bg-white/80 backdrop-blur-sm flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm py-3 rounded-xl transition-colors shadow-sm">
                        <Flag className="w-4 h-4" />
                        Withdraw
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-[#0f766d] hover:bg-[#0d6b63] text-white font-semibold text-sm py-3 rounded-xl transition-colors shadow-sm">
                        <ExternalLink className="w-4 h-4" />
                        View Job Post
                    </button>
                </div>
            </aside>
        </>
    );
};
