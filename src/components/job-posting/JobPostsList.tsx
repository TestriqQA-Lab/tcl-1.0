import React from 'react';
import JobCard, { JobCardProps } from './JobCard';

interface JobPostsListProps {
    jobs: JobCardProps[];
    selectedStatus: string;
    onEditJob?: (jobId: string) => void;
}

const JobPostsList: React.FC<JobPostsListProps> = ({ jobs, selectedStatus, onEditJob }) => {
    const filteredJobs = jobs.filter(job =>
        job.status.toLowerCase() === selectedStatus.toLowerCase()
    );

    return (
        <div className="flex flex-col w-full gap-4 md:gap-5 mt-2 md:mt-4">
            {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                    <JobCard key={job.id} {...job} onEditJob={onEditJob || job.onEditJob} />
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-xl border border-[#E2E8F0]">
                    <p className="text-[#64748B] text-sm">No {selectedStatus} jobs found.</p>
                </div>
            )}
        </div>
    );
};

export default JobPostsList;
