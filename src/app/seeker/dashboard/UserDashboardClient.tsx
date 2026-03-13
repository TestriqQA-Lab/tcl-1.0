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

interface RecommendedJob {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    timeAgo: string;
    logoUrl?: string;
}

export function UserDashboardClient({ userId, userName, userImage }: UserDashboardClientProps) {
    const [userProfile, setUserProfile] = useState<UserProfile>({ name: userName, image: userImage, location: null });
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [nextTip, setNextTip] = useState("Loading profile...");
    const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJob[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingJobs, setIsLoadingJobs] = useState(true);

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

        const fetchRecommendedJobs = async () => {
            if (!userId) return;
            try {
                const { getRecommendedJobsAction } = await import("@/actions/job.actions");
                const result = await getRecommendedJobsAction(userId);
                if (result.success && result.jobs) {
                    setRecommendedJobs(result.jobs);
                }
            } catch (error) {
                console.error("Error fetching recommended jobs:", error);
            } finally {
                setIsLoadingJobs(false);
            }
        };

        fetchProfile();
        fetchRecommendedJobs();
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
                            {isLoadingJobs ? (
                                <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f766d] mx-auto mb-4"></div>
                                    <p className="text-slate-500">Finding best matches for you...</p>
                                </div>
                            ) : recommendedJobs.length > 0 ? (
                                recommendedJobs.map((job) => (
                                    <DashboardJobCard
                                        key={job.id}
                                        id={job.id}
                                        title={job.title}
                                        company={job.company}
                                        location={job.location}
                                        salary={job.salary}
                                        timeAgo={job.timeAgo}
                                        logoUrl={job.logoUrl}
                                    />
                                ))
                            ) : (
                                <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
                                    <p className="text-slate-500">No jobs found matching your role yet. Update your profile to get better matches!</p>
                                </div>
                            )}
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
