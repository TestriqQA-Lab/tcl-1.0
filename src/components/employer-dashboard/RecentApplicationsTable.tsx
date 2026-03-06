import Link from "next/link";

const statusStyles: Record<string, { bg: string; text: string }> = {
    Shortlisted: { bg: "bg-[#DCFCE7]", text: "text-[#16A34A]" },
    "In Review": { bg: "bg-[#FEF3C7]", text: "text-[#D97706]" },
    Interview: { bg: "bg-[#DBEAFE]", text: "text-[#2563EB]" },
    Rejected: { bg: "bg-[#FEE2E2]", text: "text-[#EF4444]" },
};

const applications = [
    {
        name: "Priya Sharma",
        position: "Sr. Frontend Developer",
        status: "Shortlisted",
        time: "2 hours ago",
    },
    {
        name: "Rahul Mehta",
        position: "Backend Engineer",
        status: "In Review",
        time: "3 hours ago",
    },
    {
        name: "Anita Desai",
        position: "Product Designer",
        status: "Interview",
        time: "1 day ago",
    },
    {
        name: "Vikram Singh",
        position: "Data Analyst",
        status: "Rejected",
        time: "2 days ago",
    },
];

export function RecentApplicationsTable() {
    return (
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4">
                <h3 className="text-[15px] font-bold text-[#0e1b1a]">
                    Recent Applications
                </h3>
                <Link
                    href="/employer-applications"
                    className="text-xs font-semibold text-[#0f766d] hover:underline"
                >
                    View All →
                </Link>
            </div>

            {/* Desktop & Tablet Table */}
            <div className="hidden md:block">
                {/* Column Headers */}
                <div className="grid grid-cols-[1fr_1fr_120px_100px] px-5 py-2.5 bg-[#F1F5F9]">
                    <span className="text-[11px] font-semibold text-[#64748B]">
                        Candidate
                    </span>
                    <span className="text-[11px] font-semibold text-[#64748B]">
                        Position
                    </span>
                    <span className="text-[11px] font-semibold text-[#64748B]">
                        Status
                    </span>
                    <span className="text-[11px] font-semibold text-[#64748B]">
                        Applied
                    </span>
                </div>

                {/* Rows */}
                {applications.map((app, i) => {
                    const style = statusStyles[app.status];
                    return (
                        <div
                            key={i}
                            className={`grid grid-cols-[1fr_1fr_120px_100px] items-center px-5 py-3.5 ${i < applications.length - 1 ? "border-b border-[#F1F5F9]" : ""
                                }`}
                        >
                            <span className="text-[13px] font-medium text-[#0e1b1a]">
                                {app.name}
                            </span>
                            <span className="text-[13px] text-[#64748B]">
                                {app.position}
                            </span>
                            <span
                                className={`inline-flex w-fit px-2.5 py-0.5 rounded-full text-[11px] font-medium ${style.bg} ${style.text}`}
                            >
                                {app.status}
                            </span>
                            <span className="text-xs text-[#94A3B8]">{app.time}</span>
                        </div>
                    );
                })}
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden flex flex-col">
                {applications.map((app, i) => {
                    const style = statusStyles[app.status];
                    return (
                        <div
                            key={i}
                            className={`flex items-center justify-between px-4 py-3.5 ${i < applications.length - 1 ? "border-b border-[#F1F5F9]" : ""
                                }`}
                        >
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[13px] font-semibold text-[#0e1b1a]">
                                    {app.name}
                                </span>
                                <span className="text-[11px] text-[#64748B]">
                                    {app.position}
                                </span>
                            </div>
                            <span
                                className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${style.bg} ${style.text}`}
                            >
                                {app.status}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
