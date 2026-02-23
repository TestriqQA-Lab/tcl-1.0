'use client';

import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';
import SectionContainer from '../SectionContainer'; // Assumes sibling directory structure
import EditPreferencesModal from '../modals/EditPreferencesModal';

const CareerPreferences = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [preferences, setPreferences] = useState({
        jobTypes: ['Jobs'],
        locations: ['Mumbai', 'Pune', 'Bangalore'],
        availability: '15 Days or less'
    });

    const handleSave = (data: { jobTypes: string[]; availability: string; locations: string[] }) => {
        setPreferences(data);
    };

    return (
        <>
            <SectionContainer
                id="preferences"
                title="Career preferences"
                icon={<Briefcase />}
                onEdit={() => setIsModalOpen(true)}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                            Job Type
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                            {preferences.jobTypes.join(', ')}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                            Location
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                            {preferences.locations.join(', ')}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                            Availability
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                            {preferences.availability}
                        </p>
                    </div>
                </div>
            </SectionContainer>

            <EditPreferencesModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={preferences}
                onSave={handleSave}
            />
        </>
    );
};

export default CareerPreferences;
