import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, FileText, Search, Building2, BookOpen } from 'lucide-react';
import UserProfileLayout from '@/components/user-profile/UserProfileLayout';
import Sidebar from '@/components/user-profile/Sidebar';

import ProfileHeader from '@/components/user-profile/ProfileHeader';

// Placeholder imports for sections - to be created next
import CareerPreferences from '../../components/user-profile/sections/CareerPreferences';
import Education from '../../components/user-profile/sections/Education';
import KeySkills from '../../components/user-profile/sections/KeySkills';
import Languages from '../../components/user-profile/sections/Languages';
import Internships from '../../components/user-profile/sections/Internships';
import Projects from '../../components/user-profile/sections/Projects';
import ProfileSummary from '../../components/user-profile/sections/ProfileSummary';
import Accomplishments from '../../components/user-profile/sections/Accomplishments';
import CompetitiveExams from '../../components/user-profile/sections/CompetitiveExams';
import Employment from '../../components/user-profile/sections/Employment';
import AcademicAchievements from '../../components/user-profile/sections/AcademicAchievements';
import Resume from '../../components/user-profile/sections/Resume';

// Header Section containing Profile Card, Tabs, and Visibility Strip
const ProfileHeaderSection = () => (
    <>
        <ProfileHeader />

        {/* View & Edit Tab Strip + Navigation Links */}
        <div className="flex items-center border-b border-gray-200 mb-4 bg-white/50 backdrop-blur-sm -mx-4 px-4 sm:mx-0 sm:px-0 lg:bg-transparent lg:backdrop-blur-none">
            {/* Left: Tabs */}
            <div className="flex">
                <button className="text-[#117a7a] border-b-2 border-[#117a7a] pb-2 text-sm font-bold px-4">View & Edit</button>
                <button className="text-gray-500 hover:text-gray-700 pb-2 text-sm font-medium px-4">Activity insights</button>
            </div>

            {/* Right: Quick Navigation */}
            <div className="hidden lg:flex items-center gap-1.5 ml-auto">
                {[
                    { label: "Dashboard", href: "/user-dashboard", icon: LayoutDashboard },
                    { label: "Applications", href: "/user-applications", icon: FileText },
                    { label: "Jobs", href: "/search", icon: Search },
                    { label: "Companies", href: "/companies", icon: Building2 },
                    { label: "Blogs", href: "/blogs", icon: BookOpen },
                ].map((link) => (
                    <Link
                        key={link.label}
                        href={link.href}
                        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-600 bg-white border border-gray-200 px-3.5 py-2 rounded-lg hover:border-[#0f766d] hover:text-[#0f766d] hover:bg-[#f0fdf9] shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <link.icon className="w-3.5 h-3.5" strokeWidth={2} />
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>

        {/* Visibility Note */}
        <div className="bg-[#eaf4f4] text-[#117a7a] text-xs font-medium py-2 px-4 rounded-md flex items-center gap-2 mb-6 border border-[#cce3e3]">
            <div className="w-2 h-2 rounded-full bg-[#117a7a] shrink-0"></div>
            Your profile is visible to recruiters only after you complete key sections
        </div>

        {/* Mobile Sidebar Navigation - Injected here for Mobile Flow Only */}
        <div className="lg:hidden sticky top-[64px] z-30 bg-[#f3f4f6] pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <Sidebar />
        </div>
    </>
);

// Main Content Section (Grid Right Column)
const ProfileMainContent = () => {
    return (
        <>
            <CareerPreferences />
            <Education />
            <KeySkills />
            <Languages />
            <Internships />
            <Projects />
            <ProfileSummary />
            <Accomplishments />
            <CompetitiveExams />
            <Employment />
            <AcademicAchievements />
            <Resume />

            {/* Pro Tip Bottom Bar */}
            <div className="bg-[#fff7e6] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 mt-6 border border-[#ffe0b2]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#ff9800] flex items-center justify-center text-white font-bold text-lg">💡</div>
                    <div>
                        <p className="text-sm font-bold text-[#e65100]">Pro Tip: Complete your profile</p>
                        <p className="text-xs text-[#f57c00]">Users with 100% completed profiles receive 3x more recruiter invites.</p>
                    </div>
                </div>
                <div className="w-32 h-1.5 bg-[#ffe0b2] rounded-full overflow-hidden">
                    <div className="h-full bg-[#ff9800] w-[85%]"></div>
                </div>
            </div>
        </>
    );
};

export default function UserProfilePage() {
    return (
        <UserProfileLayout
            header={<ProfileHeaderSection />}
            sidebar={<Sidebar />}
            content={<ProfileMainContent />}
        />
    );
}
