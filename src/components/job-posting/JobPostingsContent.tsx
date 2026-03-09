'use client';

import React, { useState } from 'react';
import JobPostingsHeader from './JobPostingsHeader';
import StatusFilterStrip, { TabType } from './StatusFilterStrip';
import JobPostsList from './JobPostsList';
import EditJobModal from './EditJobModal';

interface JobPostingsContentProps {
    initialJobs: any[];
}

const JobPostingsContent = ({ initialJobs }: JobPostingsContentProps) => {
    const [activeTab, setActiveTab] = useState<TabType>('active');
    const [editingJobId, setEditingJobId] = useState<string | null>(null);

    const counts = {
        active: initialJobs.filter(j => j.status === 'Active').length,
        paused: initialJobs.filter(j => j.status === 'Paused').length,
        closed: initialJobs.filter(j => j.status === 'Closed').length,
    };

    return (
        <div className="flex flex-col w-full min-h-full bg-[#F8FAFB] p-4 md:p-6 lg:p-8 gap-5 md:gap-7">
            <JobPostingsHeader />
            <StatusFilterStrip activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />
            <JobPostsList
                jobs={initialJobs}
                selectedStatus={activeTab}
                onEditJob={(id) => setEditingJobId(id)}
            />

            {editingJobId && (
                <EditJobModal
                    jobId={editingJobId}
                    onClose={() => setEditingJobId(null)}
                />
            )}
        </div>
    );
};

export default JobPostingsContent;

