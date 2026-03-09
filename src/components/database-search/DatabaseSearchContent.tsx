"use client";

import { useState } from "react";
import { SearchFilters } from "./SearchFilters";
import { FilterDrawer } from "./FilterDrawer";
import { CandidateCard, CandidateProps } from "./CandidateCard";
import { Search, Filter, Download } from "lucide-react";

// Mock data based on the Pencil designs
const mockCandidates: CandidateProps[] = [
    {
        id: "1",
        name: "Jimmy Morris",
        initials: "JM",
        avatarColor: "#F59E0B",
        title: "Project Manager - Project Manager at Majordome Digital",
        company: "Majordome Digital",
        location: "Paris, Ile-De-France, France",
        education: "Burgundy School of Business - BSB",
        skills: ["Primavera P6", "Construction", "AutoCAD", "FIDIC"],
        companyInitials: "MD",
        companyColor: "#475569"
    },
    {
        id: "2",
        name: "Robert Davis",
        initials: "RD",
        avatarColor: "#F97316",
        title: "Project Manager, Project Manager at Marya construction",
        company: "Marya construction",
        location: "Latvia",
        education: "Middle East Technical University",
        skills: ["Primavera P6", "Construction", "AutoCAD", "FIDIC"],
        companyInitials: "MC",
        companyColor: "#EF4444"
    },
    {
        id: "3",
        name: "Hector Ramirez",
        initials: "HR",
        avatarColor: "#3B82F6",
        title: "Project Manager at viastore SYSTEMS España",
        company: "viastore SYSTEMS España",
        location: "Madrid, ES",
        education: "Universidad Europea",
        skills: ["Primavera P6", "Construction", "AutoCAD", "FIDIC"],
        companyInitials: "VSE",
        companyColor: "#3B82F6"
    }
];

