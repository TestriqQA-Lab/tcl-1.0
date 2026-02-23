'use client';

import React, { useState } from 'react';
import { Briefcase, Plus, Pencil, Trash2 } from 'lucide-react';
import SectionContainer from '../SectionContainer';
import EditEmploymentModal, { EmploymentData } from '../modals/EditEmploymentModal';

const Employment = () => {
    const [employments, setEmployments] = useState<EmploymentData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const handleSave = (data: EmploymentData) => {
        if (editingIndex !== null) {
            const newEmployments = [...employments];
            newEmployments[editingIndex] = data;
            setEmployments(newEmployments);
        } else {
            setEmployments([...employments, data]);
        }
        closeModal();
    };

    const handleDelete = (index: number) => {
        const newEmployments = employments.filter((_, i) => i !== index);
        setEmployments(newEmployments);
    };

    const openModal = (index: number | null = null) => {
        setEditingIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingIndex(null);
    };

    return (
        <SectionContainer id="employment" title="Employment" icon={<Briefcase />}>
            {employments.length === 0 ? (
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
                                    <p className="text-sm text-gray-600 line-clamp-3">
                                        {job.description}
                                    </p>
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
