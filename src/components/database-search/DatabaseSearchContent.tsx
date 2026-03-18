"use client";

import { useState, useEffect } from "react";
import { SearchFilters, SearchFilterState } from "./SearchFilters";
import { FilterDrawer } from "./FilterDrawer";
import { CandidateCard, CandidateProps } from "./CandidateCard";
import { Search, Filter, Download } from "lucide-react";

import { getSeekerProfilesForEmployerAction } from "@/actions/employer.seeker.actions";
import { ExportPreviewModal } from "./ExportPreviewModal";

interface DatabaseSearchContentProps {
    initialCandidates?: CandidateProps[];
    initialTotalResults?: number;
}

const DEFAULT_FILTERS: SearchFilterState = {
    query: "",
    location: "",
    company: "",
    skills: [],
    experienceMin: "",
    experienceMax: "",
    industry: "",
    educationLevel: "",
    ageMin: "",
    ageMax: "",
    ctcMin: "",
    ctcMax: "",
    gender: "any"
};

export function DatabaseSearchContent({ 
    initialCandidates = [], 
    initialTotalResults = 0 
}: DatabaseSearchContentProps) {
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
    const [hasActiveFilters, setHasActiveFilters] = useState(false);
    
    // Lifted Filter State
    const [filters, setFilters] = useState<SearchFilterState>(DEFAULT_FILTERS);

    const [debouncedFilters, setDebouncedFilters] = useState<SearchFilterState>(filters);
    
    // API State
    const [candidates, setCandidates] = useState<CandidateProps[]>(initialCandidates);
    const [isLoading, setIsLoading] = useState(false);
    const [totalResults, setTotalResults] = useState(initialTotalResults);

    // Debounce effect: sync filters to debouncedFilters after a delay
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilters(filters);
            
            // Update active filter status
            const isActive = filters.query.trim().length > 0 || 
                            filters.location !== "" || 
                            filters.company !== "" || 
                            filters.skills.length > 0 || 
                            filters.experienceMin !== "" || 
                            filters.experienceMax !== "" || 
                            filters.industry !== "" || 
                            filters.educationLevel !== "" || 
                            filters.ageMin !== "" || 
                            filters.ageMax !== "" || 
                            filters.ctcMin !== "" || 
                            filters.ctcMax !== "" || 
                            filters.gender !== "any";
            setHasActiveFilters(isActive);
        }, 500); // 500ms debounce

        return () => clearTimeout(handler);
    }, [filters]);

    // Fetch when DEBOUNCED filters change
    useEffect(() => {
        // Skip initial fetch on mount since we have initialCandidates
        if (debouncedFilters === DEFAULT_FILTERS && candidates === initialCandidates) return;
        
        fetchCandidates(debouncedFilters);
    }, [debouncedFilters]);

    const fetchCandidates = async (currentFilters: SearchFilterState) => {
        setIsLoading(true);
        try {
            const result = await getSeekerProfilesForEmployerAction({
                ...currentFilters,
            });
            setCandidates(result.data || []);
            setTotalResults(result.totalCount || result.data?.length || 0);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectCandidate = (id: string) => {
        setSelectedCandidateIds(prev => 
            prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
        );
    };

    const handleTopSearch = (query: string) => {
        setFilters(prev => ({ ...prev, query }));
    };

    const handleFilterSearch = (newFilters: SearchFilterState) => {
        setFilters(newFilters);
        setSelectedCandidateIds([]);
        setIsFilterDrawerOpen(false);
    };

    const handleClearFilters = () => {
        setFilters(DEFAULT_FILTERS);
        setSelectedCandidateIds([]);
        setIsFilterDrawerOpen(false);
    };

    const handleSelectAll = () => {
        if (selectedCandidateIds.length === candidates.length && candidates.length > 0) {
            setSelectedCandidateIds([]);
        } else {
            setSelectedCandidateIds(candidates.map(c => c.id));
        }
    };

    const handleExport = () => {
        if (candidates.length === 0) return;
        setIsExportModalOpen(true);
    };

    const handleDownload = () => {
        const candidatesToExport = selectedCandidateIds.length > 0
            ? candidates.filter(c => selectedCandidateIds.includes(c.id))
            : candidates;

        if (candidatesToExport.length === 0) return;

        // Generate CSV content
        const headers = ["Name", "Company", "Role", "Location", "Education", "Skills"];
        const rows = candidatesToExport.map(c => [
            c.name,
            c.company,
            c.title.split(' at ')[0],
            c.location,
            c.education,
            (c.skills || []).join("; ")
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(","))
        ].join("\n");

        // Trigger download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `candidates_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsExportModalOpen(false);
    };

    const canExport = selectedCandidateIds.length > 0 || candidates.length > 0;
    const isAllSelected = candidates.length > 0 && selectedCandidateIds.length === candidates.length;

    return (
        <div className="flex flex-col lg:flex-row w-full h-full min-h-[calc(100vh-140px)]">
            {/* Desktop Left Sidebar Filters (FIXED to viewport) */}
            <div className="hidden lg:block w-[280px] bg-white border-r border-[#E2E8F0] shrink-0 sticky top-0 h-screen overflow-hidden">
                <SearchFilters 
                    initialFilters={filters}
                    onSearch={handleFilterSearch}
                    onClear={handleClearFilters}
                />
            </div>

            {/* Mobile/Tablet Filter Drawer */}
            <FilterDrawer 
                isOpen={isFilterDrawerOpen} 
                onClose={() => setIsFilterDrawerOpen(false)} 
                initialFilters={filters}
                onSearch={handleFilterSearch}
                onClear={handleClearFilters}
            />

            {/* Main Results Area (SCROLLABLE independently of sidebar) */}
            <div className="flex flex-col flex-1 p-4 md:p-8 w-full max-w-full overflow-x-hidden">
                
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    {/* Desktop Header */}
                    <div className="hidden lg:flex items-center gap-4">
                        <h1 className="text-[24px] font-bold text-[#0e1b1a]">Database Search</h1>
                        <span className="px-3 py-1 bg-[#0f766d]/10 text-[#0f766d] text-[14px] font-bold rounded-full transition-all">
                            {selectedCandidateIds.length > 0 ? `${selectedCandidateIds.length} selected` : `${totalResults.toLocaleString()} results`}
                        </span>
                    </div>

                    {/* Mobile/Tablet Header & Mobile Tools */}
                    <div className="flex flex-col gap-4 lg:hidden w-full">
                        <div className="flex max-w-full items-center justify-between gap-2 overflow-hidden">
                            <div className="flex items-center gap-2 md:gap-3 flex-shrink min-w-0">
                                <h1 className="text-[18px] md:text-[20px] font-bold text-[#0e1b1a] truncate">Database Search</h1>
                                <span className="px-2 py-1 bg-[#0f766d]/10 text-[#0f766d] text-[11px] md:text-[12px] font-bold rounded-full whitespace-nowrap transition-all hidden sm:inline-block">
                                    {selectedCandidateIds.length > 0 ? `${selectedCandidateIds.length} selected` : `${totalResults.toLocaleString()} results`}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <input 
                                        type="checkbox" 
                                        id="select-all-mobile"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                        className="size-4 rounded border-[#E2E8F0] text-[#0f766d] focus:ring-[#0f766d] cursor-pointer"
                                    />
                                    <label htmlFor="select-all-mobile" className="text-[12px] font-medium text-[#64748B] cursor-pointer whitespace-nowrap hidden xs:inline">
                                        All
                                    </label>
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
                                    value={filters.query}
                                    placeholder="Search by title or skills"
                                    onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                                    className="w-full h-11 pl-10 pr-3 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg text-[13px] sm:text-[14px] focus:outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Desktop Toolbar */}
                    <div className="hidden lg:flex items-center justify-end gap-3 flex-1">
                           <div className="flex items-center gap-2 mr-4">
                               <input 
                                   type="checkbox" 
                                   id="select-all"
                                   checked={isAllSelected}
                                   onChange={handleSelectAll}
                                   className="size-4 rounded border-[#E2E8F0] text-[#0f766d] focus:ring-[#0f766d] cursor-pointer"
                               />
                               <label htmlFor="select-all" className="text-[14px] font-medium text-[#64748B] cursor-pointer whitespace-nowrap">
                                   Select All
                               </label>
                           </div>
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
                                {selectedCandidateIds.length > 0 ? `Export ${selectedCandidateIds.length} to sheet` : 'Export all to sheet'}
                           </button>
                           <div className="relative w-full max-w-[400px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                                <input
                                    type="text"
                                    value={filters.query}
                                    placeholder="Search candidates by title or skills"
                                    onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                                    className="w-full h-11 pl-10 pr-3 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg text-[14px] focus:outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d]"
                                />
                         </div>
                    </div>
                </div>

                {/* Candidate Results List */}
                <div className="flex flex-col w-full">
                    {isLoading ? (
                        <div className="w-full py-12 flex justify-center items-center">
                            <div className="animate-spin w-8 h-8 border-4 border-[#0f766d] border-t-transparent rounded-full" />
                        </div>
                    ) : candidates.length > 0 ? (
                        candidates.map((candidate) => (
                            <CandidateCard 
                                key={candidate.id} 
                                candidate={candidate} 
                                isSelected={selectedCandidateIds.includes(candidate.id)}
                                onSelect={handleSelectCandidate}
                            />
                        ))
                    ) : (
                        <div className="w-full py-12 flex flex-col justify-center items-center text-center">
                            <h3 className="text-[18px] font-bold text-[#0e1b1a] mb-2">No Candidates Found</h3>
                            <p className="text-[#64748B] text-[14px]">Try adjusting your filters or search query to find more results.</p>
                            <button 
                                onClick={handleClearFilters}
                                className="mt-4 px-4 py-2 bg-[#0f766d]/10 text-[#0f766d] font-bold rounded-lg text-[14px]"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Export Preview Modal */}
            <ExportPreviewModal 
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                candidates={selectedCandidateIds.length > 0 
                    ? candidates.filter(c => selectedCandidateIds.includes(c.id))
                    : candidates
                }
                onDownload={handleDownload}
            />
        </div>
    );
}
