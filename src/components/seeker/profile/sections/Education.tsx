'use client';

import React, { useState, useEffect } from 'react';
import { GraduationCap, Pencil, Plus, Trash2 } from 'lucide-react';
import EditEducationModal, { EducationData } from '../modals/EditEducationModal';

// Map DB education record to UI EducationData
function dbToUi(row: any): EducationData & { dbId: string } {
    let t = row.type as any || 'Degree';
    if (t === 'Class 12') t = 'Class XII';
    if (t === 'Class 10') t = 'Class X';

    // Extract year from DB Date objects
    const endDate = row.endDate ? new Date(row.endDate) : null;
    const endYear = endDate ? String(endDate.getFullYear()) : '';

    return {
        dbId: row.id,
        type: t,
        board: row.board || '',
        medium: row.medium || '',
        percentage: row.percentage || '',
        endingYear: endYear,
        passingYear: endYear,
        isPursuing: row.isPursuing || false,
        degree: row.degree || '',
        stream: row.stream || '',
        institute: row.institute || '',
    };
}

const Education = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [educationList, setEducationList] = useState<(EducationData & { dbId?: string })[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const loadData = () => {
        fetch('/api/profile/education')
            .then(res => res.json())
            .then(json => {
                if (Array.isArray(json)) {
                    setEducationList(json.map(dbToUi));
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadData(); }, []);

    const handleSave = async (data: EducationData) => {
        const editingItem = editingIndex !== null ? educationList[editingIndex] : null;
        const dbId = (editingItem as any)?.dbId;

        if (dbId) {
            // Update existing
            const res = await fetch('/api/profile/education', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: dbId, ...data }),
            });
            const updated = await res.json();
            const newList = [...educationList];
            newList[editingIndex!] = dbToUi(updated);
            setEducationList(newList);
        } else {
            // Insert new
            const res = await fetch('/api/profile/education', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const inserted = await res.json();
            setEducationList(prev => [...prev, dbToUi(inserted)]);
        }

        setIsModalOpen(false);
        setEditingIndex(null);
    };

    const handleDelete = async (index: number) => {
        const item = educationList[index] as any;
        if (item?.dbId) {
            await fetch(`/api/profile/education?id=${item.dbId}`, { method: 'DELETE' });
        }
        setEducationList(educationList.filter((_, i) => i !== index));
    };

    const openAddModal = () => { setEditingIndex(null); setIsModalOpen(true); };
    const openEditModal = (index: number) => { setEditingIndex(index); setIsModalOpen(true); };

    return (
        <div id="education" className="bg-white rounded-2xl p-6 shadow-sm scroll-mt-28">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="text-emerald-700"><GraduationCap /></div>
                    <h2 className="text-lg font-bold text-gray-900">Education</h2>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {[1, 2].map(i => (
                        <div key={i} className="pl-4 border-l-2 border-gray-200">
                            <div className="h-4 bg-gray-200 rounded w-40 mb-2" />
                            <div className="h-3 bg-gray-100 rounded w-56" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {educationList.map((edu, index) => (
                        <div key={index} className="relative pl-4 border-l-2 border-emerald-500 pb-2">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-100 border-2 border-emerald-500" />
                            <div className="flex justify-between items-start group">
                                <div className="min-w-0 flex-1 pr-2">
                                    <h3 className="text-sm font-bold text-gray-900">
                                        {edu.type === 'Degree' && edu.degree ? edu.degree : edu.type || 'Education'}
                                    </h3>
                                    <p className="text-xs font-medium text-gray-600">
                                        {edu.type === 'Degree'
                                            ? `${edu.institute} ${edu.stream ? `(${edu.stream})` : ''}`
                                            : `${edu.institute ? `${edu.institute}, ` : ''}${edu.board} (${edu.medium})`
                                        }
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded">
                                        {edu.isPursuing ? 'Present' : edu.endingYear}
                                    </span>
                                    <button
                                        onClick={() => openEditModal(index)}
                                        className="text-gray-400 hover:text-emerald-600 p-1 opacity-0 group-hover:opacity-100 transition-all"
                                        title="Edit"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            {edu.percentage && (
                                <p className="text-xs text-gray-500 mt-1">Percentage: <span className="text-emerald-700 font-bold">{edu.percentage}%</span></p>
                            )}
                        </div>
                    ))}

                    {!['Class X', 'Class XII', 'Degree'].every(type => educationList.some(edu => edu.type === type)) && (
                        <div
                            onClick={openAddModal}
                            className="border border-dashed border-gray-200 rounded-xl p-4 flex justify-between items-center group hover:border-emerald-200 transition-colors cursor-pointer active:scale-[0.99]"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 group-hover:border-emerald-400 group-hover:text-emerald-500 transition-colors">
                                    <Plus size={14} />
                                </div>
                                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Add Education</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <EditEducationModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingIndex(null); }}
                initialData={editingIndex !== null ? educationList[editingIndex] : undefined}
                onSave={handleSave}
            />
        </div>
    );
};

export default Education;
