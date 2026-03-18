"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Loader2, User } from "lucide-react";
import { getAllSeekerProfilesAction } from "@/actions/admin.actions";

interface Seeker {
    id: string;
    userId: string;
    fullName: string;
    position: string | null;
    email: string;
    phoneNumber: string | null;
    currentLocation: string | null;
    profilePicture: string | null;
    createdAt: Date;
}

export default function SeekersProfileContent() {
    const [searchQuery, setSearchQuery] = useState("");
    const [seekers, setSeekers] = useState<Seeker[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSeekers() {
            try {
                const result = await getAllSeekerProfilesAction();
                if (result.success && result.data) {
                    setSeekers(result.data as Seeker[]);
                } else {
                    setError(result.error || "Failed to fetch seekers");
                }
            } catch (err) {
                setError("An unexpected error occurred");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchSeekers();
    }, []);

    const filtered = seekers.filter(
        (s) =>
            s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.position?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
            s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.currentLocation?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
    );

    return (
        <div className="w-full min-h-full p-4 md:p-8 lg:py-12 lg:px-14 bg-[#F9FAFB] flex flex-col gap-5 md:gap-6 lg:gap-8 overflow-y-auto">
            {/* ── Header ── */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 md:gap-4">
                <h1 className="text-xl md:text-2xl lg:text-[32px] font-bold text-[#111827] font-inter">
                    Seeker Profiles
                </h1>

                {/* Search Bar */}
                <div className="relative w-full lg:w-[320px]">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                        size={16}
                    />
                    <input
                        type="text"
                        placeholder="Search seekers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg lg:rounded-[10px] bg-white text-sm text-[#111827] placeholder:text-[#9CA3AF] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-inter"
                    />
                </div>
            </div>

            {/* ── Status Messages ── */}
            {isLoading && (
                <div className="flex items-center justify-center p-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium">
                    {error}
                </div>
            )}

            {/* ── Desktop Table ── */}
            {!isLoading && !error && (
                <div className="hidden lg:block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    {/* Table Header */}
                    <div className="flex items-center bg-[#F9FAFB] px-6 py-4 border-b border-gray-100">
                        <span className="w-[280px] text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wider">
                            Seeker
                        </span>
                        <span className="w-[280px] text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wider">
                            Headline / Position
                        </span>
                        <span className="w-[280px] text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wider">
                            Contact Details
                        </span>
                        <span className="w-[200px] text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wider">
                            Location
                        </span>
                        <span className="w-[120px] text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wider">
                            Actions
                        </span>
                    </div>

                    {/* Table Body */}
                    {filtered.length === 0 ? (
                        <div className="px-6 py-10 text-center text-sm text-[#6B7280]">
                            No seekers found matching your search.
                        </div>
                    ) : (
                        filtered.map((seeker) => (
                            <div
                                key={seeker.id}
                                className="flex items-center px-6 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                            >
                                {/* Seeker */}
                                <div className="w-[280px] flex items-center gap-3">
                                    {seeker.profilePicture ? (
                                        <img
                                            src={seeker.profilePicture}
                                            alt={seeker.fullName}
                                            className="w-9 h-9 rounded-full object-cover shrink-0"
                                        />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                            <User size={18} />
                                        </div>
                                    )}
                                    <span className="text-sm font-semibold text-[#111827] font-inter truncate">
                                        {seeker.fullName}
                                    </span>
                                </div>

                                {/* Headline */}
                                <div className="w-[280px]">
                                    <span className="text-sm text-[#4B5563] font-inter truncate block">
                                        {seeker.position || "No position set"}
                                    </span>
                                </div>

                                {/* Contact Details */}
                                <div className="w-[280px] flex flex-col gap-0.5 min-w-0">
                                    <span className="text-[13px] text-[#111827] font-inter truncate">
                                        {seeker.email}
                                    </span>
                                    {seeker.phoneNumber && (
                                        <span className="text-xs text-[#6B7280] font-inter">
                                            {seeker.phoneNumber}
                                        </span>
                                    )}
                                </div>

                                {/* Location */}
                                <div className="w-[200px]">
                                    <span className="text-[13px] text-[#4B5563] font-inter truncate block">
                                        {seeker.currentLocation || "Not specified"}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="w-[120px] flex flex-col gap-2">
                                    <button className="text-xs font-semibold text-[#B45309] bg-[#FFFBEB] px-3 py-1.5 rounded-md hover:bg-[#FEF3C7] transition-colors font-inter w-fit">
                                        Suspend
                                    </button>
                                    <button className="text-xs font-semibold text-[#B91C1C] bg-[#FEF2F2] px-3 py-1.5 rounded-md hover:bg-[#FEE2E2] transition-colors font-inter w-fit">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* ── Mobile / Tablet Card List ── */}
            {!isLoading && !error && (
                <div className="flex flex-col gap-3 md:gap-4 lg:hidden">
                    {filtered.length === 0 ? (
                        <div className="bg-white rounded-xl p-6 text-center text-sm text-[#6B7280]">
                            No seekers found matching your search.
                        </div>
                    ) : (
                        filtered.map((seeker) => (
                            <div
                                key={seeker.id}
                                className="bg-white rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-start gap-3 md:gap-4 shadow-sm border border-gray-100"
                            >
                                {/* Top row: Avatar + Info (+ Actions on tablet) */}
                                <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
                                    {/* Avatar */}
                                    {seeker.profilePicture ? (
                                        <img
                                            src={seeker.profilePicture}
                                            alt={seeker.fullName}
                                            className="w-12 h-12 rounded-full object-cover shrink-0"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                            <User size={24} />
                                        </div>
                                    )}

                                    {/* Info */}
                                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                                        <span className="text-[15px] md:text-base font-bold text-[#111827] font-inter truncate">
                                            {seeker.fullName}
                                        </span>
                                        <span className="text-xs md:text-[13px] text-[#6B7280] font-inter">
                                            {seeker.position || "No position set"}
                                            {seeker.currentLocation && <span className="hidden md:inline"> • {seeker.currentLocation}</span>}
                                        </span>
                                        {seeker.currentLocation && (
                                            <span className="text-[11px] text-[#9CA3AF] font-inter md:hidden">
                                                📍 {seeker.currentLocation}
                                            </span>
                                        )}
                                        <span className="text-[11px] text-[#3B82F6] font-inter md:hidden truncate">
                                            📧 {seeker.email}
                                        </span>

                                        {/* Tablet: show contact details inline */}
                                        <div className="hidden md:flex flex-col gap-0.5 mt-0.5">
                                            <span className="text-[13px] text-[#111827] font-inter truncate">
                                                {seeker.email}
                                            </span>
                                            {seeker.phoneNumber && (
                                                <span className="text-xs text-[#6B7280] font-inter">
                                                    {seeker.phoneNumber}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions - bottom on mobile (side by side), right column on tablet */}
                                <div className="flex flex-row md:flex-col gap-2 md:gap-1.5 shrink-0 md:w-auto">
                                    <button className="flex-1 md:flex-none text-xs font-semibold text-[#B45309] bg-[#FFFBEB] px-3 md:px-2.5 py-1.5 md:py-1 rounded font-inter hover:bg-[#FEF3C7] transition-colors text-center">
                                        Suspend
                                    </button>
                                    <button className="flex-1 md:flex-none text-xs font-semibold text-[#B91C1C] bg-[#FEF2F2] px-3 md:px-2.5 py-1.5 md:py-1 rounded font-inter hover:bg-[#FEE2E2] transition-colors text-center">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
