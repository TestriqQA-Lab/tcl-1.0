import { DashboardSidebar } from "@/components/employer-dashboard/DashboardSidebar";
import { DashboardTopBar } from "@/components/employer-dashboard/DashboardTopBar";
import { TabletNavStrip } from "@/components/employer-dashboard/TabletNavStrip";
import { MobileBottomNav } from "@/components/employer-dashboard/MobileBottomNav";
import { EmployerFooter } from "@/components/employer/EmployerFooter";
import { ApplicationsTopBar } from "@/components/employer-application/ApplicationsTopBar";
import { ApplicationsMobileHeader } from "@/components/employer-application/ApplicationsMobileHeader";
import { ApplicationsContent } from "@/components/employer-application/ApplicationsContent";

export const metadata = {
    title: "Applications | TopCareerLive Employer",
    description:
        "View and manage all job applications — filter, sort, and take action on candidates.",
};

export default function EmployerApplicationsPage() {
    return (
        <div className="flex flex-col min-h-screen w-full bg-[#F8FAFB]">
            {/* Main Content Area */}
            <div className="flex flex-1 w-full">
                {/* Desktop Sidebar */}
                <DashboardSidebar activePage="Applications" />

                {/* Main Section */}
                <div className="flex flex-col flex-1 min-w-0">
                    {/* Desktop & Tablet/Mobile: Shared Top Bar (Greeting) */}
                    <DashboardTopBar userName="John" />

                    {/* Desktop: Applications Bar (title + search + filters + export) */}
                    <ApplicationsTopBar />

                    {/* Tablet Nav Strip */}
                    <TabletNavStrip activePage="Applications" />

                    {/* Content */}
                    <div className="flex flex-col flex-1">
                        {/* Tablet/Mobile Title + Filter/Export + Search Row */}
                        <ApplicationsMobileHeader />

                        {/* Active Jobs Strip + Status Filters + Table + Pagination */}
                        <ApplicationsContent />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="w-full bg-white border-t border-[#E2E8F0] pb-16 md:pb-0 z-10">
                <EmployerFooter />
            </div>

            {/* Mobile Bottom Nav */}
            <MobileBottomNav activePage="Apps" />
        </div>
    );
}
