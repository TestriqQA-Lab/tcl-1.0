'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import SectionContainer from '../SectionContainer';
import EditPreferencesModal from '../modals/EditPreferencesModal';

interface Preferences {
    jobTypes: string[];
    locations: string[];
    availability: string;
    position: string;
}

// Map DB lookingFor enum to UI job types
function mapLookingFor(val: string | null): string[] {
    if (!val) return [];
    if (val === 'BOTH') return ['Jobs', 'Internships'];
    if (val === 'JOB') return ['Jobs'];
    if (val === 'INTERNSHIP') return ['Internships'];
    return [];
}

// Map UI job types back to DB lookingFor enum
function mapJobTypes(types: string[]): 'JOB' | 'INTERNSHIP' | 'BOTH' {
    const hasJob = types.includes('Jobs');
    const hasIntern = types.includes('Internships');
    if (hasJob && hasIntern) return 'BOTH';
    if (hasIntern) return 'INTERNSHIP';
    return 'JOB';
}

// Map DB noticePeriod enum to UI availability string
function mapNoticePeriod(val: string | null): string {
    const map: Record<string, string> = {
        IMMEDIATE: '15 Days or less',
        '15_DAYS': '15 Days or less',
        '30_DAYS': '1 Month',
        '60_DAYS': '2 Months',
        '90_DAYS': '3 Months',
    };
    return val ? (map[val] || '15 Days or less') : '15 Days or less';
}

// Map UI availability back to DB noticePeriod enum
function mapAvailability(val: string): 'IMMEDIATE' | '15_DAYS' | '30_DAYS' | '60_DAYS' | '90_DAYS' {
    const map: Record<string, 'IMMEDIATE' | '15_DAYS' | '30_DAYS' | '60_DAYS' | '90_DAYS'> = {
        '15 Days or less': '15_DAYS',
        '1 Month': '30_DAYS',
        '2 Months': '60_DAYS',
        '3 Months': '90_DAYS',
        'More than 3 Months': '90_DAYS',
        'Serving Notice Period': '90_DAYS',
    };
    return map[val] || '15_DAYS';
}

const CareerPreferences = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [preferences, setPreferences] = useState<Preferences>({
        jobTypes: [],
        locations: [],
        availability: '15 Days or less',
        position: '',
    });

    useEffect(() => {
        fetch('/api/profile')
            .then(res => res.json())
            .then(json => {
                if (!json.error && json.profile) {
                    setPreferences({
                        jobTypes: mapLookingFor(json.profile.lookingFor),
                        locations: json.profile.preferredWorkLocation || [],
                        availability: mapNoticePeriod(json.profile.noticePeriod),
                        position: json.profile.position || '',
                    });
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (data: { jobTypes: string[]; availability: string; locations: string[]; position: string }) => {
        setPreferences(data);
        await fetch('/api/profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                lookingFor: mapJobTypes(data.jobTypes),
                noticePeriod: mapAvailability(data.availability),
                preferredWorkLocation: data.locations,
                position: data.position.trim() || null,
            }),
        });

        // Dispatch event so ProfileHeader can refetch and update position UI
        window.dispatchEvent(new Event('profile-updated'));
    };

    return (
        <>
            <SectionContainer
                id="preferences"
                title="Career preferences"
                icon={<Briefcase />}
                onEdit={() => setIsModalOpen(true)}
            >
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i}>
                                <div className="h-3 bg-gray-200 rounded w-16 mb-2" />
                                <div className="h-4 bg-gray-100 rounded w-24" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Position</p>
                            <p className="text-sm font-medium text-gray-900">
                                {preferences.position || '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Job Type</p>
                            <p className="text-sm font-medium text-gray-900">
                                {preferences.jobTypes.length > 0 ? preferences.jobTypes.join(', ') : '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</p>
                            <p className="text-sm font-medium text-gray-900">
                                {preferences.locations.length > 0 ? preferences.locations.join(', ') : '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Availability</p>
                            <p className="text-sm font-medium text-gray-900">{preferences.availability || '—'}</p>
                        </div>
                    </div>
                )}
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
