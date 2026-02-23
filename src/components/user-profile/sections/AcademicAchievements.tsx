'use client';

import React, { useState } from 'react';
import { GraduationCap, Trophy, Plus, Pencil, Trash2 } from 'lucide-react';
import SectionContainer from '../SectionContainer';
import EditAcademicAchievementsModal, { AcademicAchievementData } from '../modals/EditAcademicAchievementsModal';

const AcademicAchievements = () => {
    const [achievements, setAchievements] = useState<AcademicAchievementData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    // Mock education list - in a real app, this would come from a global store or context
    const educationList = [
        { id: '1', institution: 'IIT Bombay', degree: 'B.Tech' },
        { id: '2', institution: 'St. Xavier\'s', degree: 'Class XII' }
    ];

    const handleSave = (data: AcademicAchievementData) => {
        if (editingIndex !== null) {
            const newAchievements = [...achievements];
            newAchievements[editingIndex] = data;
            setAchievements(newAchievements);
        } else {
            setAchievements([...achievements, data]);
        }
        closeModal();
    };

    const handleDelete = (index: number) => {
        const newAchievements = achievements.filter((_, i) => i !== index);
        setAchievements(newAchievements);
    };

    const openModal = (index: number | null = null) => {
        setEditingIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingIndex(null);
    };

    const getEducationLabel = (id: string) => {
        const edu = educationList.find(e => e.id === id);
        return edu ? `${edu.degree} from ${edu.institution}` : 'Unknown Education';
    };

    return (
        <SectionContainer id="academic-achievements" title="Academic Achievements" icon={<GraduationCap />}>
            {achievements.length === 0 ? (
                <div
                    onClick={() => openModal()}
                    className="border border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group animate-in fade-in"
                >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <Trophy className="text-[#117a7a]" size={24} />
                    </div>
                    <p className="text-sm font-bold text-gray-900 mb-1">Add Academic Achievements</p>
                    <p className="text-xs text-gray-500 text-center max-w-xs">
                        Highlight your academic success and recognition.
                    </p>
                </div>
            ) : (
                <div className="space-y-4 animate-in fade-in">
                    <div className="flex justify-end">
                        <button
                            onClick={() => openModal()}
                            className="text-xs font-bold text-[#117a7a] flex items-center gap-1 hover:underline"
                        >
                            <Plus size={14} /> Add Achievement
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {achievements.map((achievement, index) => (
                            <div key={achievement.id} className="border border-gray-100 rounded-xl p-4 bg-white hover:shadow-md transition-all group relative">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-gray-900 text-sm">
                                        {getEducationLabel(achievement.educationId)}
                                    </h4>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openModal(index); }}
                                            className="p-1.5 text-gray-400 hover:text-[#117a7a] hover:bg-emerald-50 rounded-lg transition-colors"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(index); }}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-2">
                                    {achievement.achievements.map((item, i) => (
                                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-[#117a7a] border border-emerald-100">
                                            <Trophy size={10} />
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <EditAcademicAchievementsModal
                isOpen={isModalOpen}
                onClose={closeModal}
                initialData={editingIndex !== null ? achievements[editingIndex] : undefined}
                onSave={handleSave}
                educationList={educationList}
            />
        </SectionContainer>
    );
};

export default AcademicAchievements;
