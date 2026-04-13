import { getHomepageFeaturedJobs } from "@/actions/job.actions";
import { RealJobCard } from "./RealJobCard";
import Link from "next/link";


export async function JobOpeningsSection() {
    // Fetch featured jobs (cached for 60s)
    const featuredJobs = await getHomepageFeaturedJobs();

    return (
        <section className="py-20 bg-[#0f766d]/[0.02] -mx-6 lg:-mx-10 px-6 lg:px-10 rounded-3xl">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4 font-heading">Featured Job Openings</h2>
                <p className="text-gray-500 max-w-xl mx-auto">
                    Hand-picked opportunities from top startups and established companies around the world.
                </p>
            </div>

            {featuredJobs.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredJobs.map((job) => (
                        <RealJobCard key={job.id} job={job} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500">No open jobs available at the moment. Check back later!</p>
                </div>
            )}

            <div className="mt-16 text-center">
                <Link href="/search" className="inline-block bg-white border-2 border-[#0f766d] text-[#0f766d] font-bold px-10 py-4 rounded-xl hover:bg-[#0f766d] hover:text-white transition-all shadow-lg shadow-[#0f766d]/5">
                    Browse All Jobs
                </Link>
            </div>
        </section>
    );
}
