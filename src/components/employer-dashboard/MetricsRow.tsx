import { TrendingUp, TrendingDown } from "lucide-react";

const metrics = [
    {
        label: "Active Jobs",
        value: "24",
        trend: "+12%",
        trendUp: true,
        isDark: true,
    },
    {
        label: "Total Applications",
        value: "1,847",
        trend: "+8.3%",
        trendUp: true,
        isDark: false,
    },
    {
        label: "Candidates Shortlisted",
        value: "312",
        trend: "+15%",
        trendUp: true,
        isDark: false,
    },
    {
        label: "Interviews Scheduled",
        value: "56",
        trend: "-3.2%",
        trendUp: false,
        isDark: false,
    },
];

export function MetricsRow() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {metrics.map((m) => (
                <div
                    key={m.label}
                    className={`flex flex-col gap-1.5 md:gap-2 p-3.5 md:p-[18px] rounded-[10px] ${m.isDark
                            ? "bg-[#0e1b1a] text-white"
                            : "bg-white text-[#0e1b1a] border border-[#E2E8F0]"
                        }`}
                >
                    <span
                        className={`text-[11px] md:text-xs font-medium ${m.isDark ? "text-white/60" : "text-[#64748B]"
                            }`}
                    >
                        {m.label}
                    </span>
                    <div className="flex items-end justify-between">
                        <span className="text-2xl md:text-[28px] font-bold tracking-tight leading-none">
                            {m.value}
                        </span>
                        <span
                            className={`hidden md:flex items-center gap-0.5 text-xs font-medium ${m.trendUp ? "text-[#22C55E]" : "text-[#EF4444]"
                                }`}
                        >
                            {m.trendUp ? (
                                <TrendingUp size={14} />
                            ) : (
                                <TrendingDown size={14} />
                            )}
                            {m.trend}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
