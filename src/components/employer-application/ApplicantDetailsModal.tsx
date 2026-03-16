"use client";

import { X, Mail, Phone, Calendar, Briefcase, FileText, Download, User, ExternalLink, MapPin, Clock, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
import { ApplicationStatus } from "./ApplicantStatusDropdown";

interface ApplicantDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    applicant: any;
}

export function ApplicantDetailsModal({ isOpen, onClose, applicant }: ApplicantDetailsModalProps) {
    if (!isOpen || !applicant) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div 
                className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9] bg-[#F8FAFB]">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-[#0f766d] rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {applicant.initials}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[#0e1b1a]">{applicant.name}</h2>
                            <p className="text-xs text-[#64748B]">Applied for {applicant.jobTitle}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-[#E2E8F0] rounded-full transition-colors"
                    >
                        <X size={20} className="text-[#64748B]" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider">Contact Details</h3>
                            <div className="flex items-center gap-3 text-sm text-[#334155]">
                                <div className="size-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                                    <Mail size={16} className="text-[#0f766d]" />
                                </div>
                                <span>{applicant.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[#334155]">
                                <div className="size-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                                    <Phone size={16} className="text-[#0f766d]" />
                                </div>
                                <span>{applicant.phone || "Not provided"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[#334155]">
                                <div className="size-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                                    <Calendar size={16} className="text-[#0f766d]" />
                                </div>
                                <span>Applied on {applicant.date}</span>
                            </div>
                        </div>

                        {/* Professional Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider">Professional Info</h3>
                            <div className="flex items-center gap-3 text-sm text-[#334155]">
                                <div className="size-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                                    <Briefcase size={16} className="text-[#0f766d]" />
                                </div>
                                <span>{applicant.position}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[#334155]">
                                <div className="size-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                                    <User size={16} className="text-[#0f766d]" />
                                </div>
                                <span>{applicant.experience}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[#334155]">
                                <div className="size-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                                    <Clock size={16} className="text-[#0f766d]" />
                                </div>
                                <span>Notice: {applicant.noticePeriod}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[#334155]">
                                <div className="size-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                                    <MapPin size={16} className="text-[#0f766d]" />
                                </div>
                                <span className="truncate" title={applicant.location}>
                                    {applicant.location} (Pref: {applicant.preferredLocation})
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                    applicant.status === "Accepted" ? "bg-[#DCFCE7] text-[#16A34A]" :
                                    applicant.status === "Rejected" ? "bg-[#FEE2E2] text-[#EF4444]" :
                                    "bg-[#F1F5F9] text-[#64748B]"
                                }`}>
                                    Status: {applicant.status}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Screening Questions */}
                    {applicant.screeningQuestions && applicant.screeningQuestions.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-3 flex items-center gap-2">
                                Screening Details
                                <span className="bg-[#0f766d]/10 text-[#0f766d] text-[10px] px-2 py-0.5 rounded-full font-bold">Important</span>
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                {applicant.screeningQuestions.map((sq: any, idx: number) => (
                                    <div key={idx} className="bg-[#F8FAFB] p-4 rounded-xl border border-[#E2E8F0] group hover:border-[#0f766d]/30 transition-colors">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-[#64748B] mb-1">{sq.question}</p>
                                                <p className="text-sm font-semibold text-[#0e1b1a] mb-2">{sq.answer || "Not provided"}</p>
                                                <div className="flex items-center gap-1.5 opacity-80">
                                                    <div className="size-1.5 rounded-full bg-gray-400"></div>
                                                    <p className="text-[11px] text-[#64748B]">Requirement: {sq.required}</p>
                                                </div>
                                            </div>
                                            {sq.answer && sq.answer !== "Not specified" ? (
                                                <CheckCircle2 size={18} className="text-[#16A34A] mt-1" />
                                            ) : (
                                                <AlertCircle size={18} className="text-[#EF4444] mt-1" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bio / Summary */}
                    <div className="mb-8">
                        <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-3">Professional Summary</h3>
                        <div className="bg-[#F8FAFB] p-4 rounded-xl border border-[#E2E8F0]">
                            <p className="text-[14px] text-[#334155] leading-relaxed whitespace-pre-wrap">
                                {applicant.bio || "No professional summary provided by the candidate."}
                            </p>
                        </div>
                    </div>

                    {/* Resume Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-3">Resume</h3>
                        {applicant.resumeUrl ? (
                            <div className="flex items-center justify-between p-4 border border-[#0f766d]/20 bg-[#0f766d]/5 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 bg-white rounded-lg flex items-center justify-center border border-[#E2E8F0]">
                                        <FileText size={20} className="text-[#0f766d]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[#0e1b1a]">Resume.pdf</p>
                                        <p className="text-xs text-[#64748B]">Click to view or download</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <a 
                                        href={applicant.resumeUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-medium text-[#64748B] hover:bg-[#F8FAFB] transition-colors"
                                    >
                                        <ExternalLink size={14} />
                                        View
                                    </a>
                                    <a 
                                        href={applicant.resumeUrl} 
                                        download
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f766d] text-white rounded-lg text-xs font-medium hover:bg-[#0d635c] transition-colors"
                                    >
                                        <Download size={14} />
                                        Download
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 border border-dashed border-[#E2E8F0] rounded-xl text-center text-[#94A3B8] text-sm italic">
                                No resume uploaded for this application.
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-[#F8FAFB] border-t border-[#F1F5F9] flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-semibold text-[#64748B] hover:bg-[#E2E8F0] rounded-xl transition-colors"
                    >
                        Close
                    </button>
                    {applicant.email && (
                        <a 
                            href={`mailto:${applicant.email}`}
                            className="px-5 py-2 text-sm font-semibold bg-[#0f766d] text-white rounded-xl hover:bg-[#0d635c] transition-colors shadow-lg shadow-[#0f766d]/10"
                        >
                            Email Candidate
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
