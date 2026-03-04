import Link from "next/link";
import {
    PlusCircle,
    Search,
    Calendar,
    Download,
} from "lucide-react";

const actions = [
    {
        label: "Post New Job",
        icon: PlusCircle,
        href: "/employer-dashboard/post-job",
    },
    {
        label: "Search Candidates",
        icon: Search,
        href: "/employer-dashboard/database-search",
    },
    {
        label: "Schedule Interview",
        icon: Calendar,
        href: "/employer-dashboard/interviews",
    },
    {
        label: "Export Reports",
        icon: Download,
        href: "#",
    },
];

export function QuickActionsPanel() {
    return (
        <div className="hidden lg:flex flex-col bg-white rounded-xl border border-[#E2E8F0] p-5 gap-3.5">
            <h3 className="text-[15px] font-bold text-[#0e1b1a]">Quick Actions</h3>
            {actions.map((action) => (
                <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-2.5 h-[42px] px-3.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-lg transition-colors"
                >
                    <action.icon size={18} className="text-[#0f766d]" />
                    <span className="text-[13px] font-medium text-[#0e1b1a]">
                        {action.label}
                    </span>
                </Link>
            ))}
        </div>
    );
}
