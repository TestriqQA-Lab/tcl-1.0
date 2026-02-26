'use client';

import React, { useState, useEffect } from 'react';
import { Globe, Plus } from 'lucide-react';
import SectionContainer from '../SectionContainer';
import EmptyState from '../EmptyState';
import EditLanguagesModal, { LanguageData } from '../modals/EditLanguagesModal';

// Map DB language record to UI LanguageData
function dbToUi(lang: { languageName: string; speak: string; read: string; write: string }): LanguageData {
    const hasSpeak = lang.speak === 'INTERMEDIATE' || lang.speak === 'ADVANCED';
    const hasRW = lang.read === 'INTERMEDIATE' || lang.read === 'ADVANCED';
    let proficiency: 'Speak' | 'Read/Write' | 'Both' = 'Speak';
    if (hasSpeak && hasRW) proficiency = 'Both';
    else if (hasRW) proficiency = 'Read/Write';
    return { name: lang.languageName, proficiency };
}

const Languages = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [languages, setLanguages] = useState<LanguageData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/profile/languages')
            .then(res => res.json())
            .then(json => {
                if (Array.isArray(json)) {
                    setLanguages(json.map(dbToUi));
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (data: LanguageData[]) => {
        setLanguages(data);
        await fetch('/api/profile/languages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ languages: data }),
        });
    };

    const hasData = languages.length > 0;

    return (
        <>
            <SectionContainer
                id="languages"
                title="Languages"
                icon={<Globe />}
                onAdd={hasData ? () => setIsModalOpen(true) : undefined}
                onEdit={hasData ? () => setIsModalOpen(true) : undefined}
            >
                {loading ? (
                    <div className="flex flex-wrap gap-3 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-9 bg-gray-200 rounded-full w-24" />
                        ))}
                    </div>
                ) : !hasData ? (
                    <EmptyState
                        icon={<Globe size={32} />}
                        title="No languages added"
                        description="Showcase your multilingual skills to global recruiters."
                        actionText="Add Language"
                        onAction={() => setIsModalOpen(true)}
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
