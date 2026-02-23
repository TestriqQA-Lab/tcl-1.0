'use client';

import React, { useState } from 'react';
import { Briefcase, GraduationCap, Pencil, Plus, Trash2 } from 'lucide-react';
import SectionContainer from '../SectionContainer';
import EmptyState from '../EmptyState';
import EditInternshipModal, { InternshipData } from '../modals/EditInternshipModal';

const Internships = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [internships, setInternships] = useState<InternshipData[]>([
        {
            companyName: 'StartupHub Inc.',
            role: 'Web Development Intern',
            startMonth: 'May',
            startYear: '2023',
            endMonth: 'Aug',
            endYear: '2023',
            description: 'Assisted in building the frontend using React.js and Tailwind CSS.',
            keySkills: 'React, Tailwind CSS',
            projectUrl: '',
            isCurrent: false
        }
    ]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const handleSave = (data: InternshipData) => {
        if (editingIndex !== null) {
            const newList = [...internships];
            newList[editingIndex] = data;
            setInternships(newList);
        } else {
            setInternships([...internships, data]);
        }
        setIsModalOpen(false);
        setEditingIndex(null);
    };

    const handleDelete = (index: number) => {
        setInternships(internships.filter((_, i) => i !== index));
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
        <SectionContainer id="internships" title="Internships" icon={<Briefcase />} onAdd={internships.length > 0 ? openAddModal : undefined}>
            {internships.length === 0 ? (
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
                            <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                            <div className="flex justify-between items-start group">
                                <div className="min-w-0 flex-1 pr-2">
                                    <h3 className="text-sm font-bold text-gray-900 truncate">{internship.role}</h3>
                                    <p className="text-xs font-medium text-gray-600 truncate">{internship.companyName}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-gray-400">
                                        {internship.startMonth} {internship.startYear} - {internship.isCurrent ? 'Present' : `${internship.endMonth} ${internship.endYear}`}
                                    </span>
                                    <button
                                        onClick={() => openEditModal(index)}
                                        className="text-gray-400 hover:text-emerald-600 p-1 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                                {internship.description}
                            </p>
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
                onClose={() => setIsModalOpen(false)}
                initialData={editingIndex !== null ? internships[editingIndex] : undefined}
                onSave={handleSave}
            />
        </SectionContainer>
    );
};

export default Internships;
