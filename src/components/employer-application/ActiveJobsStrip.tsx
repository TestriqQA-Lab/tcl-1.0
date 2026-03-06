"use client";

import { useRef, useState, useEffect } from "react";
import { Briefcase, ChevronLeft, ChevronRight } from "lucide-react";
import { activeJobs, getJobCount } from "./applicantsData";

interface ActiveJobsStripProps {
    selectedJob: string;
    onJobChange: (jobId: string) => void;
}

export function ActiveJobsStrip({ selectedJob, onJobChange }: ActiveJobsStripProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 2);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    };

    useEffect(() => {
        checkScroll();
        const el = scrollRef.current;
        if (el) {
            el.addEventListener("scroll", checkScroll, { passive: true });
            window.addEventListener("resize", checkScroll);
        }
        return () => {
            el?.removeEventListener("scroll", checkScroll);
            window.removeEventListener("resize", checkScroll);
        };
    }, []);

    const scroll = (dir: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;
        const amount = 220;
        el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    };

    return (
        <div className="w-full">
            {/* Section Label */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-[#64748B]" />
                    <span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider">
                        Filter by Job Post
                    </span>
                </div>
                <span className="text-[11px] text-[#94A3B8]">{activeJobs.length - 1} active jobs</span>
            </div>

            {/* Cards + Arrow Buttons */}
            <div className="flex items-stretch gap-2">
                {/* Left Arrow */}
                <button
                    onClick={() => scroll("left")}
                    disabled={!canScrollLeft}
                    className={`hidden md:flex w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 ${canScrollLeft
                        ? "border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] hover:border-[#CBD5E1] shadow-sm cursor-pointer"
                        : "border-transparent bg-transparent opacity-0 cursor-default"
                        }`}
                    aria-label="Scroll left"
                >
                    <ChevronLeft size={18} className="text-[#64748B]" />
                </button>

                {/* Scrollable Job Cards */}
                <div
                    ref={scrollRef}
                    className="flex gap-2.5 overflow-x-auto flex-1 -mx-1 px-1 [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
                >
                    {activeJobs.map((job) => {
                        const isSelected = job.id === selectedJob;
                        const isAll = job.id === "all";

                        return (
                            <button
                                key={job.id}
                                onClick={() => onJobChange(job.id)}
                                className={`flex-shrink-0 flex flex-col gap-1.5 rounded-xl p-3.5 border transition-all duration-200 cursor-pointer text-left ${isAll ? "min-w-[140px]" : "min-w-[180px] md:min-w-[200px]"
                                    } ${isSelected
                                        ? "border-[#0f766d] bg-[#0f766d]/5 shadow-sm"
                                        : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:shadow-sm"
                                    }`}
                            >
                                {/* Top Row: Color dot + Title */}
                                <div className="flex items-center gap-2">
                                    <div className={`size-2.5 rounded-full shrink-0 ${job.color}`} />
                                    <span className={`text-[13px] font-semibold truncate ${isSelected ? "text-[#0f766d]" : "text-[#0e1b1a]"
                                        }`}>
                                        {job.title}
                                    </span>
                                </div>
                                {/* Bottom Row: Department + Count */}
                                <div className="flex items-center justify-between pl-[18px]">
                                    {job.department && (
                                        <span className="text-[11px] text-[#94A3B8]">{job.department}</span>
                                    )}
                                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${isSelected
                                        ? "bg-[#0f766d] text-white"
                                        : "bg-[#F1F5F9] text-[#64748B]"
                                        }`}>
                                        {getJobCount(job.id)}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll("right")}
                    disabled={!canScrollRight}
                    className={`hidden md:flex w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 ${canScrollRight
                        ? "border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] hover:border-[#CBD5E1] shadow-sm cursor-pointer"
                        : "border-transparent bg-transparent opacity-0 cursor-default"
                        }`}
                    aria-label="Scroll right"
                >
                    <ChevronRight size={18} className="text-[#64748B]" />
                </button>
            </div>
        </div>
    );
}

