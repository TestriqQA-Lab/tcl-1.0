const statusLabels = ["All", "In Review", "Shortlisted", "Rejected"];

interface StatusFilterTabsProps {
    activeStatus?: string;
    selectedJob?: string;
    onFilterChange?: (filter: string) => void;
    counts?: Record<string, number>;
}

export function StatusFilterTabs({ 
    activeStatus = "All", 
    onFilterChange,
    counts = { "All": 0, "In Review": 0, "Shortlisted": 0, "Rejected": 0 }
}: StatusFilterTabsProps) {
    const handleClick = (label: string) => {
        onFilterChange?.(label);
    };

    return (
        <div className="flex items-center w-full overflow-x-auto border-b border-[#E2E8F0] scrollbar-none">
            {statusLabels.map((label) => {
                const isActive = label === activeStatus;
                const count = counts[label] ?? 0;
                return (
                    <button
                        key={label}
                        onClick={() => handleClick(label)}
                        className={`flex items-center gap-2 h-10 px-4 md:px-[18px] shrink-0 text-[13px] transition-colors border-b-2 ${isActive
                            ? "text-[#0f766d] font-semibold border-[#0f766d]"
                            : "text-[#64748B] font-normal border-transparent hover:text-[#334155]"
                            }`}
                    >
                        {label}
                        <span
                            className={`px-2 py-0.5 text-[11px] font-medium rounded-[10px] ${isActive
                                ? "bg-[#0f766d] text-white"
                                : "bg-[#F1F5F9] text-[#64748B]"
                                }`}
                        >
                            {count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
