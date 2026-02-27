'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Pencil, Trash2 } from 'lucide-react';
import SectionContainer from '../SectionContainer';
import EditEmploymentModal, { EmploymentData } from '../modals/EditEmploymentModal';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

function dbToUi(row: any): EmploymentData & { dbId: string } {
    return {
        dbId: row.id,
        id: row.id,
        companyName: row.companyName || '',
        designation: row.designation || '',
        startMonth: row.startMonth || '',
        startYear: row.startYear || '',
        endMonth: row.endMonth || '',
        endYear: row.endYear || '',
        isCurrent: row.isCurrent || false,
        description: row.description || '',
    };
}

const Employment = () => {
    const [employments, setEmployments] = useState<(EmploymentData & { dbId?: string })[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/profile/experience')
            .then(res => res.json())
            .then(json => {
                if (Array.isArray(json)) {
                    // Employment = FULL_TIME or CONTRACT types
                    const filtered = json.filter((e: any) =>
                        e.employmentType === 'FULL_TIME' || e.employmentType === 'CONTRACT'
                    );
                    setEmployments(filtered.map(dbToUi));
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (data: EmploymentData) => {
        const editingItem = editingIndex !== null ? employments[editingIndex] : null;
        const dbId = (editingItem as any)?.dbId;

        if (dbId) {
            const res = await fetch('/api/profile/experience', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, id: dbId, employmentType: 'FULL_TIME' }),
            });
            const updated = await res.json();
            const newList = [...employments];
            newList[editingIndex!] = dbToUi(updated);
            setEmployments(newList);
        } else {
            const res = await fetch('/api/profile/experience', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, employmentType: 'FULL_TIME' }),
            });
            const inserted = await res.json();
            setEmployments(prev => [...prev, dbToUi(inserted)]);
        }
        closeModal();
    };

    const handleDelete = async (index: number) => {
        const item = employments[index] as any;
        if (item?.dbId) {
            await fetch(`/api/profile/experience?id=${item.dbId}`, { method: 'DELETE' });
        }
        setEmployments(employments.filter((_, i) => i !== index));
    };

    const openModal = (index: number | null = null) => { setEditingIndex(index); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setEditingIndex(null); };

    return (
        <SectionContainer id="employment" title="Employment" icon={<Briefcase />}>
            {loading ? (
                <div className="space-y-4 animate-pulse">
                    <div className="h-20 bg-gray-100 rounded-xl" />
                </div>
            ) : employments.length === 0 ? (
                <div
                    onClick={() => openModal()}
                    className="border border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group animate-in fade-in"
                >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <Briefcase className="text-[#117a7a]" size={24} />
                    </div>
                    <p className="text-sm font-bold text-gray-900 mb-1">Add Employment</p>
                    <p className="text-xs text-gray-500 text-center max-w-xs">
                        Add details about your full-time roles and work experience.
                    </p>
                </div>
            ) : (
                <div className="space-y-4 animate-in fade-in">
                    <div className="flex justify-end">
                        <button
                            onClick={() => openModal()}
                            className="text-xs font-bold text-[#117a7a] flex items-center gap-1 hover:underline"
                        >
                            <Plus size={14} /> Add Employment
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {employments.map((job, index) => (
                            <div key={job.id} className="border border-gray-100 rounded-xl p-4 bg-white hover:shadow-md transition-all group relative">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="min-w-0 flex-1 pr-2">
                                        <h4 className="font-bold text-gray-900 truncate">{job.designation}</h4>
                                        <p className="text-sm font-medium text-gray-600 truncate">{job.companyName}</p>
                                    </div>
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

                                <div className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 mb-3 bg-gray-50 px-2 py-1 rounded">
                                    <span>{job.startMonth} {job.startYear}</span>
                                    <span>-</span>
                                    {job.isCurrent ? (
                                        <span className="text-[#117a7a]">Present</span>
                                    ) : (
                                        <span>{job.endMonth} {job.endYear}</span>
                                    )}
                                </div>

                                {job.description && (
                                    <p className="text-sm text-gray-600 line-clamp-3">{job.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <EditEmploymentModal
                isOpen={isModalOpen}
                onClose={closeModal}
                initialData={editingIndex !== null ? employments[editingIndex] : undefined}
                onSave={handleSave}
            />
        </SectionContainer>
    );
};

export default Employment;
