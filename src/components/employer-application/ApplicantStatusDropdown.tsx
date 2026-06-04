"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export type ApplicationStatus = "Shortlisted" | "In Review" | "Interview" | "Rejected" | "Accepted";

const statusStyles: Record<string, { bg: string; text: string }> = {
    Shortlisted: { bg: "bg-[#DCFCE7]", text: "text-[#16A34A]" },
    "In Review": { bg: "bg-[#FEF3C7]", text: "text-[#D97706]" },
    Interview: { bg: "bg-[#DBEAFE]", text: "text-[#2563EB]" },
    Rejected: { bg: "bg-[#FEE2E2]", text: "text-[#EF4444]" },
    Accepted: { bg: "bg-[#E0F2FE]", text: "text-[#0369A1]" },
};

interface ApplicantStatusDropdownProps {
    currentStatus: ApplicationStatus;
    onStatusChange: (newStatus: ApplicationStatus) => void;
}

export function ApplicantStatusDropdown({ currentStatus, onStatusChange }: ApplicantStatusDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const style = statusStyles[currentStatus] || { bg: "bg-gray-100", text: "text-gray-600" };
    const options: ApplicationStatus[] = ["In Review", "Shortlisted", "Rejected"];

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (status: ApplicationStatus) => {
        onStatusChange(status);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border border-transparent hover:border-black/5 transition-colors cursor-pointer ${style.bg} ${style.text}`}
            >
                {currentStatus}
                <ChevronDown size={12} className="opacity-70" />
            </button>

            {isOpen && (
                <div className="absolute left-0 z-50 mt-1 w-32 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="p-1" role="none">
                        {options.map((option) => (
                            <button
                                key={option}
                                onClick={(e) => { e.stopPropagation(); handleSelect(option); }}
                                className={`w-full text-left flex items-center px-3 py-1.5 text-[12px] rounded-md transition-colors ${option === currentStatus ? "bg-[#F1F5F9] font-medium text-[#0e1b1a]" : "text-[#334155] hover:bg-[#F8FAFB]"}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
