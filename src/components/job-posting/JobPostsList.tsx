import React from 'react';
import JobCard, { JobCardProps } from './JobCard';

const MOCK_JOBS: JobCardProps[] = [
    {
        id: 'frontend',
        title: 'Sr. Frontend Developer',
        location: 'San Francisco, CA (Remote)',
        type: 'Full-time',
        department: 'Engineering',
        status: 'Active',
        views: 128,
        applications: 45,
        shortlisted: 12,
    },
    {
        id: 'backend',
        title: 'Backend Engineer',
        location: 'Bangalore, India',
        type: 'Full-time',
        department: 'Engineering',
        status: 'Active',
        views: 215,
        applications: 32,
        shortlisted: 5,
    },
    {
        id: 'designer',
        title: 'Product Designer',
        location: 'New York, NY (Hybrid)',
        type: 'Full-time',
        department: 'Design',
        status: 'Active',
        views: 342,
        applications: 89,
        shortlisted: 8,
    },
    {
        id: 'analyst',
        title: 'Data Analyst',
        location: 'Remote',
        type: 'Contract',
        department: 'Analytics',
        status: 'Active',
        views: 156,
        applications: 18,
        shortlisted: 4,
    },
    {
        id: 'qa-engineer',
        title: 'Sr. QA Engineer',
        location: 'Austin, TX',
        type: 'Full-time',
        department: 'Engineering',
        status: 'Paused',
        views: 92,
        applications: 14,
        shortlisted: 2,
    },
    {
        id: 'hr-manager',
        title: 'HR Manager',
        location: 'Chicago, IL',
        type: 'Full-time',
        department: 'People',
        status: 'Paused',
        views: 45,
        applications: 8,
        shortlisted: 1,
    },
    {
        id: 'sales-lead',
        title: 'Sales Lead',
        location: 'Remote',
        type: 'Full-time',
        department: 'Sales',
        status: 'Closed',
        views: 520,
        applications: 142,
        shortlisted: 15,
    },
    {
        id: 'content-writer',
        title: 'Content Writer',
        location: 'Remote',
        type: 'Part-time',
        department: 'Marketing',
        status: 'Closed',
        views: 310,
        applications: 95,
        shortlisted: 10,
    }
];

interface JobPostsListProps {
    selectedStatus: string;
}

const JobPostsList: React.FC<JobPostsListProps> = ({ selectedStatus }) => {
    const filteredJobs = MOCK_JOBS.filter(job =>
        job.status.toLowerCase() === selectedStatus.toLowerCase()
    );

    return (
        <div className="flex flex-col w-full gap-4 md:gap-5 mt-2 md:mt-4">
            {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                    <JobCard key={job.id} {...job} />
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
