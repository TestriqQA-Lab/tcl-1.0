"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface CompanyFiltersProps {
    industries: string[];
    locations: string[];
    totalResults: number;
}

const companySizes = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

export function CompanyFilters({ industries, locations, totalResults }: CompanyFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Parse current multi-select filters from URL (comma-separated)
    const currentIndustries = searchParams.get("industry")?.split(",").filter(Boolean) || [];
    const currentLocations = searchParams.get("location")?.split(",").filter(Boolean) || [];
    const currentSize = searchParams.get("companySize") || "";
    const currentSearch = searchParams.get("search") || "";

    const hasActiveFilters = !!(currentIndustries.length || currentLocations.length || currentSize);

    const applyMultiFilter = (key: string, values: string[]) => {
        const params = new URLSearchParams(searchParams.toString());
        if (values.length > 0) {
            params.set(key, values.join(","));
        } else {
            params.delete(key);
        }
        params.delete("page");
        router.push(`/companies?${params.toString()}`, { scroll: false });
    };

    const applySingleFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.delete("page");
        router.push(`/companies?${params.toString()}`, { scroll: false });
    };

    const clearAll = () => {
        const params = new URLSearchParams();
        if (currentSearch) params.set("search", currentSearch);
        router.push(`/companies?${params.toString()}`, { scroll: false });
    };

    // Toggle selection in multi-select
    const toggleIndustry = (ind: string) => {
        const updated = currentIndustries.includes(ind)
            ? currentIndustries.filter(i => i !== ind)
            : [...currentIndustries, ind];
        applyMultiFilter("industry", updated);
    };

    const toggleLocation = (loc: string) => {
        const updated = currentLocations.includes(loc)
            ? currentLocations.filter(l => l !== loc)
            : [...currentLocations, loc];
        applyMultiFilter("location", updated);
    };

    useEffect(() => {
        if (isMobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isMobileOpen]);

    const filterContent = (
        <div className="space-y-6">
            {/* Results Count + Clear */}
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800">
                    {totalResults} {totalResults === 1 ? "company" : "companies"}
                </p>
                {hasActiveFilters && (
                    <button
                        onClick={clearAll}
                        className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Industry Multi-select Dropdown */}
            <FilterSection title="Industry" icon="category">
                <MultiSelectDropdown
                    options={industries}
                    selected={currentIndustries}
                    onToggle={toggleIndustry}
                    placeholder="Select industries..."
                />
            </FilterSection>

            {/* Location Multi-select Dropdown */}
            <FilterSection title="Location" icon="location_on">
                <MultiSelectDropdown
                    options={locations}
                    selected={currentLocations}
                    onToggle={toggleLocation}
                    placeholder="Select locations..."
                />
            </FilterSection>

            {/* Company Size Filter */}
            <FilterSection title="Company Size" icon="group">
                <div className="flex flex-wrap gap-2">
                    {companySizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => applySingleFilter("companySize", currentSize === size ? "" : size)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                                currentSize === size
                                    ? "bg-[#0f766d] text-white border-[#0f766d]"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-[#0f766d]/30 hover:text-[#0f766d]"
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </FilterSection>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-[260px] xl:w-[280px] shrink-0">
                <div className="sticky top-20 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-5">
                        <span className="material-symbols-outlined text-[#0f766d]" style={{ fontSize: "20px" }}>tune</span>
                        <h2 className="text-sm font-bold text-gray-900">Filters</h2>
                    </div>
                    {filterContent}
                </div>
            </aside>

            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4 flex items-center gap-3">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-[#0f766d]/30 transition-colors shadow-sm cursor-pointer"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>tune</span>
                    Filters
                    {hasActiveFilters && (
                        <span className="w-5 h-5 rounded-full bg-[#0f766d] text-white text-[10px] font-bold flex items-center justify-center">
                            {[...currentIndustries, ...currentLocations, currentSize].filter(Boolean).length}
                        </span>
                    )}
                </button>
                <p className="text-sm text-gray-500">
                    {totalResults} {totalResults === 1 ? "result" : "results"}
                </p>
            </div>

            {/* Mobile Filter Drawer */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-[200] lg:hidden">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#0f766d]" style={{ fontSize: "20px" }}>tune</span>
                                <h2 className="text-base font-bold text-gray-900">Filters</h2>
                            </div>
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>close</span>
                            </button>
                        </div>
                        <div className="p-5">{filterContent}</div>
                        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="w-full bg-[#0f766d] text-white font-semibold py-3 rounded-xl hover:bg-[#0a5f57] transition-colors cursor-pointer"
                            >
                                Show Results
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

/* ——— Sub-components ——— */

function FilterSection({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-gray-400" style={{ fontSize: "16px" }}>{icon}</span>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
            </div>
            {children}
        </div>
    );
}

function MultiSelectDropdown({
    options,
    selected,
    onToggle,
    placeholder,
}: {
    options: string[];
    selected: string[];
    onToggle: (value: string) => void;
    placeholder: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const filtered = options.filter(o =>
        o.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative" ref={ref}>
            {/* Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-left hover:border-gray-300 focus:border-[#0f766d]/40 focus:ring-2 focus:ring-[#0f766d]/10 transition-all cursor-pointer"
            >
                <span className="text-sm text-gray-500 truncate">
                    {selected.length > 0 ? `${selected.length} selected` : placeholder}
                </span>
                <span className="material-symbols-outlined text-gray-400 shrink-0" style={{ fontSize: "18px" }}>
                    {isOpen ? "expand_less" : "expand_more"}
                </span>
            </button>

            {/* Selected Tags */}
            {selected.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {selected.map(item => (
                        <span
                            key={item}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0f766d] bg-[#0f766d]/5 border border-[#0f766d]/10 px-2 py-0.5 rounded-md"
                        >
                            {item}
                            <button
                                onClick={(e) => { e.stopPropagation(); onToggle(item); }}
                                className="hover:text-red-500 cursor-pointer"
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>close</span>
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-hidden">
                    {/* Search inside dropdown */}
                    <div className="p-2 border-b border-gray-100">
                        <div className="flex items-center gap-2 bg-gray-50 rounded-md px-2.5 py-1.5">
                            <span className="material-symbols-outlined text-gray-400" style={{ fontSize: "16px" }}>search</span>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search..."
                                className="w-full text-sm bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Options */}
                    <div className="max-h-40 overflow-y-auto py-1">
                        {filtered.length === 0 ? (
                            <p className="text-xs text-gray-400 px-3 py-2 text-center">No results found</p>
                        ) : (
                            filtered.map(option => {
                                const isSelected = selected.includes(option);
                                return (
                                    <button
                                        key={option}
                                        onClick={() => onToggle(option)}
                                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                                            isSelected ? "text-[#0f766d] font-medium" : "text-gray-600"
                                        }`}
                                    >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                            isSelected ? "bg-[#0f766d] border-[#0f766d]" : "border-gray-300"
                                        }`}>
                                            {isSelected && (
                                                <span className="material-symbols-outlined text-white" style={{ fontSize: "14px" }}>check</span>
                                            )}
                                        </div>
                                        <span className="truncate">{option}</span>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
