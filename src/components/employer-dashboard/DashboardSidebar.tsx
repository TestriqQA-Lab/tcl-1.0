"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { getEmployerProfile } from "@/actions/employer.actions";
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    Search,
    BookOpen,
    BarChart3,
    Settings,
    LogOut,
    ShieldAlert,
    User
} from "lucide-react";

const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/employer-dashboard" },
    {
        label: "Applications",
        icon: FileText,
        href: "/employer-applications",
    },
    {
        label: "Job Postings",
        icon: Briefcase,
        href: "/job-postings",
    },
    {
        label: "Database Search",
        icon: Search,
        href: "/database-search",
    },
    { label: "Blogs", icon: BookOpen, href: "/employer-dashboard/blogs" },
    {
        label: "Verification",
        icon: ShieldAlert,
        href: "/employer-dashboard/verification",
    },
    {
        label: "Profile",
        icon: User,
        href: "/employer-dashboard/profile",
    },
    // { label: "Analytics", icon: BarChart3, href: "/employer-dashboard/analytics" },
    // {
    //     label: "Settings",
    //     icon: Settings,
    //     href: "/employer-dashboard/settings",
    // },
];

interface DashboardSidebarProps {
    activePage?: string;
}

export function DashboardSidebar({
    activePage = "Dashboard",
}: DashboardSidebarProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const [profileOpen, setProfileOpen] = useState(false);
    const [companyName, setCompanyName] = useState<string | null | undefined>(undefined);
    const [companyLogo, setCompanyLogo] = useState<string | null | undefined>(undefined);

    const userEmail = session?.user?.email ?? "";
    const userId = session?.user?.id;

    useEffect(() => {
        if (!userId) return;
        getEmployerProfile(userId).then((profile) => {
            if (profile) {
                setCompanyName(profile.companyName ?? profile.fullName ?? null);
                setCompanyLogo(profile.companyLogo ?? null);
            }
        });
    }, [userId]);

    // Display name: prefer company name, fall back to session name
    const isLoading = companyName === undefined;
    const displayName = companyName ?? "Employer";

    // Generate initials from displayName (up to 2 characters)
    const initials = displayName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const handleLogout = async () => {
        setProfileOpen(false);
        await signOut({ callbackUrl: "/employers" });
    };

    return (
        <aside className="hidden lg:flex flex-col w-[260px] bg-[#0e1b1a] px-6 py-8 justify-between shrink-0 sticky top-0 h-screen overflow-y-auto relative">
            {/* Top Section */}
            <div className="flex flex-col gap-8">
                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="size-8 bg-[#0f766d] rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-lg">
                            rocket_launch
                        </span>
                    </div>
                    <span className="text-white text-[17px] font-bold tracking-tight">
                        TopCareerLive
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1">
                    <span className="text-white/35 text-[11px] font-semibold tracking-[2px] mb-2">
                        MAIN MENU
                    </span>
                    {navItems.map((item) => {
                        const isActive = item.label === activePage;
                        return (
                            <button
                                key={item.label}
                                onClick={() => router.push(item.href)}
                                className={`flex items-center gap-6 h-14 px-4 rounded-lg text-[16px] transition-colors text-left ${isActive
                                    ? "bg-[#0f766d] text-white font-semibold"
                                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                                    }`}
                            >
                                <item.icon size={24} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col gap-4 relative">

                {/* Profile Panel Popup */}
                {profileOpen && (
                    <>
                        <div className="fixed inset-0 z-[120]" onClick={() => setProfileOpen(false)} />
                        <div className="absolute bottom-16 left-0 right-0 z-[130] bg-[#1a2d2c] border border-white/10 rounded-xl shadow-2xl overflow-hidden shadow-black/50">
                            <div className="p-4 border-b border-white/10">
                                <span className="text-[14px] font-bold text-white truncate block">{displayName}</span>
                                <span className="text-[12px] text-white/50 truncate block mt-0.5">{userEmail}</span>
                            </div>
                            <div className="p-2">
                                <button
                                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                    onClick={handleLogout}
                                >
                                    <LogOut size={16} />
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* User Profile Button */}
                <button
                    className="flex items-center gap-2.5 pt-2.5 border border-white/8 shadow-sm shadow-gray-500 cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-lg transition-colors outline-none text-left w-full"
                    onClick={() => setProfileOpen(!profileOpen)}
                >
                    <div className="size-9 bg-[#0f766d] rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                        {companyLogo ? (
                            <img src={companyLogo} alt={displayName} className="w-full h-full object-contain p-1.5 bg-white" />
                        ) : (
                            <span className="text-white text-[13px] font-bold">{initials}</span>
                        )}
                    </div>
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                        {isLoading ? (
                            <div className="h-3.5 w-28 bg-white/15 rounded animate-pulse" />
                        ) : (
                            <span className="text-white text-[13px] font-semibold truncate">
                                {displayName}
                            </span>
                        )}
                        <span className="text-white/45 text-[11px] truncate">Employer</span>
                    </div>
                </button>
            </div>
        </aside>
    );
}
