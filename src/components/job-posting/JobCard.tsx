'use client';

import React, { useState, useTransition, useRef, useEffect } from 'react';
import { MapPin, Clock, Briefcase, MoreVertical, Pause, X, Play, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { updateJobStatus } from '@/actions/job.actions';

export interface JobCardProps {
    id: string;
    title: string;
    location: string;
    type: string;
    department?: string;
    status: 'Active' | 'Paused' | 'Closed';
    applications: number;
    shortlisted: number;
    postedDate: string;
    statusChangedDate?: string; // Paused on / Closed on date
    onEditJob?: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({
    id,
    title,
    location,
    type,
    department,
    status,
    applications,
    shortlisted,
    postedDate,
    statusChangedDate,
    onEditJob,
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const menuRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleStatusChange = (newStatus: 'OPEN' | 'PAUSED' | 'CLOSED') => {
        setMenuOpen(false);
        startTransition(async () => {
            await updateJobStatus(id, newStatus);
        });
    };

    // Status badge styling
    const getStatusStyles = () => {
        switch (status) {
            case 'Active':
                return 'bg-[#ecfdf5] text-[#047857] border-[#10b98140]';
            case 'Paused':
                return 'bg-[#F1F5F9] text-[#64748B] border-[#cbd5e1]';
            case 'Closed':
                return 'bg-[#fee2e2] text-[#b91c1c] border-[#f8717140]';
            default:
                return 'bg-[#F1F5F9] text-[#64748B] border-[#cbd5e1]';
        }
    };

    const statusStyle = getStatusStyles();

    return (
        <div className={`relative flex flex-col md:flex-row w-full bg-white rounded-[10px] md:rounded-xl border border-[#E2E8F0] p-4 md:p-6 gap-4 md:gap-6 md:items-center transition-opacity ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>

            {/* Three-dot menu — absolutely positioned top-right */}
            <div className="absolute top-3 right-3" ref={menuRef}>
                <button
                    onClick={() => setMenuOpen(prev => !prev)}
                    className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-[#F1F5F9] transition-colors text-[#64748B]"
                    title="More options"
                >
                    <MoreVertical className="w-4 h-4" />
                </button>

                {menuOpen && (
                    <div className="absolute right-0 top-8 z-20 bg-white border border-[#E2E8F0] rounded-xl shadow-lg w-44 py-1 overflow-hidden">
                        {/* Active: can Pause or Close */}
                        {status === 'Active' && (<>
                            <button onClick={() => handleStatusChange('PAUSED')} className="flex items-center gap-2.5 w-full px-4 py-2.5 hover:bg-[#F8FAFB] transition-colors text-left">
                                <Pause className="w-4 h-4 text-[#64748B]" />
                                <span className="text-[#0e1b1a] font-inter text-sm">Pause Job</span>
                            </button>
                            <button onClick={() => handleStatusChange('CLOSED')} className="flex items-center gap-2.5 w-full px-4 py-2.5 hover:bg-[#FEF2F2] transition-colors text-left">
                                <X className="w-4 h-4 text-[#EF4444]" />
                                <span className="text-[#EF4444] font-inter text-sm">Close Job</span>
                            </button>
                        </>)}
                        {/* Paused: can Resume or Close */}
                        {status === 'Paused' && (<>
                            <button onClick={() => handleStatusChange('OPEN')} className="flex items-center gap-2.5 w-full px-4 py-2.5 hover:bg-[#F0FDF4] transition-colors text-left">
                                <Play className="w-4 h-4 text-[#15803d]" />
                                <span className="text-[#15803d] font-inter text-sm">Resume Job</span>
                            </button>
                            <button onClick={() => handleStatusChange('CLOSED')} className="flex items-center gap-2.5 w-full px-4 py-2.5 hover:bg-[#FEF2F2] transition-colors text-left">
                                <X className="w-4 h-4 text-[#EF4444]" />
                                <span className="text-[#EF4444] font-inter text-sm">Close Job</span>
                            </button>
                        </>)}
                        {/* Closed: can Repost (Open) or Pause */}
                        {status === 'Closed' && (<>
                            <button onClick={() => handleStatusChange('OPEN')} className="flex items-center gap-2.5 w-full px-4 py-2.5 hover:bg-[#EFF6FF] transition-colors text-left">
                                <RefreshCw className="w-4 h-4 text-[#1d4ed8]" />
                                <span className="text-[#1d4ed8] font-inter text-sm">Repost Job</span>
                            </button>
                            <button onClick={() => handleStatusChange('PAUSED')} className="flex items-center gap-2.5 w-full px-4 py-2.5 hover:bg-[#F8FAFB] transition-colors text-left">
                                <Pause className="w-4 h-4 text-[#64748B]" />
                                <span className="text-[#0e1b1a] font-inter text-sm">Pause Job</span>
                            </button>
                        </>)}
                    </div>
                )}
            </div>

            {/* Left Section: Title and Meta */}
            <div className="flex flex-col gap-3 md:gap-2 flex-grow">
                {/* Status Badge — top-left above title */}
                <div className={`self-start flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${statusStyle}`}>
                    {status === 'Active' && <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />}
                    <span className="font-inter text-[11px] md:text-xs font-semibold leading-none">{status}</span>
                </div>

                {/* Title */}
                <div className="flex flex-row items-start gap-4">
                    <h3 className="text-[#0e1b1a] font-inter text-base md:text-[17px] font-bold leading-snug pr-8">
                        {title}
                    </h3>
                </div>

                {/* Meta Info */}
                <div className="flex flex-row flex-wrap gap-3 md:gap-4 items-center">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#64748B]" />
                        <span className="text-[#64748B] font-inter text-xs md:text-sm">{location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#64748B]" />
                        <span className="text-[#64748B] font-inter text-xs md:text-sm">{type}</span>
                    </div>
                    {department && (
                        <div className="hidden md:flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-[#64748B]" />
                            <span className="text-[#64748B] font-inter text-sm">{department}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 py-1 px-2 bg-gray-50 rounded border border-gray-100">
                        <span className="text-[#64748B] font-inter text-[11px] md:text-xs">Posted on: <span className="text-[#0e1b1a] font-semibold">{postedDate}</span></span>
                    </div>
                    {status === 'Paused' && statusChangedDate && (
                        <div className="flex items-center gap-1.5 py-1 px-2 bg-slate-50 rounded border border-slate-100">
                            <span className="text-[#64748B] font-inter text-[11px] md:text-xs">Paused on: <span className="font-semibold">{statusChangedDate}</span></span>
                        </div>
                    )}
                    {status === 'Closed' && statusChangedDate && (
                        <div className="flex items-center gap-1.5 py-1 px-2 bg-red-50/50 rounded border border-red-100/50">
                            <span className="text-[#dc2626] font-inter text-[11px] md:text-xs">Closed on: <span className="font-semibold">{statusChangedDate}</span></span>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Divider */}
            <div className="w-full h-[1px] bg-[#E2E8F0] md:hidden" />

            {/* Middle Section: Stats */}
            <div className="flex flex-row justify-between md:justify-start md:gap-8 lg:gap-12 shrink-0">
                <div className="flex flex-col gap-0.5 md:gap-1">
                    <span className="text-[#0e1b1a] font-inter text-base md:text-lg font-bold">{applications}</span>
                    <span className="text-[#64748B] font-inter text-[11px] md:text-xs">Applications</span>
                </div>
                <div className="flex flex-col gap-0.5 md:gap-1">
                    <span className="text-[#0f766d] font-inter text-base md:text-lg font-bold">{shortlisted}</span>
                    <span className="text-[#64748B] font-inter text-[11px] md:text-xs">Shortlisted</span>
                </div>
            </div>

            <div className="flex flex-row md:flex-col flex-wrap gap-2 md:gap-2 w-full md:w-auto mt-2 md:mt-0 shrink-0 md:mr-8">
                <button
                    onClick={() => onEditJob?.(id)}
                    className="flex-1 md:flex-none flex justify-center items-center h-9 md:h-10 px-4 md:px-5 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFB] transition-colors"
                >
                    <span className="text-[#0e1b1a] font-inter text-[13px] md:text-sm font-semibold">Edit Job</span>
                </button>
                <Link
                    href={`/employer-applications?jobId=${id}`}
                    className="flex-1 md:flex-none flex justify-center items-center h-9 md:h-10 px-4 md:px-5 rounded-lg bg-[#0f766d] hover:bg-[#0c5e57] transition-colors"
                >
                    <span className="text-white font-inter text-[13px] md:text-sm font-semibold">View Applications</span>
                </Link>
            </div>

        </div>
    );
};

export default JobCard;
