import React from 'react';
import { ApplicationsContainer } from '@/components/user-applications/ApplicationsContainer';
import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { ProfileSidebar } from '@/components/dashboard/ProfileSidebar';

export default function UserApplicationsPage() {
    return (
        <div className="min-h-screen w-full pt-6 sm:pt-8 pb-24 lg:pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Fixed Left Sidebar — hidden on mobile */}
                <aside className="hidden lg:block lg:col-span-3">
                    <div className="sticky top-24 space-y-6">
                        <ProfileSidebar />
                        <SidebarNav />
                    </div>
                </aside>

                {/* Main Content */}
                <div className="col-span-1 lg:col-span-9">
                    <ApplicationsContainer />
                </div>
            </div>
        </div>
    );
}
