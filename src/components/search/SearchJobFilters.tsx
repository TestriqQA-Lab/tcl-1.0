"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, X, Star, Clock, Briefcase, IndianRupee, MapPin, Building2, Layers, Search } from "lucide-react";
import { 
    WORK_MODE_FILTERS, 
    EXPERIENCE_OPTIONS, 
    SALARY_FILTERS, 
    DEPARTMENT_FILTERS, 
    COMPANY_TYPE_FILTERS, 
    INDUSTRY_FILTERS, 
    ROLE_CATEGORY_FILTERS,
    POSTED_BY_FILTERS,
    DATE_POSTED_FILTERS,
    INDIAN_CITIES
} from "@/data/search-mock-data";

interface FilterSectionProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

function FilterSection({ title, icon, children, defaultOpen = true }: FilterSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-slate-100 py-4 px-2">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full focus:outline-none group"
            >
                <div className="flex items-center gap-2">
                    {icon && <span className="text-slate-400 group-hover:text-[#0f766d] transition-colors">{icon}</span>}
                    <span className="font-bold text-[14px] text-slate-800 group-hover:text-[#0f766d] transition-colors uppercase tracking-tight">{title}</span>
                </div>
                {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
            </button>
            {isOpen && <div className="mt-4 animate-in fade-in slide-in-from-top-1 duration-200">{children}</div>}
        </div>
    );
}

// Reusable Autocomplete component for filter sections
interface AutocompleteSearchProps {
    placeholder: string;
    options: string[];
    selectedValues: string[];
    onAdd: (value: string) => void;
    onRemove: (value: string) => void;
}

