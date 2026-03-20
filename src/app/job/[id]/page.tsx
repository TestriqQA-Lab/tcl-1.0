import Link from "next/link";
import { getJobById, getSimilarJobs } from "@/actions/job.actions";
import { getEmployerApplicationsAction } from "@/actions/employer.application.actions";
import { notFound } from "next/navigation";
import { JobApplyButton } from "@/components/job/JobApplyButton";
import { Star, Briefcase, IndianRupee, MapPin, Building2, Pin, Layers, Users, ExternalLink } from "lucide-react";
import { auth } from "@/auth";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const job = await getJobById(id);
    const similarJobs = await getSimilarJobs(id, 4);
    const session = await auth();

    if (!job) {
        notFound();
    }

    // Fetch applications if the user is the employer
    const isEmployer = session?.user?.id === job.employerId;
    let applicationsData = null;
    if (isEmployer) {
        const apps = await getEmployerApplicationsAction({ jobId: id });
        if (!apps.error) {
            applicationsData = apps.data;
        }
    }

    // Format relative time helper
    const getRelativeTime = (date?: Date) => {
        if (!date) return "Today";
        const now = new Date();
        const diffInMs = now.getTime() - new Date(date).getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInMins = Math.floor(diffInMs / (1000 * 60));

        if (diffInMins < 1) return "Just now";
        if (diffInMins < 60) return `${diffInMins} min ago`;
        if (diffInHours < 24) return "Today";
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}+ weeks ago`;
        return `${Math.floor(diffInDays / 30)}+ months ago`;
    };

    const breadcrumbs = [
        { label: "Jobs", href: "/search" },
        { label: "Details", href: "" },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="max-w-[1280px] mx-auto px-4 md:px-6 py-8 pb-28 lg:pb-8">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 mb-6 text-sm flex-wrap">
                    <Link href="/" className="text-gray-400 hover:text-[#0f766d] transition-colors shrink-0">
                        <span className="material-symbols-outlined text-lg leading-none">home</span>
                    </Link>
                    {breadcrumbs.map((crumb, index) => (
                        <span key={crumb.label} className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400 text-lg shrink-0 leading-none">chevron_right</span>
                            {crumb.href ? (
                                <Link href={crumb.href} className="text-[#0f766d] font-medium hover:underline whitespace-nowrap">
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="text-gray-900 font-semibold truncate max-w-[150px] md:max-w-[300px]">{titleCase(job.title)}</span>
                            )}
                        </span>
                    ))}
                </div>


                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Hero Card - Now inside the left column */}
                        <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm w-full group transition-all">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                <div className="flex-1 min-w-0">
                                    {/* Title */}
                                    <h1 className="text-[22px] md:text-[26px] font-bold text-slate-900 group-hover:text-[#0f766d] transition-colors leading-tight mb-2">
                                        {job.title}
                                    </h1>
                                    
                                    {/* Company Name (Rating removed) */}
                                    <div className="flex items-center gap-2 flex-wrap mb-4">
                                        <span className="text-[16px] font-semibold text-slate-600">{job.company.name}</span>
                                    </div>

                                    {/* Meta Icons Section - Compact */}
                                    <div className="space-y-2">
                                        {/* Experience & Salary */}
                                        <div className="flex items-center gap-6 text-slate-500">
                                            <div className="flex items-center gap-2">
                                                <Briefcase size={16} className="text-slate-400" />
                                                <span className="text-[14px] font-medium">{job.experienceLevel ?? 0} - { (job.experienceLevel ?? 0) + 2 } years</span>
                                            </div>
                                            <span className="text-slate-200 hidden sm:block">|</span>
                                            <div className="flex items-center gap-2">
                                                <IndianRupee size={16} className="text-slate-400" />
                                                <span className="text-[14px] font-medium">{job.salary}</span>
                                            </div>
                                        </div>

                                        {/* Work Mode & Location - Single Row if possible */}
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500">
                                            <div className="flex items-center gap-2">
                                                <Pin size={16} className="text-slate-400" />
                                                <span className="text-[14px] font-medium">{job.type}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className="text-slate-400" />
                                                <span className="text-[14px] font-medium">{job.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Company Logo on Right */}
                                <div className="shrink-0 size-16 md:size-20 rounded-[20px] border border-slate-100 p-3 bg-white flex items-center justify-center shadow-sm">
                                    {job.company.logo ? (
                                        <img 
                                            src={job.company.logo} 
                                            alt={job.company.name || "Logo"} 
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <Building2 size={24} className="text-slate-200" />
                                    )}
                                </div>
                            </div>

                            {/* Divider - Smaller gap */}
                            <div className="h-px bg-slate-100 my-6" />

                            {/* Footer Row */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex flex-wrap items-center gap-4 text-[13px] text-slate-400 font-medium">
                                    <span>Posted: <span className="text-slate-700 font-bold">{getRelativeTime(job.createdAt)}</span></span>
                                    <span className="text-slate-200 hidden sm:block">|</span>
                                    <span>Openings: <span className="text-slate-700 font-bold">1</span></span>
                                    <span className="text-slate-200 hidden sm:block">|</span>
                                    <span>Applicants: <span className="text-slate-700 font-bold">{job.applicantCount}</span></span>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    {!session ? (
                                        <>
                                            <Link 
                                                href="/register"
                                                className="flex-1 md:flex-none px-6 py-2 border border-[#0f766d] text-[#0f766d] font-bold rounded-full hover:bg-teal-50 transition-all text-[14px] text-center"
                                            >
                                                Register
                                            </Link>
                                            <Link 
                                                href="/login"
                                                className="flex-1 md:flex-none px-8 py-2 bg-[#0f766d] hover:bg-[#0d6b63] text-white font-bold rounded-full transition-all text-[14px] text-center shadow-md shadow-teal-500/10"
                                            >
                                                Login to apply
                                            </Link>
                                        </>
                                    ) : (
                                        <JobApplyButton 
                                            jobId={id} 
                                            className="flex-1 md:flex-none px-10 py-2.5 bg-[#0f766d] hover:bg-[#0d6b63] text-white font-bold rounded-full transition-all text-[15px] shadow-lg shadow-teal-500/20" 
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Overview */}
                        <section className="bg-white rounded-xl p-6 md:p-8 border border-gray-100 overflow-hidden w-full">
                            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 border-b border-gray-50 pb-4">
                                Description
                            </h2>
                            <div className="space-y-4">
                                <div 
                                    className="text-gray-600 leading-relaxed text-sm md:text-base break-words w-full prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: job.description }}
                                />
                            </div>
                        </section>

                        {/* Requirements */}
                        {isEmployer && applicationsData && applicationsData.length > 0 && (
                            <section className="bg-white rounded-xl p-6 md:p-8 border border-teal-100 bg-teal-50/5 overflow-hidden w-full shadow-sm">
                                <div className="flex items-center justify-between mb-6 border-b border-teal-100 pb-4">
                                    <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <Users className="text-[#0f766d]" size={24} />
                                        Applications Received
                                        <span className="bg-[#0f766d] text-white text-xs px-2 py-0.5 rounded-full ml-2">
                                            {applicationsData.length}
                                        </span>
                                    </h2>
                                    <Link 
                                        href="/employer/applications" 
                                        className="text-[#0f766d] text-sm font-bold flex items-center gap-1 hover:underline"
                                    >
                                        Manage all <ExternalLink size={14} />
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {applicationsData.slice(0, 5).map((app: any) => (
                                        <div key={app.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-full bg-teal-100 text-[#0f766d] flex items-center justify-center font-bold text-sm">
                                                    {app.initials}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{app.name}</p>
                                                    <p className="text-xs text-slate-500">{app.position || "Candidate"}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                                    app.status === 'Shortlisted' ? 'bg-green-100 text-green-700' :
                                                    app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {app.status}
                                                </span>
                                                <p className="text-[11px] text-slate-400 mt-1">{app.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {applicationsData.length > 5 && (
                                        <p className="text-center text-xs text-slate-400 font-medium pt-2">
                                            + {applicationsData.length - 5} more applicants
                                        </p>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Requirements */}
                        {job.requiredSkills && job.requiredSkills.length > 0 && (
                            <section className="bg-white rounded-xl p-6 md:p-8 border border-gray-100 overflow-hidden w-full">
                                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 border-b border-gray-50 pb-4">
                                    Required Skills
                                </h2>
                                <ul className="space-y-4">
                                    {job.requiredSkills.map((item: string, index: number) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="material-symbols-outlined rounded-full bg-[#0f766d] text-white mt-0.5 text-lg md:text-xl">verified</span>
                                            <span className="text-gray-600 text-sm md:text-base">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* How to Apply */}
                        <section className="bg-white rounded-xl p-6 md:p-8 border border-gray-100 overflow-hidden w-full">
                            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 border-b border-gray-50 pb-4">
                                Ready to Apply?
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-6 text-sm md:text-base">Click below to submit your application for this exciting role directly. Our team reviews applications periodically.</p>
                            <JobApplyButton jobId={id} className="px-8 py-3.5 shadow-lg shadow-[#0f766d]/20" />
                        </section>

                        {/* Similar Jobs - Bigger Cards */}
                        <section className="bg-white rounded-xl p-6 md:p-8 border border-gray-100 overflow-hidden w-full">
                            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 border-b border-gray-50 pb-4">
                                Similar Jobs You Might Like
                            </h2>
                            <div className="space-y-4">
                                {similarJobs.map((simJob: any) => (
                                    <Link
                                        key={simJob.id}
                                        href={`/job/${simJob.id}`}
                                        className="group block bg-slate-50 hover:bg-white border border-slate-100 hover:border-slate-200 rounded-xl p-4 md:p-5 transition-all hover:shadow-lg"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-4">
                                                <div className="size-12 md:size-14 rounded-xl bg-white flex items-center justify-center p-2 border border-slate-100 shrink-0">
                                                    <img
                                                        className="w-full h-full object-contain"
                                                        src={simJob.companyLogo || undefined}
                                                        alt={`${simJob.company || "Company"} logo`}
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="text-base md:text-lg font-bold text-gray-900 group-hover:text-[#0f766d] transition-colors">
                                                        {simJob.title}
                                                    </h4>
                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-slate-500">
                                                        <span className="flex items-center gap-1 font-medium text-slate-700">
                                                            <span className="material-symbols-outlined text-[16px]">business</span>
                                                            {simJob.company}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[16px]">location_on</span>
                                                            {simJob.location}
                                                        </span>
                                                        <span className="px-2 py-0.5 bg-teal-50 text-[#0f766d] text-xs font-bold rounded-md">
                                                            {simJob.type}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div 
                                            className="text-slate-600 text-sm mt-3 line-clamp-2 leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: simJob.description }}
                                        />
                                        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                                            <div className="text-slate-900 font-bold text-sm md:text-base">
                                                {simJob.salary} <span className="text-slate-400 font-normal text-xs">/ year</span>
                                            </div>
                                            <span className="px-4 py-2 bg-[#0f766d] text-white text-xs md:text-sm font-bold rounded-lg">
                                                View Details
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Sidebar */}
                    <aside className="lg:col-span-4 space-y-6">
                        {/* About Company Widget */}
                        <div className="bg-white rounded-xl p-6 border border-gray-100 lg:sticky lg:top-24 overflow-hidden w-full">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="size-14 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-2 shadow-sm overflow-hidden">
                                    <img alt={`${job.company.name || "Company"} Logo`} className="w-full" src={job.company.logo || undefined} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{job.company.name}</h3>
                                    <span className="text-xs font-bold text-[#0f766d] bg-[#0f766d]/10 px-2 py-0.5 rounded uppercase">
                                        {job.company.industry}
                                    </span>
                                </div>
                            </div>
                            <div className="text-sm text-gray-600 mb-4 leading-relaxed prose prose-sm" dangerouslySetInnerHTML={{ __html: job.company.description || "" }} />
                            <a
                                href="#"
                                className="block text-center text-[#0f766d] font-bold text-sm py-3 border border-[#0f766d]/20 rounded-xl hover:bg-[#0f766d]/5 transition-colors"
                            >
                                View Company Profile
                            </a>

                            {/* Similar Jobs */}
                            <div className="mt-8">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">Similar Jobs</h3>
                                <div className="space-y-4">
                                    {similarJobs.slice(0, 3).map((simJob: any) => (
                                        <div key={simJob.id} className="group cursor-pointer">
                                            <Link href={`/job/${simJob.id}`} passHref>
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 bg-gray-100 rounded-lg flex items-center justify-center p-1 overflow-hidden">
                                                        <img src={simJob.companyLogo || undefined} alt={simJob.company || "Company"} className="object-contain w-full h-full" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 group-hover:text-[#0f766d] transition-colors">
                                                            {simJob.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {simJob.company} • {simJob.location}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                                <a href="#" className="mt-6 block text-center text-gray-500 text-xs font-semibold hover:text-[#0f766d]">
                                    See all design jobs
                                </a>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Mobile Sticky Apply Button */}
            <div className="lg:hidden fixed bottom-[64px] left-0 right-0 bg-white border-t border-gray-200 p-2 z-50">
                <div className="flex items-center gap-3">
                    <JobApplyButton jobId={id} className="flex-1 py-2 shadow-lg shadow-[#0f766d]/20" />

                </div>
            </div>
        </div>
    );
}

function titleCase(str: string) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}
