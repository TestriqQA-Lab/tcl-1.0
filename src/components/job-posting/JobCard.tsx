import React from 'react';
import { MapPin, Clock, Briefcase } from 'lucide-react';
import Link from 'next/link';

export interface JobCardProps {
    id: string;
    title: string;
    location: string;
    type: string;
    department?: string;
    status: 'Active' | 'Paused' | 'Closed';
    views: number;
    applications: number;
    shortlisted: number;
    postedDate: string;
    closedDate?: string;
}

const JobCard: React.FC<JobCardProps> = ({
    id,
    title,
    location,
    type,
    department,
    status,
    views,
    applications,
    shortlisted,
    postedDate,
    closedDate,
}) => {
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
        <div className="flex flex-col md:flex-row w-full bg-white rounded-[10px] md:rounded-xl border border-[#E2E8F0] p-4 md:p-6 gap-4 md:gap-6 md:items-center">

            {/* Left Section: Title and Meta */}
            <div className="flex flex-col gap-3 md:gap-2 flex-grow">
                {/* Header Row (Mobile: Space between Title and Badge) */}
                <div className="flex flex-row justify-between items-start gap-4">
                    <h3 className="text-[#0e1b1a] font-inter text-base md:text-[17px] font-bold leading-snug">
                        {title}
                    </h3>

                    {/* Status Badge (Desktop position can vary, but standard flex placement is fine) */}
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${statusStyle} shrink-0`}>
                        {status === 'Active' && <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />}
                        <span className="font-inter text-[11px] md:text-xs font-semibold leading-none">{status}</span>
                    </div>
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
                    {status === 'Closed' && closedDate && (
                        <div className="flex items-center gap-1.5 py-1 px-2 bg-red-50/50 rounded border border-red-100/50">
                            <span className="text-[#dc2626] font-inter text-[11px] md:text-xs">Closed on: <span className="font-semibold">{closedDate}</span></span>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Divider */}
            <div className="w-full h-[1px] bg-[#E2E8F0] md:hidden" />

            {/* Middle Section: Stats */}
            <div className="flex flex-row justify-between md:justify-start md:gap-8 lg:gap-12 shrink-0">
                <div className="flex flex-col gap-0.5 md:gap-1">
                    <span className="text-[#0e1b1a] font-inter text-base md:text-lg font-bold">{views}</span>
                    <span className="text-[#64748B] font-inter text-[11px] md:text-xs">Total Views</span>
                </div>
                <div className="flex flex-col gap-0.5 md:gap-1">
                    <span className="text-[#0e1b1a] font-inter text-base md:text-lg font-bold">{applications}</span>
                    <span className="text-[#64748B] font-inter text-[11px] md:text-xs">Applications</span>
                </div>
                <div className="flex flex-col gap-0.5 md:gap-1">
                    <span className="text-[#0f766d] font-inter text-base md:text-lg font-bold">{shortlisted}</span>
                    <span className="text-[#64748B] font-inter text-[11px] md:text-xs">Shortlisted</span>
                </div>
            </div>

            <div className="flex flex-row md:flex-col flex-wrap gap-2 md:gap-2 w-full md:w-auto mt-2 md:mt-0 shrink-0">
                {status === 'Paused' && (
                    <button className="flex-1 md:flex-none flex justify-center items-center h-9 md:h-10 px-4 md:px-5 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] hover:bg-[#dcfce7] transition-colors group">
                        <span className="text-[#15803d] font-inter text-[13px] md:text-sm font-semibold">Resume job post</span>
                    </button>
                )}
                {status === 'Closed' && (
                    <button className="flex-1 md:flex-none flex justify-center items-center h-9 md:h-10 px-4 md:px-5 rounded-lg bg-[#eff6ff] border border-[#bfdbfe] hover:bg-[#dbeafe] transition-colors">
                        <span className="text-[#1d4ed8] font-inter text-[13px] md:text-sm font-semibold">Repost</span>
                    </button>
                )}
                <button className="flex-1 md:flex-none flex justify-center items-center h-9 md:h-10 px-4 md:px-5 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFB] transition-colors">
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
