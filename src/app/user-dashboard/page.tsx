"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ProfileSidebar } from "@/components/dashboard/ProfileSidebar";
import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { StatsWidget } from "@/components/dashboard/StatsWidget";
import { UpgradeBanner } from "@/components/dashboard/UpgradeBanner";
import { DashboardJobCard } from "@/components/dashboard/DashboardJobCard";
import { SafetyAdvisoryCard, ResourcesCard, DashboardFooter } from "@/components/dashboard/RightSidebar";
import { MobileProfileCard, MobileEmptyState, MobileSafetyCard } from "@/components/dashboard/MobileComponents";
import Link from "next/link";
import { Home, Briefcase, Building2, FileText, Bell, Search } from "lucide-react";

interface UserProfile {
    name: string | null;
    image: string | null;
    location: string | null;
}

export default function UserDashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<UserProfile>({ name: null, image: null, location: null });

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!session?.user?.id) return;
            try {
                const { getEmploymentAction } = await import("@/actions/onboarding.actions");
                const result = await getEmploymentAction(session.user.id);
                if (result.success && result.data) {
                    const { profile } = result.data;
                    setUserProfile({
                        name: profile.fullName || session.user.name || null,
                        image: session.user.image || null,
                        location: profile.currentLocation || null,
                    });
                } else {
                    setUserProfile({
                        name: session.user.name || null,
                        image: session.user.image || null,
                        location: null,
                    });
                }
            } catch {
                setUserProfile({
                    name: session.user.name || null,
                    image: session.user.image || null,
                    location: null,
                });
            }
        };
        fetchProfile();
    }, [session?.user?.id]);

    if (status === "loading" || status === "unauthenticated") {
        return <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24 lg:pb-10">
            <div className="max-w-[1440px] mx-auto py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Sidebar (Desktop: 3 cols) */}
                    <div className="hidden lg:block lg:col-span-3 space-y-6">
                        <ProfileSidebar user={{ name: userProfile.name, image: userProfile.image, location: userProfile.location ?? undefined }} />
                        <SidebarNav />
                        <StatsWidget />
                    </div>

                    {/* Center Column (Desktop: 6 cols) */}
                    <div className="col-span-1 lg:col-span-6 space-y-6">
                        {/* Mobile User Info (Mobile Only) */}
                        <div className="lg:hidden">
                            <MobileProfileCard userName={userProfile.name} userImage={userProfile.image} />
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

                        {/* Job List (Desktop) vs Empty State (Mobile) Logic */}
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
                            {/* Loading Skeleton Item to match screenshot */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 opacity-50">
                                <div className="flex gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                                    <div className="space-y-2">
                                        <div className="w-32 h-4 bg-gray-100 rounded"></div>
                                        <div className="w-24 h-3 bg-gray-100 rounded"></div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-20 h-6 bg-gray-100 rounded-full"></div>
                                    <div className="w-20 h-6 bg-gray-100 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Empty State */}
                        <div className="lg:hidden">
                            <MobileEmptyState />
                        </div>

                        {/* Mobile Safety Advisory (Mobile Only) */}
                        <div className="lg:hidden mt-6">
                            <MobileSafetyCard />
                        </div>
                    </div>

                    {/* Right Sidebar (Desktop: 3 cols) */}
                    <div className="hidden lg:block lg:col-span-3 space-y-6">
                        <SafetyAdvisoryCard />
                        <ResourcesCard />
                        <DashboardFooter />
                    </div>

                </div>
            </div>
        </div>
    );
}

function RocketIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436h.004l-2.222 2.222a.75.75 0 0 1-1.06 0l-2.546-2.546a.75.75 0 0 1 0-1.06l2.222-2.222v-.004ZM8 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" clipRule="evenodd" />
            <path d="M2.25 10a8.5 8.5 0 0 1 10.607-7.92 9.002 9.002 0 0 0-4.153 2.853l-1.926 1.927A10.457 10.457 0 0 0 4 14.502c-.85-.145-1.72-.257-2.617-.32a.75.75 0 0 1-.689-.868 37.89 37.89 0 0 1 .59-2.315 2.502 2.502 0 0 1 .966-1ZM14 20.25a8.5 8.5 0 0 1-7.92-10.607 9.002 9.002 0 0 0 2.853 4.153l1.927 1.926a10.457 10.457 0 0 0 7.632 2.768c-.145.85-.257 1.72-.32 2.617a.75.75 0 0 1-.868.689 37.89 37.89 0 0 1-2.315-.59 2.502 2.502 0 0 1-1-.966Z" />
        </svg>
    )
}
