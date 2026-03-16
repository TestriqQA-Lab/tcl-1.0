"use client";

import { X } from "lucide-react";
import { SearchFilters, SearchFilterState } from "./SearchFilters";
import { useEffect } from "react";

interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSearch?: (filters: SearchFilterState) => void;
    onClear?: () => void;
    initialFilters?: Partial<SearchFilterState>;
}

export function FilterDrawer({ isOpen, onClose, onSearch, onClear, initialFilters }: FilterDrawerProps) {
    // Prevent body scrolling when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
             document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
                    onClick={onClose}
                />
            )}

            {/* Sliding Drawer */}
            <div
                className={`fixed top-0 left-0 bottom-0 z-50 w-[300px] bg-white transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Header with Close Button */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-[#E2E8F0] shrink-0">
                    <h2 className="text-[18px] font-bold text-[#0e1b1a]">Filters</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 -mr-2 text-[#64748B] hover:text-[#0e1b1a] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Filters Content Area */}
                <SearchFilters 
                    onSearch={(filters) => {
                        if (onSearch) onSearch(filters);
                    }} 
                    onClear={onClear} 
                    initialFilters={initialFilters}
                />
            </div>
        </>
    );
}
