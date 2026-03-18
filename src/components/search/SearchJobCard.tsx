import Link from "next/link";
export interface SearchJob {
    id: string;
    title: string;
    company: string | null;
    companyLogo: string | null;
    location: string;
    type: string;
    description: string;
    salary: string;
}

export interface SearchJobCardProps {
    job: SearchJob;
}

export function SearchJobCard({ job }: SearchJobCardProps) {
    return (
        <div className="group bg-white border border-slate-100 rounded-2xl p-4 hover:shadow-xl hover:shadow-teal-900/5 transition-all overflow-hidden w-full max-w-full">
            {/* Header: Logo, Title, Company, Location, Type, Favorite */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 min-w-0 flex-1">
                    <div className="size-14 rounded-xl bg-slate-50 flex items-center justify-center p-2 border border-slate-100 shrink-0">
                        <img
                            className="w-full h-full object-contain"
                            src={job.companyLogo || undefined}
                            alt={`${job.company || "Company"} logo`}
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="text-lg font-bold group-hover:text-[#0f766d] transition-colors truncate">
                            {job.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                            <span className="flex items-center gap-1 font-medium text-slate-700 min-w-0 max-w-full">
                                <span className="material-symbols-outlined text-[18px] shrink-0">business</span>
                                <span className="truncate">{job.company || "Unknown"}</span>
                            </span>
                            <span className="flex items-center gap-1 min-w-0 max-w-full">
                                <span className="material-symbols-outlined text-[18px] shrink-0">location_on</span>
                                <span className="truncate">{job.location}</span>
                            </span>
                            <span className="px-2 py-0.5 bg-teal-50 text-[#0f766d] text-xs font-bold rounded-md shrink-0">
                                {job.type}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="mt-4">
                <div 
                    className="text-slate-600 text-sm line-clamp-2 leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                />
            </div>

            {/* Footer: Salary & View Details */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4 gap-4">
                <div className="text-slate-900 font-bold truncate">
                    {job.salary} <span className="text-slate-400 font-normal text-xs">/ year</span>
                </div>
                <Link
                    href={`/job/${job.id}`}
                    className="px-5 py-2 bg-[#0f766d] text-white text-sm font-bold rounded-xl hover:bg-teal-800 transition-all shrink-0"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}
