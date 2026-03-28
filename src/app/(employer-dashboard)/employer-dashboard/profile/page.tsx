import { type Metadata } from "next";
import { DashboardSidebar } from "@/components/employer-dashboard/DashboardSidebar";
import { DashboardTopBar } from "@/components/employer-dashboard/DashboardTopBar";
import { TabletNavStrip } from "@/components/employer-dashboard/TabletNavStrip";
import { MobileBottomNav } from "@/components/employer-dashboard/MobileBottomNav";
import EmployerProfileContent from "@/components/employer-dashboard/EmployerProfileContent";

export const metadata: Metadata = {
    title: "Company Profile | Employer Dashboard",
    description: "Manage your company profile and branding.",
};

export default function EmployerProfilePage() {
    return (
        <div className="flex flex-col min-h-screen w-full bg-[#F8FAFB]">
            <div className="flex flex-1 w-full">
                {/* Desktop Sidebar */}
                <DashboardSidebar activePage="Profile" />

                {/* Main Section */}
                <div className="flex flex-col flex-1 min-w-0">
                    {/* Top Bar */}
                    <DashboardTopBar />

                    {/* Tablet Nav Strip */}
                    <TabletNavStrip activePage="Profile" />

                    {/* Profile Content */}
                    <EmployerProfileContent />
                </div>
            </div>

            {/* Mobile Bottom Nav */}
            <MobileBottomNav />
        </div>
    );
}
