import { Suspense } from "react";
import { DashboardSidebar } from "@/components/employer-dashboard/DashboardSidebar";
import { DashboardTopBar } from "@/components/employer-dashboard/DashboardTopBar";
import { TabletNavStrip } from "@/components/employer-dashboard/TabletNavStrip";
import { MobileBottomNav } from "@/components/employer-dashboard/MobileBottomNav";
import { EmployerFooter } from "@/components/employer/EmployerFooter";
import { DatabaseSearchContent } from "@/components/database-search/DatabaseSearchContent";
import { getSeekerProfilesForEmployerAction } from "@/actions/employer.seeker.actions";

export const metadata = {
    title: "Database Search | TopCareerLive Employer",
    description: "Search and filter through our extensive candidate database.",
};

export default async function DatabaseSearchPage() {
    // Initial fetch for first render (Server Component)
    const result = await getSeekerProfilesForEmployerAction({});
    const initialCandidates = result.data || [];

    return (
        <div className="flex flex-col min-h-screen w-full bg-[#F8FAFB]">
            {/* Main Content Area */}
            <div className="flex flex-1 w-full">
                {/* Desktop Sidebar */}
                <DashboardSidebar activePage="Database Search" />

                {/* Main Section */}
                <div className="flex flex-col flex-1 min-w-0">
                    {/* Desktop & Tablet/Mobile: Shared Top Bar (Greeting) */}
                    <DashboardTopBar hideDesktopBar={true} />

                    {/* Tablet Nav Strip */}
                    <TabletNavStrip activePage="Search" />

                    {/* Database Search Content (Filters and Results) */}
                    <Suspense fallback={<div className="p-10 text-center">Loading database...</div>}>
                         <DatabaseSearchContent 
                            initialCandidates={initialCandidates} 
                            initialTotalResults={initialCandidates.length}
                        />
                    </Suspense>
                </div>
            </div>

            {/* Footer */}
            <div className="w-full bg-white border-t border-[#E2E8F0] pb-16 md:pb-0 z-10">
                <EmployerFooter />
            </div>

            {/* Mobile Bottom Nav */}
            <MobileBottomNav activePage="Search" />
        </div>
    );
}
