'use client';

import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, Pencil, Trash2 } from 'lucide-react';
import SectionContainer from '../SectionContainer';
import EditAcademicAchievementsModal, { AcademicAchievementData } from '../modals/EditAcademicAchievementsModal';

interface EducationOption { id: string; institution: string; degree: string; }

function dbToUi(row: any): AcademicAchievementData & { dbId: string } {
    return {
        dbId: row.id,
        id: row.id,
        educationId: row.organization || '',
        achievements: row.description ? row.description.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    };
}

const AcademicAchievements = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [achievementsList, setAchievementsList] = useState<(AcademicAchievementData & { dbId?: string })[]>([]);
    const [educationList, setEducationList] = useState<EducationOption[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/profile/achievements?type=ACADEMIC').then(r => r.json()),
            fetch('/api/profile/education').then(r => r.json()),
        ]).then(([achJson, eduJson]) => {
            if (Array.isArray(achJson)) setAchievementsList(achJson.map(dbToUi));
            if (Array.isArray(eduJson)) {
                setEducationList(eduJson.map((e: any) => ({
                    id: e.id,
                    institution: e.schoolName || '',
                    degree: e.degree || '',
                })));
            }
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleSave = async (data: AcademicAchievementData) => {
        const editingItem = editingIndex !== null ? achievementsList[editingIndex] : null;
        const dbId = (editingItem as any)?.dbId;

        const payload = {
            type: 'ACADEMIC',
            title: 'Academic Achievement',
            organization: data.educationId,
            description: data.achievements.join(', '),
        };

        if (dbId) {
            const res = await fetch('/api/profile/achievements', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: dbId, ...payload }),
            });
            const updated = await res.json();
            const newList = [...achievementsList];
            newList[editingIndex!] = dbToUi(updated);
            setAchievementsList(newList);
        } else {
            const res = await fetch('/api/profile/achievements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const inserted = await res.json();
            setAchievementsList(prev => [...prev, dbToUi(inserted)]);
        }
        setIsModalOpen(false);
        setEditingIndex(null);
    };

    const handleDelete = async (index: number) => {
        const item = achievementsList[index] as any;
        if (item?.dbId) {
            await fetch(`/api/profile/achievements?id=${item.dbId}`, { method: 'DELETE' });
        }
        setAchievementsList(achievementsList.filter((_, i) => i !== index));
    };

    const openAddModal = () => { setEditingIndex(null); setIsModalOpen(true); };
    const openEditModal = (index: number) => { setEditingIndex(index); setIsModalOpen(true); };

    function getEducationLabel(eduId: string): string {
        const edu = educationList.find(e => e.id === eduId);
        return edu ? `${edu.degree} at ${edu.institution}` : 'Education';
    }

    return (
        <SectionContainer id="academic-achievements" title="Academic Achievements" icon={<GraduationCap />} onAdd={achievementsList.length > 0 ? openAddModal : undefined}>
            {loading ? (
                <div className="animate-pulse h-16 bg-gray-100 rounded-xl" />
            ) : achievementsList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in">
                    <p className="text-sm text-gray-400 mb-4">
                        {educationList.length === 0
                            ? 'Add education first to link academic achievements.'
                            : 'Add academic achievements to highlight your academic excellence.'}
                    </p>
                    {educationList.length > 0 && (
                        <button
                            onClick={openAddModal}
                            className="text-[#117a7a] font-bold text-sm flex items-center gap-1 hover:underline"
                        >
                            <Plus size={16} /> Add Achievement
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-4 animate-in fade-in">
                    {achievementsList.map((ach, index) => (
                        <div key={(ach as any).dbId || index} className="border border-gray-100 rounded-xl p-4 bg-white hover:border-emerald-100 transition-colors group">
                            <div className="flex justify-between items-start mb-2">
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-[#117a7a]">{getEducationLabel(ach.educationId)}</p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEditModal(index)} className="text-gray-400 hover:text-emerald-600"><Pencil size={14} /></button>
                                    <button onClick={() => handleDelete(index)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {ach.achievements.map((tag, i) => (
                                    <span key={i} className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-medium text-emerald-700">
                                        🏆 {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <EditAcademicAchievementsModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingIndex(null); }}
                initialData={editingIndex !== null ? achievementsList[editingIndex] : undefined}
                onSave={handleSave}
                educationList={educationList}
            />
        </SectionContainer>
    );
};

export default AcademicAchievements;
