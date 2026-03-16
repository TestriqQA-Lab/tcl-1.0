import { auth } from "@/auth";
import { getRecommendedJobsAction } from "@/actions/job.actions";
import { DashboardJobCard } from "@/components/dashboard/DashboardJobCard";
import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { ProfileSidebar } from "@/components/dashboard/ProfileSidebar";
import { redirect } from "next/navigation";

export default async function SeekerJobsPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const result = await getRecommendedJobsAction(session.user.id);
    const recommendedJobs = 'jobs' in result ? result.jobs || [] : [];

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24 lg:pb-10">
            <div className="max-w-[1440px] mx-auto py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Sidebar */}
                    <div className="hidden lg:block lg:col-span-3 space-y-6">
                        <ProfileSidebar
                            user={{ name: session.user.name || "Seeker", image: session.user.image || undefined }}
                        />
                        <SidebarNav />
                    </div>

                    {/* Main Content */}
                    <div className="col-span-1 lg:col-span-9 space-y-6 px-4 lg:px-0">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Recommended Jobs</h1>
                                <p className="text-gray-500 text-sm">Jobs based on your profile and preferences</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {recommendedJobs.length > 0 ? (
                                recommendedJobs.map((job: any) => (
                                    <DashboardJobCard
                                        key={job.id}
                                        id={job.id}
                                        title={job.title}
                                        company={job.company}
                                        location={job.location}
                                        salary={job.salary}
                                        timeAgo={job.timeAgo}
                                        logoUrl={job.logoUrl}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-100">
                                    <p className="text-slate-500">No jobs found matching your role yet. Update your profile to get better matches!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
