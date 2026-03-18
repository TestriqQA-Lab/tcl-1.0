'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, GraduationCap, Pencil, Plus, Trash2 } from 'lucide-react';
import SectionContainer from '../SectionContainer';
import EmptyState from '../EmptyState';
import EditInternshipModal, { InternshipData } from '../modals/EditInternshipModal';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

function dbToUi(row: any): InternshipData & { dbId: string } {
    const startDate = row.startDate ? new Date(row.startDate) : null;
    const endDate = row.endDate ? new Date(row.endDate) : null;

    return {
        dbId: row.id,
        companyName: row.companyName || '',
        role: row.designation || '',
        startMonth: startDate ? MONTH_NAMES[startDate.getMonth()] : '',
        startYear: startDate ? String(startDate.getFullYear()) : '',
        endMonth: endDate ? MONTH_NAMES[endDate.getMonth()] : '',
        endYear: endDate ? String(endDate.getFullYear()) : '',
        isCurrent: row.isCurrent || false,
        description: row.description || '',
        keySkills: row.keySkills || '',
        projectUrl: row.projectUrl || '',
    };
}

const Internships = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [internships, setInternships] = useState<(InternshipData & { dbId?: string })[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/profile/experience')
            .then(res => res.json())
            .then(json => {
                if (Array.isArray(json)) {
                    const filtered = json.filter((e: any) => e.employmentType === 'INTERNSHIP');
                    setInternships(filtered.map(dbToUi));
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (data: InternshipData) => {
        const editingItem = editingIndex !== null ? internships[editingIndex] : null;
        const dbId = (editingItem as any)?.dbId;

        if (dbId) {
            const res = await fetch('/api/profile/experience', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: dbId, ...data, employmentType: 'INTERNSHIP' }),
            });
            const updated = await res.json();
            const newList = [...internships];
            newList[editingIndex!] = dbToUi(updated);
            setInternships(newList);
        } else {
            const res = await fetch('/api/profile/experience', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, employmentType: 'INTERNSHIP' }),
            });
            const inserted = await res.json();
            setInternships(prev => [...prev, dbToUi(inserted)]);
        }
        setIsModalOpen(false);
        setEditingIndex(null);
    };

    const handleDelete = async (index: number) => {
        const item = internships[index] as any;
        if (item?.dbId) {
            await fetch(`/api/profile/experience?id=${item.dbId}`, { method: 'DELETE' });
        }
        setInternships(internships.filter((_, i) => i !== index));
    };

    const openAddModal = () => { setEditingIndex(null); setIsModalOpen(true); };
    const openEditModal = (index: number) => { setEditingIndex(index); setIsModalOpen(true); };

    return (
        <SectionContainer id="internships" title="Internships" icon={<Briefcase />} onAdd={internships.length > 0 ? openAddModal : undefined}>
            {loading ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-16 bg-gray-100 rounded-xl" />
                </div>
            ) : internships.length === 0 ? (
                <EmptyState
                    icon={<GraduationCap size={32} />}
                    title=""
                    description="Add internships to boost your profile strength."
                    actionText="Add Internship"
                    onAction={openAddModal}
                />
            ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    {internships.map((internship, index) => (
                        <div key={index} className="relative pl-4 border-l-2 border-emerald-500 pb-4">
                            <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="text-sm font-bold text-gray-900 break-words">{internship.role}</h3>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                onClick={() => openEditModal(index)}
                                                className="text-gray-400 hover:text-emerald-600 p-1 transition-all"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(index)}
                                                className="text-gray-400 hover:text-red-500 p-1 transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs font-medium text-gray-600 break-words">{internship.companyName}</p>
                                    <span className="text-[10px] text-gray-400 mt-0.5 block">
                                        {internship.startMonth} {internship.startYear} - {internship.isCurrent ? 'Present' : `${internship.endMonth} ${internship.endYear}`}
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{internship.description}</p>
                            {internship.keySkills && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {internship.keySkills.split(',').map((skill, i) => (
                                        <span key={i} className="text-[10px] bg-gray-50 border border-gray-100 px-2 py-0.5 rounded text-gray-600">
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <EditInternshipModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingIndex(null); }}
                initialData={editingIndex !== null ? internships[editingIndex] : undefined}
                onSave={handleSave}
            />
        </SectionContainer>
    );
};

export default Internships;
