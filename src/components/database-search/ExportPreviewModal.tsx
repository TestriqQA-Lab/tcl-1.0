"use client";

import { X, Download, FileSpreadsheet } from "lucide-react";
import { CandidateProps } from "./CandidateCard";

interface ExportPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidates: CandidateProps[];
    onDownload: () => void;
}

export function ExportPreviewModal({ isOpen, onClose, candidates, onDownload }: ExportPreviewModalProps) {
    if (!isOpen) return null;

    const columns = [
        { label: "A", title: "Candidate Name" },
        { label: "B", title: "Company" },
        { label: "C", title: "Current Designation" },
        { label: "D", title: "Location" },
        { label: "E", title: "Education" },
        { label: "F", title: "Skills" },
    ];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative bg-[#F8F9FA] w-full max-w-6xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-[#BDC1C6] animate-in fade-in zoom-in duration-200">
                
                {/* Spreadsheet Header / Toolbar */}
                <div className="flex flex-col bg-white border-b border-[#BDC1C6] shrink-0">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#0f766d]/10 rounded-lg">
                                <FileSpreadsheet className="w-6 h-6 text-[#0f766d]" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-[18px] font-bold text-[#202124]">candidates_export.xlsx (Preview)</h2>
                                <p className="text-[12px] text-[#5F6368]">
                                    {candidates.length} row{candidates.length !== 1 ? 's' : ''} selected
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-[#F1F3F4] rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-[#5F6368]" />
                        </button>
                    </div>

                    {/* Mock Excel Tabs/Ribbon Space */}
                    <div className="flex items-center px-4 h-8 gap-6 border-t border-[#F1F3F4]">
                        <span className="text-[12px] font-medium text-[#202124] border-b-2 border-[#0f766d] px-1 h-full flex items-center">File</span>
                        <span className="text-[12px] font-medium text-[#5F6368] hover:text-[#202124] cursor-pointer">Edit</span>
                        <span className="text-[12px] font-medium text-[#5F6368] hover:text-[#202124] cursor-pointer">View</span>
                        <span className="text-[12px] font-medium text-[#5F6368] hover:text-[#202124] cursor-pointer">Data</span>
                    </div>
                </div>

                {/* Spreadsheet Grid Container */}
                <div className="flex-1 overflow-auto relative bg-white">
                    <table className="w-full border-separate border-spacing-0 table-fixed">
                        <thead className="sticky top-0 z-10">
                            {/* Excel Column Labels (A, B, C...) */}
                            <tr className="bg-[#F8F9FA]">
                                <th className="w-12 border-r border-b border-[#BDC1C6] bg-[#F8F9FA] sticky left-0 z-20"></th>
                                {columns.map((col, idx) => (
                                    <th 
                                        key={idx} 
                                        className="h-8 border-r border-b border-[#BDC1C6] text-[11px] font-normal text-[#5F6368] text-center"
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                            {/* Data Headers (Candidate, Company...) */}
                            <tr className="bg-[#FFFFFF]">
                                <th className="h-10 border-r border-b border-[#BDC1C6] bg-[#F8F9FA] text-[12px] font-medium text-[#5F6368] text-center sticky left-0 z-20">1</th>
                                {columns.map((col, idx) => (
                                    <th 
                                        key={idx} 
                                        className="px-4 border-r border-b border-[#BDC1C6] text-[13px] font-bold text-[#202124] text-left bg-[#F1F3F4]"
                                    >
                                        {col.title}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {candidates.map((c, index) => (
                                <tr key={c.id} className="hover:bg-[#E8F0FE] group">
                                    {/* Row Index Label */}
                                    <td className="h-10 border-r border-b border-[#BDC1C6] bg-[#F8F9FA] text-[12px] font-medium text-[#5F6368] text-center sticky left-0 group-hover:bg-[#E2E8F0]">
                                        {index + 2}
                                    </td>
                                    
                                    {/* Column A: Candidate */}
                                    <td className="px-4 border-r border-b border-[#E2E8F0] text-[13px] text-[#202124] truncate">
                                        {c.name}
                                    </td>

                                    {/* Column B: Company */}
                                    <td className="px-4 border-r border-b border-[#E2E8F0] text-[13px] text-[#202124] truncate">
                                        {c.company}
                                    </td>

                                    {/* Column C: Role */}
                                    <td className="px-4 border-r border-b border-[#E2E8F0] text-[13px] text-[#202124] truncate">
                                        {c.title.split(' at ')[0]}
                                    </td>

                                    {/* Column D: Location */}
                                    <td className="px-4 border-r border-b border-[#E2E8F0] text-[13px] text-[#202124] truncate">
                                        {c.location}
                                    </td>

                                    {/* Column E: Education */}
                                    <td className="px-4 border-r border-b border-[#E2E8F0] text-[13px] text-[#202124] truncate">
                                        {c.education}
                                    </td>

                                    {/* Column F: Skills */}
                                    <td className="px-4 border-r border-b border-[#E2E8F0] text-[13px] text-[#202124] truncate">
                                        {c.skills.join(", ")}
                                    </td>
                                </tr>
                            ))}
                            {/* Empty rows to fulfill spreadsheet look */}
                            {[...Array(5)].map((_, i) => (
                                <tr key={`empty-${i}`}>
                                    <td className="h-10 border-r border-b border-[#BDC1C6] bg-[#F8F9FA] text-[12px] font-medium text-[#5F6368] text-center sticky left-0 whitespace-nowrap">
                                        {candidates.length + i + 2}
                                    </td>
                                    {columns.map((_, idx) => (
                                        <td key={idx} className="border-r border-b border-[#E2E8F0]"></td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Spreadsheet Status Bar / Footer */}
                <div className="px-6 py-4 border-t border-[#BDC1C6] bg-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onClose}
                            className="px-6 h-10 text-[14px] font-bold text-[#5F6368] hover:text-[#202124] transition-colors"
                        >
                            Discard
                        </button>
                        <div className="h-6 w-[1px] bg-[#BDC1C6] hidden sm:block" />
                        <span className="text-[12px] text-[#5F6368] hidden sm:inline">Ready to export to CSV format</span>
                    </div>
                    
                    <button 
                        onClick={onDownload}
                        className="flex items-center gap-2 px-8 h-10 bg-[#0f766d] hover:bg-[#0c5c55] text-white text-[14px] font-bold rounded shadow-sm transition-all active:scale-95"
                    >
                        <Download className="w-4 h-4" />
                        Download CSV
                    </button>
                </div>
            </div>
        </div>
    );
}