export function DatabaseSearchContent() {
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
    const [hasActiveFilters, setHasActiveFilters] = useState(false);

    const handleSelectCandidate = (id: string) => {
        setSelectedCandidateIds(prev => 
            prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
        );
    };

    const handleExport = () => {
        if (selectedCandidateIds.length > 0) {
            alert(`Exporting ${selectedCandidateIds.length} selected candidate(s) to Google Sheets / CSV!`);
        } else if (hasActiveFilters) {
            alert(`Exporting all ${mockCandidates.length} filtered candidate(s) to Google Sheets / CSV!`);
        }
    };

    const canExport = selectedCandidateIds.length > 0 || hasActiveFilters;

    return (
        <div className="flex flex-col lg:flex-row w-full h-full min-h-[calc(100vh-140px)]">
            {/* Desktop Left Sidebar Filters (FIXED to viewport) */}
            <div className="hidden lg:block w-[280px] bg-white border-r border-[#E2E8F0] shrink-0 sticky top-0 h-[calc(100vh-[140px])] overflow-y-auto">
                <SearchFilters 
                    onSearch={() => setHasActiveFilters(true)}
                    onClear={() => {
                        setHasActiveFilters(false);
                        setSelectedCandidateIds([]);
                    }}
                />
            </div>

            {/* Mobile/Tablet Filter Drawer */}
            <FilterDrawer 
                isOpen={isFilterDrawerOpen} 
                onClose={() => setIsFilterDrawerOpen(false)} 
                onSearch={() => {
                    setHasActiveFilters(true);
                    setIsFilterDrawerOpen(false);
                }}
                onClear={() => {
                    setHasActiveFilters(false);
                    setSelectedCandidateIds([]);
                    setIsFilterDrawerOpen(false);
                }}
            />

            {/* Main Results Area (SCROLLABLE independently of sidebar) */}
            <div className="flex flex-col flex-1 p-4 md:p-8 w-full max-w-full overflow-x-hidden">
                
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    {/* Desktop Header */}
                    <div className="hidden lg:flex items-center gap-4">
                        <h1 className="text-[24px] font-bold text-[#0e1b1a]">Database Search</h1>
                        <span className="px-3 py-1 bg-[#0f766d]/10 text-[#0f766d] text-[14px] font-bold rounded-full transition-all">
                            {selectedCandidateIds.length > 0 ? `${selectedCandidateIds.length} selected` : '737,682 results'}
                        </span>
                    </div>

                    {/* Mobile/Tablet Header & Mobile Tools */}
                    <div className="flex flex-col gap-4 lg:hidden w-full">
                        <div className="flex max-w-full items-center justify-between gap-2 overflow-hidden">
                            <div className="flex items-center gap-2 md:gap-3 flex-shrink min-w-0">
                                <h1 className="text-[18px] md:text-[20px] font-bold text-[#0e1b1a] truncate">Database Search</h1>
                                <span className="px-2 py-1 bg-[#0f766d]/10 text-[#0f766d] text-[11px] md:text-[12px] font-bold rounded-full whitespace-nowrap transition-all hidden sm:inline-block">
                                    {selectedCandidateIds.length > 0 ? `${selectedCandidateIds.length} selected` : '737,682 results'}
                                </span>
                            </div>
                            <button 
                                onClick={handleExport}
                                disabled={!canExport}
                                className={`flex items-center gap-2 px-3 h-8 md:h-9 border rounded-lg text-[12px] md:text-[13px] font-medium shadow-sm shrink-0 transition-colors ${
                                    canExport 
                                        ? "bg-white border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0e1b1a]" 
                                        : "bg-[#F1F5F9] border-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"
                                }`}
                            >
                                <Download className={`w-3.5 h-3.5 ${canExport ? "text-[#0f766d]" : "text-[#94A3B8]"}`} />
                                <span className="hidden xs:inline">Export</span>
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-2 w-full">
                            <button 
                                onClick={() => setIsFilterDrawerOpen(true)}
                                className="flex items-center gap-2 px-3 h-11 bg-white border border-[#E2E8F0] rounded-lg text-[#0e1b1a] text-[14px] font-medium shrink-0"
                            >
                                <Filter className="w-5 h-5 text-[#64748B]" />
                                Filters
                                {hasActiveFilters && <span className="flex items-center justify-center w-5 h-5 ml-1 bg-[#0f766d] text-white text-[11px] font-bold rounded-full">!</span>}
                            </button>
                            
                            <div className="relative flex-1 min-w-0">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                                <input
                                    type="text"
                                    placeholder="Search by title or skills"
                                    onChange={(e) => {
                                        if (e.target.value.trim().length > 0) {
                                            setHasActiveFilters(true);
                                        }
                                    }}
                                    className="w-full h-11 pl-10 pr-3 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg text-[13px] sm:text-[14px] focus:outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Desktop Toolbar */}
                    <div className="hidden lg:flex items-center justify-end gap-3 flex-1">
                           <button 
                                onClick={handleExport}
                                disabled={!canExport}
                                className={`flex items-center gap-2 px-4 h-11 border rounded-lg text-[14px] font-medium shadow-sm transition-colors whitespace-nowrap ${
                                    canExport 
                                        ? "bg-white border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0e1b1a]" 
                                        : "bg-[#F1F5F9] border-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"
                                }`}
                           >
                                <Download className={`w-4 h-4 ${canExport ? "text-[#0f766d]" : "text-[#94A3B8]"}`} />
                                {selectedCandidateIds.length > 0 ? `Export ${selectedCandidateIds.length} to sheet` : 'Export to sheet'}
                           </button>
                           <div className="relative w-full max-w-[400px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                                <input
                                    type="text"
                                    placeholder="Search candidates by title or skills"
                                    onChange={(e) => {
                                        if (e.target.value.trim().length > 0) {
                                            setHasActiveFilters(true);
                                        }
                                    }}
                                    className="w-full h-11 pl-10 pr-3 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg text-[14px] focus:outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d]"
                                />
                         </div>
                    </div>
                </div>

                {/* Candidate Results List */}
                <div className="flex flex-col w-full">
                    {mockCandidates.map((candidate) => (
                        <CandidateCard 
                            key={candidate.id} 
                            candidate={candidate} 
                            isSelected={selectedCandidateIds.includes(candidate.id)}
                            onSelect={handleSelectCandidate}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
