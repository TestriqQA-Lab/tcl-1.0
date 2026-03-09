"use client";

import { useState } from "react";
import { SearchFilters } from "./SearchFilters";
import { FilterDrawer } from "./FilterDrawer";
import { CandidateCard, CandidateProps } from "./CandidateCard";
import { Search, Filter } from "lucide-react";

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

    return (
        <div className="flex flex-col lg:flex-row w-full h-full min-h-[calc(100vh-140px)]">
            {/* Desktop Left Sidebar Filters (FIXED to viewport) */}
            <div className="hidden lg:block w-[280px] bg-white border-r border-[#E2E8F0] shrink-0 sticky top-0 h-[calc(100vh-[140px])] overflow-y-auto">
                <SearchFilters />
            </div>

            {/* Mobile/Tablet Filter Drawer */}
            <FilterDrawer 
                isOpen={isFilterDrawerOpen} 
                onClose={() => setIsFilterDrawerOpen(false)} 
            />

            {/* Main Results Area (SCROLLABLE independently of sidebar) */}
            <div className="flex flex-col flex-1 p-4 md:p-8 w-full max-w-full overflow-x-hidden">
                
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    {/* Desktop Header */}
                    <div className="hidden lg:flex items-center gap-4">
                        <h1 className="text-[24px] font-bold text-[#0e1b1a]">Database Search</h1>
                        <span className="px-3 py-1 bg-[#0f766d]/10 text-[#0f766d] text-[14px] font-bold rounded-full">
                            737,682 results
                        </span>
                    </div>

                    {/* Mobile/Tablet Header & Mobile Tools */}
                    <div className="flex flex-col gap-4 lg:hidden w-full">
                        <div className="flex items-center gap-3">
                            <h1 className="text-[20px] font-bold text-[#0e1b1a]">Database Search</h1>
                            <span className="px-3 py-1 bg-[#0f766d]/10 text-[#0f766d] text-[12px] font-bold rounded-full">
                                737,682 results
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-2 w-full">
                            <button 
                                onClick={() => setIsFilterDrawerOpen(true)}
                                className="flex items-center gap-2 px-3 h-11 bg-white border border-[#E2E8F0] rounded-lg text-[#0e1b1a] text-[14px] font-medium"
                            >
                                <Filter className="w-5 h-5 text-[#64748B]" />
                                Filters
                            </button>
                            
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                                <input
                                    type="text"
                                    placeholder="Search candidates by title or skills"
                                    className="w-full h-11 pl-10 pr-3 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg text-[14px] focus:outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Desktop Toolbar */}
                    <div className="hidden lg:flex items-center justify-end gap-3 flex-1">
                           <div className="relative w-full max-w-[400px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                                <input
                                    type="text"
                                    placeholder="Search candidates by title or skills"
                                    className="w-full h-11 pl-10 pr-3 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg text-[14px] focus:outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d]"
                                />
                         </div>
                    </div>
                </div>

                {/* Candidate Results List */}
                <div className="flex flex-col w-full">
                    {mockCandidates.map((candidate) => (
                        <CandidateCard key={candidate.id} candidate={candidate} />
                    ))}
                </div>
            </div>
        </div>
    );
}
