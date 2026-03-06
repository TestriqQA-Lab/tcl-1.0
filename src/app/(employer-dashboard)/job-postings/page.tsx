import { DashboardSidebar } from "@/components/employer-dashboard/DashboardSidebar";
import { DashboardTopBar } from "@/components/employer-dashboard/DashboardTopBar";
import { TabletNavStrip } from "@/components/employer-dashboard/TabletNavStrip";
import { MobileBottomNav } from "@/components/employer-dashboard/MobileBottomNav";
import { EmployerFooter } from "@/components/employer/EmployerFooter";
import JobPostingsContent from '@/components/job-posting/JobPostingsContent';

export const metadata = {
    title: "Job Postings | TopCareerLive Employer",
    description: "Manage your active, paused, and closed jobs.",
};

export default function JobPostingsPage() {
    return (
        <div className="flex flex-col min-h-screen w-full bg-[#F8FAFB]">
            {/* Main Content Area */}
            <div className="flex flex-1 w-full">
                {/* Desktop Sidebar */}
                <DashboardSidebar activePage="Job Postings" />

                {/* Main Dashboard Section */}
                <div className="flex flex-col flex-1 min-w-0">
                    {/* Top Bar (responsive) */}
                    <DashboardTopBar hideDesktopBar={true} />

                    {/* Tablet Nav Strip */}
                    <TabletNavStrip activePage="Job Postings" />

                    {/* Content Component */}
                    <JobPostingsContent />
                </div>
            </div>

            {/* Footer (sits below both sidebar and main content) */}
            <div className="w-full bg-white border-t border-[#E2E8F0] pb-16 md:pb-0 z-10">
                <EmployerFooter />
            </div>

            {/* Mobile Bottom Nav */}
            <MobileBottomNav activePage="Job Postings" />
        </div>
    );
}
