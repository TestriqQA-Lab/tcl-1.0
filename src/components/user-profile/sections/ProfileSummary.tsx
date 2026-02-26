'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Plus } from 'lucide-react';
import SectionContainer from '../SectionContainer';
import EditProfileSummaryModal from '../modals/EditProfileSummaryModal';

const ProfileSummary = () => {
    const [summary, setSummary] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/profile')
            .then(res => res.json())
            .then(json => {
                if (!json.error && json.profile?.bio) {
                    setSummary(json.profile.bio);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (newSummary: string) => {
        setSummary(newSummary);
        setIsModalOpen(false);
        await fetch('/api/profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bio: newSummary }),
        });
    };

    return (
        <SectionContainer
            id="profile-summary"
            title="Profile Summary"
            icon={<FileText />}
            onEdit={summary ? () => setIsModalOpen(true) : undefined}
        >
            {loading ? (
                <div className="animate-pulse space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-4/5" />
                    <div className="h-3 bg-gray-200 rounded w-3/5" />
                </div>
            ) : !summary ? (
                <div className="bg-[#f8fcfc] rounded-xl p-8 text-center animate-in fade-in">
                    <p className="text-sm text-gray-500 italic mb-6">"A short summary makes it 70% more likely for recruiters to view your full profile."</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#117a7a] text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-[#0e6666] transition-colors shadow-sm inline-flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Write Summary
                    </button>
                </div>
            ) : (
                <p className="text-sm text-gray-600 leading-relaxed animate-in fade-in whitespace-pre-wrap">
                    {summary}
                </p>
            )}

            <EditProfileSummaryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={summary}
                onSave={handleSave}
            />
        </SectionContainer>
    );
};

export default ProfileSummary;
