"use client";

import { Briefcase, Users, Loader2, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getEmployerDashboardMetricsAction } from "@/actions/employer.application.actions";

export function MetricsRow() {
    const [stats, setStats] = useState<{ activeJobs: number; totalApplications: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getEmployerDashboardMetricsAction().then((res) => {
            if (res.data) {
                setStats(res.data);
            }
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {[1, 2].map((i) => (
                    <div key={i} className="h-[140px] bg-white border border-[#E2E8F0] rounded-2xl animate-pulse flex items-center justify-center">
                        <Loader2 className="animate-spin text-[#0f766d]/20" size={32} />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Active Jobs Card */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-[#0f766d] to-[#0d9488] rounded-2xl p-6 text-white shadow-lg shadow-[#0f766d]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0f766d]/30">
                <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                    <Briefcase size={80} />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex items-center justify-between">
                        <div className="size-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <Briefcase size={20} className="text-white" />
                        </div>
                        <div className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-wider">
                            Live Now
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-4xl md:text-5xl font-black tracking-tight leading-none">
                            {stats?.activeJobs || 0}
                        </span>
                        <h3 className="text-sm font-semibold text-white/80 mt-1 uppercase tracking-wide">
                            Active Job Postings
                        </h3>
                    </div>
                </div>
            </div>

            {/* Total Applications Card */}
            <div className="group relative overflow-hidden bg-white border border-[#E2E8F0] rounded-2xl p-6 text-[#0e1b1a] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 hover:border-[#0f766d]/20">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 p-8 text-[#0f766d]/5 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12">
                    <Users size={80} />
                </div>
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex items-center justify-between">
                        <div className="size-10 rounded-xl bg-[#F0FDFA] flex items-center justify-center border border-[#CCFBF1]">
                            <Users size={20} className="text-[#0f766d]" />
                        </div>
                        <div className="flex items-center gap-1 text-[#22C55E] text-xs font-bold">
                            <ArrowUpRight size={14} />
                            <span>Trending</span>
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-4xl md:text-5xl font-black text-[#0e1b1a] tracking-tight leading-none">
                            {stats?.totalApplications.toLocaleString() || 0}
                        </span>
                        <h3 className="text-sm font-semibold text-[#64748B] mt-1 uppercase tracking-wide">
                            Total Candidates
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
