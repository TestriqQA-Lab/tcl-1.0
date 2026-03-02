"use client";

import React, { useEffect, useState } from "react";
import { ProfileSidebar } from "@/components/dashboard/ProfileSidebar";
import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { StatsWidget } from "@/components/dashboard/StatsWidget";
import { UpgradeBanner } from "@/components/dashboard/UpgradeBanner";
import { DashboardJobCard } from "@/components/dashboard/DashboardJobCard";
import { SafetyAdvisoryCard, ResourcesCard, DashboardFooter } from "@/components/dashboard/RightSidebar";
import { MobileProfileCard, MobileEmptyState, MobileSafetyCard } from "@/components/dashboard/MobileComponents";
import { DashboardBlogSection } from "@/components/dashboard/DashboardBlogSection";

interface UserProfile {
    name: string | null;
    image: string | null;
    location: string | null;
}

interface UserDashboardClientProps {
    userId: string;
    userName: string | null;
    userImage: string | null;
}

export function UserDashboardClient({ userId, userName, userImage }: UserDashboardClientProps) {
    const [userProfile, setUserProfile] = useState<UserProfile>({ name: userName, image: userImage, location: null });
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [nextTip, setNextTip] = useState("Loading profile...");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!userId) return;
            try {
                const { getEmploymentAction } = await import("@/actions/onboarding.actions");
                const result = await getEmploymentAction(userId);
                if (result.success && result.data) {
                    const { profile } = result.data;
                    setUserProfile({
                        name: profile.fullName || userName || null,
                        image: userImage || null,
                        location: profile.currentLocation || null,
                    });
                } else {
                    setUserProfile({
                        name: userName || null,
                        image: userImage || null,
                        location: null,
                    });
                }

                // Fetch real completion percentage
                const { getProfileCompletionAction } = await import("@/actions/onboarding.actions");
                const completion = await getProfileCompletionAction(userId);
                if (completion.success && completion.data) {
                    setCompletionPercentage(completion.data.percentage);
                    setNextTip(completion.data.nextTip);
                }
            } catch {
                setUserProfile({
                    name: userName || null,
                    image: userImage || null,
                    location: null,
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [userId]);

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24 lg:pb-10">
            <div className="max-w-[1440px] mx-auto py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Sidebar (Desktop: 3 cols) */}
                    <div className="hidden lg:block lg:col-span-3 space-y-6">
                        <ProfileSidebar
                            user={{ name: userProfile.name, image: userProfile.image, location: userProfile.location ?? undefined }}
                            completionPercentage={completionPercentage}
                            nextTip={nextTip}
                            isLoading={isLoading}
                        />
                        <SidebarNav />
                        <StatsWidget />
                    </div>

                    {/* Center Column (Desktop: 6 cols) */}
                    <div className="col-span-1 lg:col-span-6 space-y-6">
                        {/* Mobile User Info (Mobile Only) */}
                        <div className="lg:hidden">
                            <MobileProfileCard
                                userName={userProfile.name}
                                userImage={userProfile.image}
                                completionPercentage={completionPercentage}
                                isLoading={isLoading}
                            />
                        </div>

                        {/* Upgrade Banner (Desktop Only) */}
                        <div className="hidden lg:block">
                            <UpgradeBanner userName={userProfile.name} />
                        </div>

                        {/* Recommended Jobs Header */}
                        <div className="flex items-center justify-between pt-2 lg:pt-0 mb-4 lg:mb-0">
                            <h2 className="text-xl font-bold text-gray-900">Recommended Jobs</h2>
                            <button className="text-sm font-semibold text-[#0f766d] hover:underline">View all</button>
                        </div>

                        {/* Job List (Desktop) */}
                        <div className="hidden lg:flex flex-col gap-4">
                            {[
                                {
                                    title: "Fullstack Developer",
                                    company: "GlobalStream Systems",
                                    location: "Hybrid, Mumbai",
                                    salary: "₹12L - ₹18L",
                                    timeAgo: "2 days ago",
                                    logoUrl: undefined
                                },
                                {
                                    title: "Frontend Engineer",
                                    company: "TechNova Solutions",
                                    location: "Remote",
                                    salary: "₹10L - ₹15L",
                                    timeAgo: "1 day ago",
                                    logoUrl: undefined
                                },
                                {
                                    title: "Backend Developer (Node.js)",
                                    company: "Apex Innovations",
                                    location: "On-site, Bengaluru",
                                    salary: "₹14L - ₹20L",
                                    timeAgo: "5 hours ago",
                                    logoUrl: undefined
                                },
                                {
                                    title: "React Native Developer",
                                    company: "MobileFirst Platforms",
                                    location: "Hybrid, Pune",
                                    salary: "₹8L - ₹14L",
                                    timeAgo: "3 days ago",
                                    logoUrl: undefined
                                }
                            ].map((job, index) => (
                                <DashboardJobCard
                                    key={index}
                                    title={job.title}
                                    company={job.company}
                                    location={job.location}
                                    salary={job.salary}
                                    timeAgo={job.timeAgo}
                                    logoUrl={job.logoUrl}
                                />
                            ))}
                        </div>

                        {/* Mobile Empty State */}
                        <div className="lg:hidden">
                            <MobileEmptyState />
                        </div>

                        {/* Mobile Safety Advisory (Mobile Only) */}
                        <div className="lg:hidden mt-6">
                            <MobileSafetyCard />
                        </div>

                        {/* Blog Section */}
                        <DashboardBlogSection />
                    </div>

                    {/* Right Sidebar (Desktop: 3 cols) */}
                    <div className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-24 space-y-6">
                            <SafetyAdvisoryCard />
                            <ResourcesCard />
                            <DashboardFooter />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
