"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

// Dummy seeker data
const seekers = [
    {
        id: 1,
        name: "John Doe",
        headline: "Senior Frontend Developer",
        email: "john.doe@example.com",
        phone: "+1 (555) 000-1234",
        location: "New York, NY, USA",
        avatarUrl:
            "https://images.unsplash.com/photo-1758598497528-d8d9b3f22894?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&q=80",
    },
    {
        id: 2,
        name: "Jane Smith",
        headline: "UI/UX Designer",
        email: "jane.smith@design.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA, USA",
        avatarUrl:
            "https://images.unsplash.com/photo-1702025561342-b22f7f9ea17e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&q=80",
    },
];

export default function SeekersProfileContent() {
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = seekers.filter(
        (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full min-h-full p-4 md:p-8 lg:py-12 lg:px-14 bg-[#F9FAFB] flex flex-col gap-5 md:gap-6 lg:gap-8">
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

            {/* ── Desktop Table ── */}
            <div className="hidden lg:block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                {/* Table Header */}
                <div className="flex items-center bg-[#F9FAFB] px-6 py-4 border-b border-gray-100">
                    <span className="w-[280px] text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wider">
                        Seeker
                    </span>
                    <span className="w-[280px] text-xs font-semibold text-[#6B7280] font-inter uppercase tracking-wider">
                        Headline
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
                                <img
                                    src={seeker.avatarUrl}
                                    alt={seeker.name}
                                    className="w-9 h-9 rounded-full object-cover shrink-0"
                                />
                                <span className="text-sm font-semibold text-[#111827] font-inter truncate">
                                    {seeker.name}
                                </span>
                            </div>

                            {/* Headline */}
                            <div className="w-[280px]">
                                <span className="text-sm text-[#4B5563] font-inter">
                                    {seeker.headline}
                                </span>
                            </div>

                            {/* Contact Details */}
                            <div className="w-[280px] flex flex-col gap-0.5">
                                <span className="text-[13px] text-[#111827] font-inter">
                                    {seeker.email}
                                </span>
                                <span className="text-xs text-[#6B7280] font-inter">
                                    {seeker.phone}
                                </span>
                            </div>

                            {/* Location */}
                            <div className="w-[200px]">
                                <span className="text-[13px] text-[#4B5563] font-inter">
                                    {seeker.location}
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

            {/* ── Mobile / Tablet Card List ── */}
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
                                <img
                                    src={seeker.avatarUrl}
                                    alt={seeker.name}
                                    className="w-12 h-12 rounded-full object-cover shrink-0"
                                />

                                {/* Info */}
                                <div className="flex flex-col gap-1 flex-1 min-w-0">
                                    <span className="text-[15px] md:text-base font-bold text-[#111827] font-inter truncate">
                                        {seeker.name}
                                    </span>
                                    <span className="text-xs md:text-[13px] text-[#6B7280] font-inter">
                                        {seeker.headline}
                                        <span className="hidden md:inline"> • {seeker.location}</span>
                                    </span>
                                    <span className="text-[11px] text-[#9CA3AF] font-inter md:hidden">
                                        📍 {seeker.location}
                                    </span>
                                    <span className="text-[11px] text-[#3B82F6] font-inter md:hidden">
                                        📧 {seeker.email}
                                    </span>

                                    {/* Tablet: show contact details inline */}
                                    <div className="hidden md:flex flex-col gap-0.5 mt-0.5">
                                        <span className="text-[13px] text-[#111827] font-inter">
                                            {seeker.email}
                                        </span>
                                        <span className="text-xs text-[#6B7280] font-inter">
                                            {seeker.phone}
                                        </span>
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
        </div>
    );
}
