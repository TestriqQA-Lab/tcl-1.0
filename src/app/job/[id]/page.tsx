import Link from "next/link";
import { getJobById, getSimilarJobs } from "@/actions/job.actions";
import { notFound } from "next/navigation";
import { JobApplyButton } from "@/components/job/JobApplyButton";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const job = await getJobById(id);
    const similarJobs = await getSimilarJobs(id, 4);

    if (!job) {
        notFound();
    }

    const breadcrumbs = [
        { label: "Jobs", href: "/search" },
        { label: "Details", href: "" },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <main className="max-w-[1280px] mx-auto md:px-6 py-8">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 mb-6 text-sm">
                    <Link href="/" className="text-gray-400 hover:text-[#0f766d] transition-colors">
                        <span className="material-symbols-outlined text-lg">home</span>
                    </Link>
                    {breadcrumbs.map((crumb, index) => (
                        <span key={crumb.label} className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400 text-lg">chevron_right</span>
                            {crumb.href ? (
                                <Link href={crumb.href} className="text-[#0f766d] font-medium hover:underline">
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="text-gray-900 font-semibold">{titleCase(job.title)}</span>
                            )}
                        </span>
                    ))}
                </div>


                {/* Hero Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 md:p-8 shadow-sm mb-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 md:gap-8">
                        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                            <div className="size-16 md:size-20 bg-white border border-gray-100 rounded-xl flex items-center justify-center p-3 shadow-sm overflow-hidden shrink-0">
                                <img alt={`${job.company.name || "Company"} Logo`} className="w-full" src={job.company.logo || undefined} />
                            </div>
                            <div className="space-y-3">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{job.title}</h1>
                                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-gray-600">
                                    <span className="font-semibold text-[#0f766d]">{job.company.name}</span>
                                    <span className="flex items-center gap-1 text-sm">
                                        <span className="material-symbols-outlined text-lg">location_on</span>
                                        {job.location}
                                    </span>
                                    <span className="bg-[#0f766d]/10 text-[#0f766d] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {job.type}
                                    </span>
                                    <span className="flex items-center gap-1 font-medium text-gray-900 text-sm">
                                        <span className="material-symbols-outlined text-lg">payments</span>
                                        {job.salary}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="hidden xl:flex items-center space-x-5">
                            <JobApplyButton jobId={id} className="md:px-8 py-3.5 shadow-lg shadow-[#0f766d]/20" />
                            <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 p-3 md:p-3.5 rounded-xl transition-all">
                                <span className="material-symbols-outlined block">share</span>
                            </button>
                            <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 p-3 md:p-3.5 rounded-xl transition-all">
                                <span className="material-symbols-outlined block">bookmark</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Overview */}
                        <section className="bg-white rounded-xl p-6 md:p-8 border border-gray-100">
                            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 border-b border-gray-50 pb-4">
                                Description
                            </h2>
                            <div className="space-y-4">
                                <p className="text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                                    {job.description}
                                </p>
                            </div>
                        </section>

                        {/* Requirements */}
                        {job.requiredSkills && job.requiredSkills.length > 0 && (
                            <section className="bg-white rounded-xl p-6 md:p-8 border border-gray-100">
                                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 border-b border-gray-50 pb-4">
                                    Required Skills
                                </h2>
                                <ul className="space-y-4">
                                    {job.requiredSkills.map((item, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="material-symbols-outlined rounded-full bg-[#0f766d] text-white mt-0.5 text-lg md:text-xl">verified</span>
                                            <span className="text-gray-600 text-sm md:text-base">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* How to Apply */}
                        <section className="bg-white rounded-xl p-6 md:p-8 border border-gray-100">
                            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 border-b border-gray-50 pb-4">
                                Ready to Apply?
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-6 text-sm md:text-base">Click below to submit your application for this exciting role directly. Our team reviews applications periodically.</p>
                            <JobApplyButton jobId={id} className="px-8 py-3.5 shadow-lg shadow-[#0f766d]/20" />
                        </section>

                        {/* Similar Jobs - Bigger Cards */}
                        <section className="bg-white rounded-xl p-6 md:p-8 border border-gray-100">
                            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 border-b border-gray-50 pb-4">
                                Similar Jobs You Might Like
                            </h2>
                            <div className="space-y-4">
                                {similarJobs.map((simJob) => (
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
                                            <button
                                                className="text-slate-300 hover:text-rose-500 transition-colors"
                                            >
                                                <span className="material-symbols-outlined">favorite</span>
                                            </button>
                                        </div>
                                        <p className="text-slate-600 text-sm mt-3 line-clamp-2 leading-relaxed">
                                            {simJob.description}
                                        </p>
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
                        <div className="bg-white rounded-xl p-6 border border-gray-100 lg:sticky lg:top-24">
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
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{job.company.description}</p>
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
                                    {similarJobs.slice(0, 3).map((simJob) => (
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
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
                <div className="flex items-center gap-3">
                    <JobApplyButton jobId={id} className="flex-1 py-3.5 shadow-lg shadow-[#0f766d]/20" />
                    <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 p-3.5 rounded-xl transition-all">
                        <span className="material-symbols-outlined block">mail</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function titleCase(str: string) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}
