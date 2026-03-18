'use client';

import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import SectionContainer from '../SectionContainer';
import EditBasicDetailsModal from '../modals/EditBasicDetailsModal';
import { calculateAge } from '@/lib/profileUtils';

interface BasicDetailsData {
    fullName: string;
    phoneNumber: string;
    gender: string;
    currentLocation: string;
    currentIndustry: string;
    noticePeriod: string;
    dateOfBirth: string | null;
}

function formatGender(val: string | null): string {
    if (!val) return '—';
    const map: Record<string, string> = {
        MALE: 'Male',
        FEMALE: 'Female',
        OTHER: 'Other',
        PREFER_NOT_TO_SAY: 'Prefer not to say',
    };
    return map[val] || val;
}

const BasicDetails = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState<BasicDetailsData>({
        fullName: '',
        phoneNumber: '',
        gender: '',
        currentLocation: '',
        currentIndustry: '',
        noticePeriod: '',
        dateOfBirth: null,
    });

    useEffect(() => {
        Promise.all([
            fetch('/api/profile').then(r => r.json()),
        ])
            .then(([profileJson]) => {
                if (!profileJson.error && profileJson.profile) {
                    setDetails({
                        fullName: profileJson.profile.fullName || '',
                        phoneNumber: profileJson.user?.phoneNumber || '',
                        gender: profileJson.profile.gender || '',
                        currentLocation: profileJson.profile.currentLocation || '',
                        currentIndustry: profileJson.profile.currentIndustry || '',
                        noticePeriod: profileJson.profile.noticePeriod || '',
                        dateOfBirth: profileJson.profile.dateOfBirth || null,
                    });
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (data: BasicDetailsData) => {
        setDetails(data);

        // Update profile fields (fullName, gender, currentLocation)
        await fetch('/api/profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: data.fullName,
                gender: data.gender || null,
                currentLocation: data.currentLocation || null,
                phoneNumber: data.phoneNumber || null,
                currentIndustry: data.currentIndustry || null,
                noticePeriod: data.noticePeriod || null,
                dateOfBirth: data.dateOfBirth || null,
            }),
        });

        // Notify ProfileHeader to re-fetch
        window.dispatchEvent(new Event('profile-updated'));
    };

    return (
        <>
            <SectionContainer
                id="basic-details"
                title="Basic Details"
                icon={<User />}
                onEdit={() => setIsModalOpen(true)}
            >
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-pulse">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i}>
                                <div className="h-3 bg-gray-200 rounded w-16 mb-2" />
                                <div className="h-4 bg-gray-100 rounded w-32" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                            <p className="text-sm font-medium text-gray-900">{details.fullName || '—'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number</p>
                            <p className="text-sm font-medium text-gray-900">{details.phoneNumber || '—'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Gender</p>
                            <p className="text-sm font-medium text-gray-900">{formatGender(details.gender)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date of Birth</p>
                            <p className="text-sm font-medium text-gray-900">
                                {details.dateOfBirth ? `${new Date(details.dateOfBirth).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} (${calculateAge(details.dateOfBirth)} yrs)` : '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</p>
                            <p className="text-sm font-medium text-gray-900">{details.currentLocation || '—'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Industry</p>
                            <p className="text-sm font-medium text-gray-900">{details.currentIndustry || '—'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Notice Period</p>
                            <p className="text-sm font-medium text-gray-900">{details.noticePeriod?.replace('_', ' ') || '—'}</p>
                        </div>
                    </div>
                )}
            </SectionContainer>

            <EditBasicDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={{
                    ...details,
                    dateOfBirth: details.dateOfBirth ?? undefined
                }}
                onSave={handleSave}
            />
        </>
    );
};

export default BasicDetails;
