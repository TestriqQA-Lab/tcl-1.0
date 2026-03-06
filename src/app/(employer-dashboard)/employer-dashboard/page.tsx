import { DashboardSidebar } from "@/components/employer-dashboard/DashboardSidebar";
import { DashboardTopBar } from "@/components/employer-dashboard/DashboardTopBar";
import { TabletNavStrip } from "@/components/employer-dashboard/TabletNavStrip";
import { MetricsRow } from "@/components/employer-dashboard/MetricsRow";
import { RecentApplicationsTable } from "@/components/employer-dashboard/RecentApplicationsTable";
import { QuickActionsPanel } from "@/components/employer-dashboard/QuickActionsPanel";
import { UpcomingInterviewsCard } from "@/components/employer-dashboard/UpcomingInterviewsCard";
import { MobileBottomNav } from "@/components/employer-dashboard/MobileBottomNav";
import { EmployerFooter } from "@/components/employer/EmployerFooter";

export const metadata = {
    title: "Dashboard | TopCareerLive Employer",
    description:
        "Track applications, manage job postings, and streamline your hiring pipeline.",
};

export default function EmployerDashboardPage() {
    return (
        <div className="flex flex-col min-h-screen w-full bg-[#F8FAFB]">
            {/* Main Content Area */}
            <div className="flex flex-1 w-full">
                {/* Desktop Sidebar */}
                <DashboardSidebar activePage="Dashboard" />

                {/* Main Dashboard Section */}
                <div className="flex flex-col flex-1 min-w-0">
                    {/* Top Bar (responsive) */}
                    <DashboardTopBar />

                    {/* Tablet Nav Strip */}
                    <TabletNavStrip activePage="Dashboard" />

                    {/* Content */}
                    <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 p-4 md:p-6 lg:p-8 pb-24 md:pb-6">
                        {/* Left Column (main content) */}
                        <div className="flex flex-col gap-5 lg:gap-6 flex-1 min-w-0">
                            {/* Greeting (tablet/mobile only — desktop shows in top bar) */}
                            <div className="lg:hidden flex items-center justify-between">
                                <div>
                                    <h1 className="text-lg font-bold text-[#0e1b1a]">
                                        Dashboard Overview
                                    </h1>
                                    <p className="text-xs text-[#64748B]">
                                        Here&apos;s what&apos;s happening today.
                                    </p>
                                </div>
                                <a
                                    href="/employer-dashboard/post-job"
                                    className="hidden md:flex items-center gap-1.5 h-9 px-4 bg-[#0f766d] hover:bg-[#0d635c] text-white text-sm font-semibold rounded-lg transition-colors"
                                >
                                    Post a Job
                                </a>
                            </div>

                            {/* Metrics */}
                            <MetricsRow />

                            {/* Recent Applications */}
                            <RecentApplicationsTable />
                        </div>

                        {/* Right Column (desktop only) */}
                        <div className="hidden lg:flex flex-col gap-5 w-[200px] xl:w-[320px] shrink-0">
                            <QuickActionsPanel />
                            <UpcomingInterviewsCard />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer (sits below both sidebar and main content) */}
            <div className="w-full bg-white border-t border-[#E2E8F0] pb-16 md:pb-0 z-10">
                <EmployerFooter />
            </div>

            {/* Mobile Bottom Nav */}
            <MobileBottomNav activePage="Home" />
        </div>
    );
}
