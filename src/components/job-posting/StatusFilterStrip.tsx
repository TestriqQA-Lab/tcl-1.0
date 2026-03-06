'use client';

import React from 'react';

export type TabType = 'active' | 'paused' | 'closed';

interface StatusFilterStripProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

const StatusFilterStrip: React.FC<StatusFilterStripProps> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'active', label: 'Active Jobs', count: 4 },
        { id: 'paused', label: 'Paused', count: 2 },
        { id: 'closed', label: 'Closed', count: 2 },
    ];

    return (
        <div className="flex w-full border-b border-[#E2E8F0] overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id as TabType)}
                        className={`flex items-center gap-2 h-11 px-4 border-b-2 whitespace-nowrap transition-colors ${isActive
                            ? 'border-[#0f766d] text-[#0f766d]'
                            : 'border-transparent text-[#64748B] hover:text-[#0e1b1a]'
                            }`}
                    >
                        <span className={`font-inter text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                            {tab.label}
                        </span>
                        <div
                            className={`flex items-center justify-center px-2 py-0.5 rounded-full ${isActive ? 'bg-[#0f766d1a] text-[#0f766d]' : 'bg-[#F1F5F9] text-[#64748B]'
                                }`}
                        >
                            <span className="font-inter text-xs font-semibold">{tab.count}</span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default StatusFilterStrip;
