"use client";

import React from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";

interface ProfileSidebarProps {
    user?: {
        name?: string | null;
        image?: string | null;
        location?: string;
    };
    completionPercentage?: number;
    nextTip?: string;
    isLoading?: boolean;
}

export const ProfileSidebar = ({ user, completionPercentage = 0, nextTip, isLoading = false }: ProfileSidebarProps) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center animate-pulse">
                <div className="w-[120px] h-[120px] bg-gray-200 rounded-full mb-4"></div>
                <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded-md w-1/2 mb-6"></div>
                <div className="w-full">
                    <div className="flex justify-between mb-2">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-4 bg-gray-200 rounded w-8"></div>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative w-30 h-30 mb-4 rounded-full overflow-hidden">
                <div className="w-full h-full overflow-hidden border-4 border-[#E8F3F2]">
                    <Image
                        src={user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=0D8ABC&color=fff`}
                        alt={user?.name || "User"}
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            {/* Name & Location */}
            <h3 className="text-lg font-bold text-gray-900 mb-1">
                {user?.name || "TCL Member"}
            </h3>
            {user?.location && (
                <div className="flex items-center gap-1 text-gray-500 text-sm mb-6">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{user.location}</span>
                </div>
            )}
            {!user?.location && <div className="h-6 mb-6"></div>}

            {/* Profile Strength */}
            <div className="w-full">
                <div className="flex items-center justify-between text-sm font-semibold mb-2">
                    <span className="text-gray-700">Profile Strength</span>
                    <span className="text-[#0f766d]">{completionPercentage}%</span>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div
                        className="h-full bg-[#0f766d] rounded-full"
                        style={{ width: `${completionPercentage}%` }}
                    ></div>
                </div>

                <p className="text-[10px] text-gray-400 text-left">
                    {nextTip || "Complete your profile to get more visibility"}
                </p>
            </div>
        </div>
    );
};
