'use client';

import React, { useState } from 'react';
import { Globe, Plus } from 'lucide-react';
import SectionContainer from '../SectionContainer';
import EmptyState from '../EmptyState';
import EditLanguagesModal, { LanguageData } from '../modals/EditLanguagesModal';

const XSize14 = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);

const Languages = () => {
    const [hasData, setHasData] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [languages, setLanguages] = useState<LanguageData[]>([
        { name: 'English', proficiency: 'Read/Write' },
        { name: 'Hindi', proficiency: 'Speak' },
        { name: 'Marathi', proficiency: 'Both' }
    ]);

    const handleSave = (data: LanguageData[]) => {
        setLanguages(data);
        if (data.length > 0) setHasData(true);
        else setHasData(false); // If all removed, maybe go back to empty state?
    };

    return (
        <>
            <SectionContainer
                id="languages"
                title="Languages"
                icon={<Globe />}
                onAdd={hasData ? () => setIsModalOpen(true) : undefined}
                onEdit={hasData ? () => setIsModalOpen(true) : undefined}
            >
                {!hasData ? (
                    <EmptyState
                        icon={<Globe size={32} />}
                        title="No languages added"
                        description="Showcase your multilingual skills to global recruiters."
                        actionText="Add Language"
                        onAction={() => {
                            setHasData(true);
                            setIsModalOpen(true);
                        }}
                    />
                ) : (
                    <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-2">
                        {languages.map((lang, idx) => (
                            <div key={idx} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 flex items-center gap-2 shadow-sm">
                                {lang.name}
                                <span className="text-[10px] text-gray-400 ml-1">
                                    ({lang.proficiency === 'Both' ? 'Fluent' : lang.proficiency})
                                </span>
                            </div>
                        ))}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-3 py-2 border border-dashed border-gray-300 rounded-full text-gray-400 hover:text-emerald-600 hover:border-emerald-300 transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                )}
            </SectionContainer>

            <EditLanguagesModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={languages}
                onSave={handleSave}
            />
        </>
    );
};

export default Languages;