function AutocompleteSearch({ placeholder, options, selectedValues, onAdd, onRemove }: AutocompleteSearchProps) {
    const [input, setInput] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter(opt => 
        opt.toLowerCase().includes(input.toLowerCase()) && 
        !selectedValues.includes(opt)
    ).slice(0, 10);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="space-y-3" ref={containerRef}>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search size={14} />
                </div>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-[13px] outline-none focus:border-[#0f766d] focus:bg-white transition-all"
                />
                
                {/* Suggestions Dropdown */}
                {showSuggestions && (input.length > 0 || filteredOptions.length > 0) && (
                    <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/50 max-h-48 overflow-y-auto overflow-x-hidden animate-in fade-in zoom-in-95 duration-100">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        onAdd(opt);
                                        setInput("");
                                        setShowSuggestions(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-[13px] text-slate-600 hover:bg-slate-50 hover:text-[#0f766d] transition-colors border-b border-slate-50 last:border-0"
                                >
                                    {opt}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-[12px] text-slate-400 italic">No matches found</div>
                        )}
                    </div>
                )}
            </div>

            {/* Selected Tags */}
            {selectedValues.length > 0 && (
                <div className="flex flex-wrap gap-2 animate-in fade-in duration-300">
                    {selectedValues.map(val => (
                        <div 
                            key={val}
                            className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 text-[#0f766d] border border-teal-100 rounded-full text-[12px] font-medium transition-all hover:border-[#0f766d]/30"
                        >
                            <span className="truncate max-w-[150px]">{val}</span>
                            <button 
                                onClick={() => onRemove(val)}
                                className="hover:text-red-500 transition-colors shrink-0"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export interface JobFilterState {
    freshness: string;
    experience: string;
    salaryRange: string[];
    workModes: string[];
    locations: string[];
    industries: string[];
    departments: string[];
    companyTypes: string;
    roleCategories: string[];
    postedBy: string[];
}

interface SearchJobFiltersProps {
    filters: JobFilterState;
    onChange: (filters: JobFilterState) => void;
    onClear: () => void;
}

export function SearchJobFilters({ filters, onChange, onClear }: SearchJobFiltersProps) {
    
    const toggleArrayFilter = (key: keyof JobFilterState, value: string) => {
        const current = filters[key] as string[];
        const updated = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        onChange({ ...filters, [key]: updated });
    };

    const updateSingleFilter = (key: keyof JobFilterState, value: string) => {
        onChange({ ...filters, [key]: value });
    };

    const addValueToArray = (key: keyof JobFilterState, value: string) => {
        const current = filters[key] as string[];
        if (!current.includes(value)) {
            onChange({ ...filters, [key]: [...current, value] });
        }
    };

    const removeValueFromArray = (key: keyof JobFilterState, value: string) => {
        const current = filters[key] as string[];
        onChange({ ...filters, [key]: current.filter(v => v !== value) });
    };

    return (
        <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-slate-50/50 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#0f766d]" />
                    <h2 className="text-[15px] font-bold text-slate-900">All Filters</h2>
                </div>
                <button 
                    onClick={onClear}
                    className="text-[12px] text-[#0f766d] font-bold hover:underline"
                >
                    Clear all
                </button>
            </div>

            {/* Scrollable Filters */}
            <div className="overflow-y-auto max-h-[calc(100vh-250px)] custom-scrollbar pb-10">
                {/* Location Autocomplete */}
                <FilterSection title="Location" icon={<MapPin size={16} />}>
                    <AutocompleteSearch 
                        placeholder="Type city name..."
                        options={INDIAN_CITIES}
                        selectedValues={filters.locations}
                        onAdd={(val) => addValueToArray("locations", val)}
                        onRemove={(val) => removeValueFromArray("locations", val)}
                    />
                </FilterSection>

                {/* Freshness */}
                <FilterSection title="Freshness" icon={<Clock size={16} />}>
                    <div className="flex flex-wrap gap-2">
                        {DATE_POSTED_FILTERS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => updateSingleFilter("freshness", opt.value)}
                                className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all border ${
                                    filters.freshness === opt.value
                                        ? "bg-[#0f766d] border-[#0f766d] text-white shadow-md shadow-[#0f766d]/20"
                                        : "bg-white border-slate-200 text-slate-600 hover:border-[#0f766d] hover:text-[#0f766d]"
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </FilterSection>

                {/* Experience */}
                <FilterSection title="Experience" icon={<Briefcase size={16} />}>
                    <select 
                        value={filters.experience}
                        onChange={(e) => updateSingleFilter("experience", e.target.value)}
                        className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-700 outline-none focus:border-[#0f766d] transition-all cursor-pointer hover:border-slate-300"
                    >
                        {EXPERIENCE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </FilterSection>

                {/* Salary */}
                <FilterSection title="Salary" icon={<IndianRupee size={16} />} defaultOpen={false}>
                    <div className="space-y-2">
                        {SALARY_FILTERS.map(salary => (
                            <label key={salary} className="flex items-center gap-2.5 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        className="peer sr-only"
                                        checked={filters.salaryRange.includes(salary)}
                                        onChange={() => toggleArrayFilter("salaryRange", salary)}
                                    />
                                    <div className="w-4 h-4 border-2 border-slate-300 rounded peer-checked:bg-[#0f766d] peer-checked:border-[#0f766d] transition-all"></div>
                                    <X className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity left-0.5" />
                                </div>
                                <span className="text-[13px] text-slate-600 group-hover:text-slate-900 transition-colors">{salary}</span>
                            </label>
                        ))}
                    </div>
                </FilterSection>

                {/* Work Mode */}
                <FilterSection title="Work Mode" icon={<Building2 size={16} />}>
                    <div className="space-y-2">
                        {WORK_MODE_FILTERS.map(mode => (
                            <label key={mode} className="flex items-center gap-2.5 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        className="peer sr-only"
                                        checked={filters.workModes.includes(mode)}
                                        onChange={() => toggleArrayFilter("workModes", mode)}
                                    />
                                    <div className="w-4 h-4 border-2 border-slate-300 rounded peer-checked:bg-[#0f766d] peer-checked:border-[#0f766d] transition-all"></div>
                                    <X className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity left-0.5" />
                                </div>
                                <span className="text-[13px] text-slate-600 group-hover:text-slate-900 transition-colors">{mode}</span>
                            </label>
                        ))}
                    </div>
                </FilterSection>

                {/* Role Category */}
                <FilterSection title="Role Category" icon={<Star size={16} />}>
                    <AutocompleteSearch 
                        placeholder="Type role category..."
                        options={ROLE_CATEGORY_FILTERS}
                        selectedValues={filters.roleCategories}
                        onAdd={(val) => addValueToArray("roleCategories", val)}
                        onRemove={(val) => removeValueFromArray("roleCategories", val)}
                    />
                </FilterSection>

                {/* Department */}
                <FilterSection title="Department" icon={<Layers size={16} />}>
                    <AutocompleteSearch 
                        placeholder="Type department..."
                        options={DEPARTMENT_FILTERS}
                        selectedValues={filters.departments}
                        onAdd={(val) => addValueToArray("departments", val)}
                        onRemove={(val) => removeValueFromArray("departments", val)}
                    />
                </FilterSection>

                {/* Industry */}
                <FilterSection title="Industry" icon={<Building2 size={16} />}>
                    <AutocompleteSearch 
                        placeholder="Type industry..."
                        options={INDUSTRY_FILTERS}
                        selectedValues={filters.industries}
                        onAdd={(val) => addValueToArray("industries", val)}
                        onRemove={(val) => removeValueFromArray("industries", val)}
                    />
                </FilterSection>

                {/* Company Type */}
                <FilterSection title="Company Type" icon={<Building2 size={16} />} defaultOpen={false}>
                    <select 
                        value={filters.companyTypes}
                        onChange={(e) => updateSingleFilter("companyTypes", e.target.value)}
                        className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-700 outline-none focus:border-[#0f766d] transition-all cursor-pointer hover:border-slate-300"
                    >
                        <option value="">Select Company Type</option>
                        {COMPANY_TYPE_FILTERS.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </FilterSection>

                {/* Posted By */}
                <FilterSection title="Posted By" icon={<Layers size={16} />} defaultOpen={false}>
                    <div className="space-y-2">
                        {POSTED_BY_FILTERS.map(by => (
                            <label key={by} className="flex items-center gap-2.5 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        className="peer sr-only"
                                        checked={filters.postedBy.includes(by)}
                                        onChange={() => toggleArrayFilter("postedBy", by)}
                                    />
                                    <div className="w-4 h-4 border-2 border-slate-300 rounded peer-checked:bg-[#0f766d] peer-checked:border-[#0f766d] transition-all"></div>
                                    <X className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity left-0.5" />
                                </div>
                                <span className="text-[13px] text-slate-600 group-hover:text-slate-900 transition-colors">{by}</span>
                            </label>
                        ))}
                    </div>
                </FilterSection>
            </div>
            
            {/* Action Area */}
            <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button 
                  onClick={() => {}} // This will be handled by the parent
                  className="w-full bg-[#0f766d] hover:bg-[#0d635c] text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-[#0f766d]/10 active:scale-[0.98]"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );
}
