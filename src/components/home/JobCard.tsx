import React from "react";
import { Job } from "@/data/mock-data";

interface JobCardProps {
    job: Job;
}

export function JobCard({ job }: JobCardProps) {
    return (
        <div className="bg-white p-6 rounded-xl ring-2 ring-[#0f766d]/20 hover:ring-[#0f766d]/50 hover:shadow-2xl hover:-translate-y-1 transition-all group h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div className={`size-14 rounded-lg flex items-center justify-center p-2 border border-gray-100 ${job.logoBg}`}>
                    {/* Using the image URL from mock data which matches code.html */}
                    <img
                        alt={`${job.company} logo`}
                        className="w-full h-full object-contain"
                        src={job.logoUrl}
                    />
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide
          ${job.type === 'Full Time' || job.type === 'Internship' ? 'bg-green-100 text-green-700' :
                        job.type === 'Remote' ? 'bg-blue-100 text-blue-700' :
                            job.type === 'Urgent' || job.type === 'Part Time' ? 'bg-yellow-100 text-yellow-700' :
                                job.type === 'Hybrid' ? 'bg-purple-100 text-purple-700' :
                                    'bg-gray-100 text-gray-700'
                    }`}>
                    {job.type}
                </span>
            </div>

            <div className="flex-grow">
                <h3 className="text-xl font-bold group-hover:text-[#0f766d] transition-colors">{job.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{job.company} • {job.location}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                    {job.tags.map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 px-3 py-1 rounded-full font-medium">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <button className="w-full mt-8 bg-gray-50 text-[#0f766d] group-hover:bg-[#0f766d] group-hover:text-white font-bold py-3 rounded-lg transition-all cursor-pointer">
                View Details
            </button>
        </div>
    );
}
