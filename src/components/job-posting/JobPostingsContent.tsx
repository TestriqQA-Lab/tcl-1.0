'use client';

import React, { useState } from 'react';
import JobPostingsHeader from './JobPostingsHeader';
import StatusFilterStrip, { TabType } from './StatusFilterStrip';
import JobPostsList from './JobPostsList';

const JobPostingsContent = () => {
    const [activeTab, setActiveTab] = useState<TabType>('active');

    return (
        <div className="flex flex-col w-full min-h-full bg-[#F8FAFB] p-4 md:p-6 lg:p-8 gap-5 md:gap-7">
            <JobPostingsHeader />
            <StatusFilterStrip activeTab={activeTab} onTabChange={setActiveTab} />
            <JobPostsList selectedStatus={activeTab} />
        </div>
    );
};

export default JobPostingsContent;
