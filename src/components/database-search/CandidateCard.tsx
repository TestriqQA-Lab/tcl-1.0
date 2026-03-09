"use client";

import { MapPin, GraduationCap, Link2, MoreVertical, Building2, PersonStanding, Eye, Briefcase, PlusSquare } from "lucide-react";

export interface CandidateProps {
    id: string;
    name: string;
    initials: string;
    avatarColor: string;
    title: string;
    company: string;
    location: string;
    education: string;
    skills: string[];
    companyInitials: string;
    companyColor: string;
}

interface CandidateCardProps {
    candidate: CandidateProps;
}

export function CandidateCard({ candidate }: CandidateCardProps) {
    return (
        <div className="flex flex-col w-full bg-white border border-[#E2E8F0] rounded-xl p-4 md:p-6 mb-4">
            {/* Header section (Mobile vertically stacks items if very narrow, otherwise horizontal) */}
            <div className="flex items-start justify-between w-full mb-4">
                <div className="flex items-start gap-3 md:gap-4">
                    {/* Checkbox (Mock) */}
                    <div className="flex items-center justify-center w-4 h-4 mt-1 border-[1.5px] border-[#94A3B8] rounded rounded-sm shrink-0" />

                    {/* Avatar */}
                    <div
                        className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full shrink-0"
                        style={{ backgroundColor: candidate.avatarColor }}
                    >
                        <span className="text-white font-bold text-[14px] md:text-[16px]">
                            {candidate.initials}
                        </span>
                    </div>

                    {/* Name & Title */}
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-[15px] md:text-[16px] font-bold text-[#3B82F6]">
                                {candidate.name}
                            </h3>
                            <button className="flex border-none px-1 text-[#3B82F6] hover:bg-[#EFF6FF] rounded items-center">
                                <span className="text-[12px] md:text-[13px] font-medium hidden xs:block">LinkedIn</span>
                            </button>
                        </div>
                        <p className="text-[12px] md:text-[13px] text-[#475569]">{candidate.title}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 md:gap-4 text-[#334155]">
                     <div className="hidden md:flex items-center gap-4">
                        <button className="hover:text-[#0e1b1a]"><PersonStanding className="w-5 h-5"/></button>
                        <button className="hover:text-[#0e1b1a]"><Eye className="w-5 h-5"/></button>
                        <button className="hover:text-[#0e1b1a]"><Briefcase className="w-5 h-5"/></button>
                        <button className="hover:text-[#0e1b1a]"><PlusSquare className="w-5 h-5"/></button>
                    </div>
                    {/* Mobile specific options menu */}
                    <button className="md:hidden p-1 hover:bg-[#F1F5F9] rounded">
                        <MoreVertical className="w-5 h-5 text-[#64748B]" />
                    </button>
                </div>
            </div>

            {/* Body section: Desktop/Tablet side-by-side, Mobile stacked */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full">
                 {/* Left Column: Candidate Info */}
                 <div className="flex flex-col flex-1 gap-3">
                    <h4 className="text-[13px] font-bold text-[#334155] hidden md:block">Candidate information</h4>
                    
                    <div className="flex items-center gap-2 text-[#475569]">
                        <MapPin className="w-4 h-4 text-[#64748B] shrink-0" />
                        <span className="text-[12px] md:text-[13px]">{candidate.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-[#475569]">
                        <GraduationCap className="w-4 h-4 text-[#64748B] shrink-0" />
                        <span className="text-[12px] md:text-[13px] line-clamp-1">{candidate.education}</span>
                    </div>

                    <h4 className="text-[13px] font-bold text-[#334155] mt-2 hidden md:block">Company</h4>
                    <div className="flex items-center gap-2">
                        <div 
                            className="flex items-center justify-center w-6 h-6 rounded-full shrink-0"
                            style={{ backgroundColor: candidate.companyColor }}
                        >
                            <span className="text-white text-[10px] font-bold">{candidate.companyInitials}</span>
                        </div>
                        <span className="text-[12px] md:text-[13px] font-medium text-[#475569] truncate">
                            {candidate.company}
                        </span>
                        <Link2 className="w-3.5 h-3.5 text-[#94A3B8] hidden md:block shrink-0" />
                    </div>
                 </div>

                 {/* Right Column: Skills */}
                 <div className="flex flex-col flex-1 gap-3">
                     <h4 className="text-[13px] font-bold text-[#334155] hidden md:block">Candidate skills</h4>
                     
                     <div className="flex flex-wrap gap-2">
                         {candidate.skills.slice(0, 4).map((skill, index) => (
                             <span 
                                key={index} 
                                className="px-3 py-1 bg-[#EFF6FF] text-[#3B82F6] text-[11px] md:text-[12px] font-medium rounded-full"
                             >
                                 {skill}
                             </span>
                         ))}
                         {candidate.skills.length > 4 && (
                             <span className="px-2 py-1 flex items-center text-[#3B82F6] text-[11px] md:text-[12px] font-medium cursor-pointer hover:underline">
                                 + Show more
                             </span>
                         )}
                     </div>
                 </div>
            </div>
        </div>
    );
}

