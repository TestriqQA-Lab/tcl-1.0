"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText, Eye, Loader2, Globe, Mail, Phone, Calendar, User, Briefcase, X, ExternalLink, Download, Trash2, AlertTriangle } from "lucide-react";
import { getEmployerProfileDetailAction, updateEmployerVerificationStatusAction, deleteEmployerAction } from "@/actions/admin.actions";
import { useRouter } from "next/navigation";

interface EmployerDetail {
    id: string;
    userId: string;
    fullName: string;
    companyName: string | null;
    companyIndustry: string | null;
    companyLocation: string | null;
    companyWebsite: string | null;
    companySize: string | null;
    companyDescription: string | null;
    email: string;
    phoneNumber: string | null;
    status: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
    logoUrl: string | null;
    createdAt: Date;
    accountStatus: string;
    // Verification docs
    tempStaffingDocumentType: string | null;
    tempStaffingDocumentUrl: string | null;
    personalDocumentType: string | null;
    personalDocumentUrl: string | null;
    companyDocumentType: string | null;
    companyDocumentUrl: string | null;
    performance?: {
        totalJobs: number;
        activeJobs: number;
        applications: number;
        hireRate: number;
    };
}

export default function DetailedEmployerProfileContent() {
    const params = useParams();
    const id = params.id as string;
    
    const [employer, setEmployer] = useState<EmployerDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<{ url: string; name: string } | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!id) return;
        
        async function fetchEmployerDetail() {
            try {
                const result = await getEmployerProfileDetailAction(id);
                if (result.success && result.data) {
                    setEmployer(result.data as unknown as EmployerDetail);
                } else {
                    setError(result.error || "Failed to fetch employer details");
                }
            } catch (err) {
                setError("An unexpected error occurred");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchEmployerDetail();
    }, [id]);

    const handleStatusUpdate = async (newStatus: "VERIFIED" | "REJECTED") => {
        if (!employer || isUpdating) return;
        
        setIsUpdating(true);
        try {
            const result = await updateEmployerVerificationStatusAction(employer.userId, newStatus);
            if (result.success) {
                setEmployer(prev => prev ? { ...prev, status: newStatus } : null);
            } else {
                alert(result.error || "Failed to update status");
            }
        } catch (err) {
            alert("An unexpected error occurred");
            console.error(err);
        } finally {
            setIsUpdating(false);
        }
    };

    const getLogoColor = (name: string | null) => {
        if (!name) return "#3B82F6";
        const colors = ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    if (isLoading) {
        return (
            <div className="w-full min-h-full flex items-center justify-center bg-[#F9FAFB] p-20">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !employer) {
        return (
            <div className="w-full min-h-full p-8 bg-[#F9FAFB]">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 font-medium">
                    {error || "Employer not found"}
                </div>
                <Link href="/admin-dashboard/employers-profile" className="mt-4 inline-flex items-center text-blue-600 hover:underline">
                    <ArrowLeft size={16} className="mr-2" /> Back to Employers
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full min-h-full p-5 md:p-8 lg:py-12 lg:px-14 bg-[#F9FAFB] flex flex-col gap-6 md:gap-8">
            {/* ── Back Navigation ── */}
            <Link
                href="/admin-dashboard/employers-profile"
                className="flex items-center gap-3 md:gap-4 w-fit group"
            >
                <span className="bg-[#F3F4F6] p-1.5 md:p-2 rounded-lg text-[#4B5563] font-bold text-sm group-hover:bg-[#E5E7EB] transition-colors">
                    <ArrowLeft size={16} />
                </span>
                <span className="text-[#6B7280] text-sm font-normal font-inter group-hover:text-[#4B5563] transition-colors">
                    Back to Employers All
                </span>
            </Link>

            {/* ── Hero Card ── */}
            <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 lg:p-8 flex flex-col gap-4 md:gap-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 md:gap-5 lg:gap-6">
                    <div
                        className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg md:rounded-[10px] lg:rounded-xl shrink-0 flex items-center justify-center text-white text-2xl font-bold overflow-hidden"
                        style={{ backgroundColor: employer.logoUrl ? '#F9FAFB' : getLogoColor(employer.companyName || employer.fullName) }}
                    >
                        {employer.logoUrl ? (
                            <img src={employer.logoUrl} alt={employer.companyName || employer.fullName} className="w-full h-full object-contain p-1" />
                        ) : (
                            (employer.companyName || employer.fullName || "E")[0].toUpperCase()
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-lg md:text-2xl lg:text-[28px] font-bold text-[#111827] font-inter">
                            {employer.companyName || employer.fullName}
                        </h1>
                        <div className="flex items-center gap-4 text-[13px] md:text-sm lg:text-[15px] text-[#4B5563] font-inter">
                            <span className="flex items-center gap-1.5"><Mail size={14} /> {employer.email}</span>
                            {employer.phoneNumber && <span className="flex items-center gap-1.5"><Phone size={14} /> {employer.phoneNumber}</span>}
                        </div>
                    </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 md:gap-3">
                    <span className={`text-[11px] md:text-xs font-semibold px-2.5 py-1 rounded-full font-inter ${
                        employer.status === 'VERIFIED' ? 'text-[#166534] bg-[#DCFCE7]' : 
                        employer.status === 'PENDING' ? 'text-[#9A3412] bg-[#FFEDD5]' :
                        'text-[#4B5563] bg-[#F3F4F6]'
                    }`}>
                        {employer.status}
                    </span>
                    {employer.companyIndustry && (
                        <span className="text-[11px] md:text-xs font-semibold text-[#1D4ED8] bg-[#DBEAFE] px-2 md:px-2.5 py-1 rounded-full font-inter">
                            {employer.companyIndustry}
                        </span>
                    )}
                </div>
            </div>

            {/* ── Two Column Layout (Desktop/Tablet) / Stacked (Mobile) ── */}
            <div className="flex flex-col lg:flex-row gap-6 md:gap-6 lg:gap-8 relative">
                {/* ── LEFT COLUMN: Verification & Trust ── */}
                <div className="lg:w-[400px] lg:shrink-0">
                    <div className="bg-white rounded-xl p-4 md:p-6 flex flex-col gap-5 md:gap-6 shadow-sm border border-gray-100 h-full">
                        <h2 className="text-lg font-semibold text-[#111827] font-inter flex items-center gap-2">
                             Verification &amp; Trust
                        </h2>

                        {/* Account Status */}
                        <div className="flex flex-col gap-2">
                            <span className="text-[13px] font-medium text-[#6B7280] font-inter">Account Status</span>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${employer.accountStatus === 'ACTIVE' ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`} />
                                <span className="text-sm font-semibold text-[#111827] font-inter">
                                    {employer.accountStatus}
                                </span>
                            </div>
                        </div>

                        {/* Join Date */}
                        <div className="flex flex-col gap-2">
                            <span className="text-[13px] font-medium text-[#6B7280] font-inter flex items-center gap-1.5"><Calendar size={14} /> Join Date</span>
                            <span className="text-sm font-medium text-[#111827] font-inter">
                                {new Date(employer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>

                        {/* Business Documents */}
                        <div className="flex flex-col gap-2">
                            <span className="text-[13px] font-medium text-[#6B7280] font-inter">Business Documents</span>
                            {[
                                { type: employer.companyDocumentType, url: employer.companyDocumentUrl, name: "Company Document" },
                                { type: employer.personalDocumentType, url: employer.personalDocumentUrl, name: "Personal ID" },
                                { type: employer.tempStaffingDocumentType, url: employer.tempStaffingDocumentUrl, name: "Temp Staffing License" }
                            ].filter(doc => doc.url).map((doc, idx) => (
                                <div key={idx} className="bg-[#F9FAFB] rounded-lg p-2.5 md:p-3 flex items-center gap-2.5 md:gap-3 group/doc">
                                    <div className="w-8 h-8 bg-[#FEE2E2] rounded-md flex items-center justify-center shrink-0">
                                        <FileText size={16} className="text-[#DC2626]" />
                                    </div>
                                    <div className="flex flex-col gap-0 flex-1 min-w-0">
                                        <span className="text-sm font-medium text-[#111827] font-inter truncate">
                                            {doc.name}
                                        </span>
                                        <span className="text-xs text-[#6B7280] font-inter">
                                            {doc.type}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedDoc({ url: doc.url!, name: doc.name })}
                                        className="bg-white p-1.5 rounded-md hover:bg-gray-100 transition-colors border border-gray-100 shadow-sm"
                                    >
                                        <Eye size={14} className="text-[#6B7280]" />
                                    </button>
                                </div>
                            ))}
                            {!employer.companyDocumentUrl && !employer.personalDocumentUrl && !employer.tempStaffingDocumentUrl && (
                                <span className="text-sm text-[#9CA3AF] italic">No documents uploaded.</span>
                            )}
                        </div>

                        {/* Verification Decision */}
                        <div className="flex flex-col gap-3 pt-2">
                            <span className="text-[13px] font-medium text-[#6B7280] font-inter">Verification Decision</span>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => handleStatusUpdate("VERIFIED")}
                                    disabled={employer.status === 'VERIFIED' || isUpdating}
                                    className="flex-1 bg-[#10B981] text-white text-sm font-semibold px-4 py-2.5 rounded-md hover:bg-[#059669] transition-colors font-inter disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
                                >
                                    {isUpdating ? <Loader2 size={14} className="animate-spin" /> : "Approve"}
                                </button>
                                <button 
                                    onClick={() => handleStatusUpdate("REJECTED")}
                                    disabled={employer.status === 'REJECTED' || isUpdating}
                                    className="flex-1 bg-[#EF4444] text-white text-sm font-semibold px-4 py-2.5 rounded-md hover:bg-[#DC2626] transition-colors font-inter disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
                                >
                                    {isUpdating ? <Loader2 size={14} className="animate-spin" /> : "Reject"}
                                </button>
                            </div>
                        </div>

                        {/* Delete Employer */}
                        <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-gray-100">
                            <span className="text-[13px] font-medium text-[#6B7280] font-inter">Danger Zone</span>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="w-full flex items-center justify-center gap-2 bg-white text-[#EF4444] text-sm font-semibold px-4 py-2.5 rounded-md border-2 border-[#FCA5A5] hover:bg-[#FEF2F2] hover:border-[#EF4444] transition-colors font-inter active:scale-[0.98]"
                            >
                                <Trash2 size={14} />
                                Delete Employer
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Document Viewer Modal ── */}
                {selectedDoc && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="relative bg-white rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-lg font-bold text-gray-900 leading-none">{selectedDoc.name}</h3>
                                        <span className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Business Verification Document</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <a 
                                        href={selectedDoc.url} 
                                        download={`document-${Date.now()}`}
                                        className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                        title="Download Document"
                                    >
                                        <Download className="w-5 h-5" />
                                    </a>
                                    <a 
                                        href={selectedDoc.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                        title="Open in New Tab"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                    </a>
                                    <div className="w-px h-6 bg-gray-200 mx-1" />
                                    <button 
                                        onClick={() => setSelectedDoc(null)}
                                        className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                        title="Close"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center p-6 md:p-10">
                                {(() => {
                                    const isImage = selectedDoc.url.startsWith("data:image/") || selectedDoc.url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                                    const isPdf = selectedDoc.url.startsWith("data:application/pdf") || selectedDoc.url.endsWith(".pdf");

                                    if (isImage) {
                                        return (
                                            <img 
                                                src={selectedDoc.url} 
                                                alt={selectedDoc.name}
                                                className="max-w-full max-h-full object-contain rounded-lg shadow-lg border border-gray-200"
                                            />
                                        );
                                    }

                                    if (isPdf) {
                                        return (
                                            <iframe 
                                                src={selectedDoc.url} 
                                                className="w-full h-full rounded-lg shadow-lg border border-gray-200 bg-white"
                                                title={selectedDoc.name}
                                            />
                                        );
                                    }

                                    return (
                                        <div className="text-center p-8 md:p-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-6 max-w-md">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                                <FileText className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <p className="text-gray-900 font-bold text-lg">Unable to Preview</p>
                                                <p className="text-gray-500 text-sm leading-relaxed">
                                                    We don't support online preview for this file format yet. Please download the document to view it on your device.
                                                </p>
                                            </div>
                                            <a 
                                                href={selectedDoc.url} 
                                                download 
                                                className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                                            >
                                                <Download className="w-5 h-5" /> Download Document
                                            </a>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── RIGHT COLUMN: Content Metrics & Information ── */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-xl p-4 md:p-6 flex flex-col gap-5 md:gap-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-[#111827] font-inter">Company Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[13px] text-[#6B7280] font-medium flex items-center gap-1.5"><User size={14} /> Full Name</span>
                                <span className="text-sm font-semibold text-[#111827]">{employer.fullName}</span>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[13px] text-[#6B7280] font-medium flex items-center gap-1.5"><Briefcase size={14} /> Company Size</span>
                                <span className="text-sm font-semibold text-[#111827]">{employer.companySize || "N/A"}</span>
                            </div>
                            {employer.companyWebsite && (
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[13px] text-[#6B7280] font-medium flex items-center gap-1.5"><Globe size={14} /> Website</span>
                                    <a href={employer.companyWebsite.startsWith('http') ? employer.companyWebsite : `https://${employer.companyWebsite}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:underline truncate">
                                        {employer.companyWebsite}
                                    </a>
                                </div>
                            )}
                            {employer.companyLocation && (
                                <div className="flex flex-col gap-1.5 md:col-span-2">
                                    <span className="text-[13px] text-[#6B7280] font-medium">Location</span>
                                    <span className="text-sm font-semibold text-[#111827]">{employer.companyLocation}</span>
                                </div>
                            )}
                        </div>
                        {employer.companyDescription && (
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[13px] text-[#6B7280] font-medium">Description</span>
                                <p className="text-sm text-[#4B5563] leading-relaxed italic">
                                    "{employer.companyDescription}"
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Performance & Activity Metrics */}
                    {employer.performance && (
                        <div className="bg-white rounded-xl p-4 md:p-6 flex flex-col gap-5 md:gap-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-[#111827] font-inter">
                                Performance &amp; Activity
                            </h2>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-[#F9FAFB] rounded-lg p-4 flex flex-col gap-1">
                                    <span className="text-[11px] text-[#6B7280] uppercase tracking-wider font-bold">Total Jobs</span>
                                    <span className="text-2xl font-bold text-[#111827]">
                                        {employer.performance.totalJobs}
                                    </span>
                                </div>
                                <div className="bg-[#F9FAFB] rounded-lg p-4 flex flex-col gap-1">
                                    <span className="text-[11px] text-[#6B7280] uppercase tracking-wider font-bold">Active Jobs</span>
                                    <span className="text-2xl font-bold text-[#3B82F6]">
                                        {employer.performance.activeJobs}
                                    </span>
                                </div>
                                <div className="bg-[#F9FAFB] rounded-lg p-4 flex flex-col gap-1">
                                    <span className="text-[11px] text-[#6B7280] uppercase tracking-wider font-bold">Applications</span>
                                    <span className="text-2xl font-bold text-[#111827]">
                                        {employer.performance.applications}
                                    </span>
                                </div>
                                <div className="bg-[#F9FAFB] rounded-lg p-4 flex flex-col gap-1">
                                    <span className="text-[11px] text-[#6B7280] uppercase tracking-wider font-bold">Hire Rate</span>
                                    <span className="text-2xl font-bold text-[#10B981]">
                                        {employer.performance.hireRate}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Delete Confirmation Modal ── */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="px-6 py-5 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#FEE2E2] flex items-center justify-center shrink-0 mt-0.5">
                                <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-bold text-[#111827]">Delete Employer</h3>
                                <p className="text-sm text-[#6B7280] leading-relaxed">
                                    This will <strong className="text-[#EF4444]">permanently delete</strong> the employer account, all their job postings, and all associated applications. This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        <div className="px-6 pb-2">
                            <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5 block">
                                Type <strong className="text-[#111827]">{employer.companyName || employer.fullName}</strong> to confirm
                            </label>
                            <input
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                placeholder={employer.companyName || employer.fullName}
                                className="w-full h-10 rounded-lg border-[1.5px] border-[#E2E8F0] px-3 text-sm font-inter outline-none focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]/20"
                            />
                        </div>
                        <div className="px-6 py-4 flex items-center gap-3">
                            <button
                                onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(""); }}
                                className="flex-1 h-10 rounded-lg border border-[#E2E8F0] text-sm font-semibold text-[#4B5563] hover:bg-[#F9FAFB] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    if (!employer) return;
                                    setIsDeleting(true);
                                    const result = await deleteEmployerAction(employer.userId);
                                    setIsDeleting(false);
                                    if (result.success) {
                                        router.push("/admin-dashboard/employers-profile");
                                    } else {
                                        alert(result.error || "Failed to delete employer");
                                        setShowDeleteModal(false);
                                        setDeleteConfirmText("");
                                    }
                                }}
                                disabled={deleteConfirmText !== (employer.companyName || employer.fullName) || isDeleting}
                                className="flex-1 h-10 rounded-lg bg-[#EF4444] text-white text-sm font-semibold hover:bg-[#DC2626] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isDeleting ? <><Loader2 size={14} className="animate-spin" /> Deleting...</> : <><Trash2 size={14} /> Delete</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
