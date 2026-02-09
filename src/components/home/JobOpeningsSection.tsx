import { FEATURED_JOBS } from "@/data/mock-data";
import { JobCard } from "./JobCard";

export function JobOpeningsSection() {
    return (
        <section className="py-20 bg-[#0f766d]/[0.02] -mx-6 lg:-mx-10 px-6 lg:px-10 rounded-3xl">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4 font-heading">Featured Job Openings</h2>
                <p className="text-gray-500 max-w-xl mx-auto">
                    Hand-picked opportunities from top startups and established companies around the world.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FEATURED_JOBS.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>

            <div className="mt-16 text-center">
                <button className="bg-white border-2 border-[#0f766d] text-[#0f766d] font-bold px-10 py-4 rounded-xl hover:bg-[#0f766d] hover:text-white transition-all shadow-lg shadow-[#0f766d]/5">
                    Browse All 14,000+ Jobs
                </button>
            </div>
        </section>
    );
}
