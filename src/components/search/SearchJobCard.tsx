import Link from "next/link";
import { SearchJob } from "@/data/search-mock-data";

interface SearchJobCardProps {
    job: SearchJob;
}

export function SearchJobCard({ job }: SearchJobCardProps) {
    return (
        <div className="group bg-white border border-slate-100 rounded-2xl p-4 hover:shadow-xl hover:shadow-teal-900/5 transition-all">
            {/* Header: Logo, Title, Company, Location, Type, Favorite */}
            <div className="flex items-start justify-between">
                <div className="flex gap-4">
                    <div className="size-14 rounded-xl bg-slate-50 flex items-center justify-center p-2 border border-slate-100 shrink-0">
                        <img
                            className="w-full h-full object-contain"
                            src={job.companyLogo}
                            alt={`${job.company} logo`}
                        />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold group-hover:text-[#0f766d] transition-colors">
                            {job.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                            <span className="flex items-center gap-1 font-medium text-slate-700">
                                <span className="material-symbols-outlined text-[18px]">business</span>
                                {job.company}
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[18px]">location_on</span>
                                {job.location}
                            </span>
                            <span className="px-2 py-0.5 bg-teal-50 text-[#0f766d] text-xs font-bold rounded-md">
                                {job.type}
                            </span>
                        </div>
                    </div>
                </div>
                <button className="text-slate-300 hover:text-rose-500 transition-colors">
                    <span className="material-symbols-outlined">favorite</span>
                </button>
            </div>

            {/* Description */}
            <div className="mt-4">
                <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                    {job.description}
                </p>
            </div>

            {/* Footer: Salary & View Details */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                <div className="text-slate-900 font-bold">
                    {job.salary} <span className="text-slate-400 font-normal text-xs">/ year</span>
                </div>
                <Link
                    href={`/job/${job.id}`}
                    className="px-5 py-2 bg-[#0f766d] text-white text-sm font-bold rounded-xl hover:bg-teal-800 transition-all"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}
