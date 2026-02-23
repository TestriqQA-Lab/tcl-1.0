'use client';

import React, { useState } from 'react';
import { GraduationCap, Pencil, Plus, Trash2 } from 'lucide-react';
import EditEducationModal, { EducationData } from '../modals/EditEducationModal';

const Education = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [educationList, setEducationList] = useState<EducationData[]>([
        {
            type: 'Class X',
            board: 'Maharashtra',
            medium: 'English',
            percentage: '77',
            endingYear: '2022',
            isPursuing: false
        }
    ]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const handleSave = (data: EducationData) => {
        if (editingIndex !== null) {
            // Edit existing
            const newList = [...educationList];
            newList[editingIndex] = data;
            setEducationList(newList);
        } else {
            // Add new
            setEducationList([...educationList, data]);
        }
        setIsModalOpen(false);
        setEditingIndex(null);
    };

    const handleDelete = (index: number) => {
        setEducationList(educationList.filter((_, i) => i !== index));
    };

    const openAddModal = () => {
        setEditingIndex(null);
        setIsModalOpen(true);
    };

    const openEditModal = (index: number) => {
        setEditingIndex(index);
        setIsModalOpen(true);
    };

    return (
        <div id="education" className="bg-white rounded-2xl p-6 shadow-sm scroll-mt-28">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="text-emerald-700"><GraduationCap /></div>
                    <h2 className="text-lg font-bold text-gray-900">Education</h2>
                </div>
            </div>

            <div className="space-y-4">
                {educationList.map((edu, index) => (
                    <div key={index} className="relative pl-4 border-l-2 border-emerald-500 pb-2">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-100 border-2 border-emerald-500"></div>
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
                        <p className="text-xs text-gray-500 mt-1">Percentage: <span className="text-emerald-700 font-bold">{edu.percentage}%</span></p>
                    </div>
                ))}

                {/* Quick Add Buttons */}
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

            <EditEducationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={editingIndex !== null ? educationList[editingIndex] : undefined}
                onSave={handleSave}
            />
        </div>
    );
};

export default Education;
