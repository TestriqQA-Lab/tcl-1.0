'use client';

import React, { useState } from 'react';
import { ClipboardList, Plus, Pencil, Trash2 } from 'lucide-react';
import SectionContainer from '../SectionContainer';
import EditCompetitiveExamModal, { CompetitiveExamData } from '../modals/EditCompetitiveExamModal';

const CompetitiveExams = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [exams, setExams] = useState<CompetitiveExamData[]>([]);

    const handleSave = (data: CompetitiveExamData) => {
        if (editingIndex !== null) {
            const newExams = [...exams];
            newExams[editingIndex] = data;
            setExams(newExams);
        } else {
            setExams([...exams, data]);
        }
        setIsModalOpen(false);
        setEditingIndex(null);
    };

    const handleDelete = (index: number) => {
        setExams(exams.filter((_, i) => i !== index));
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
        <SectionContainer id="competitive-exams" title="Competitive Exams" icon={<ClipboardList />} onAdd={exams.length > 0 ? openAddModal : undefined}>
            {exams.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in">
                    <p className="text-xs text-gray-400 mb-4">Scores for GATE, GMAT, CAT, GRE, etc.</p>
                    <button
                        onClick={openAddModal}
                        className="text-[#117a7a] font-bold text-sm flex items-center gap-1 hover:underline"
                    >
                        <Plus size={16} /> Add Score
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
                    {exams.map((exam, index) => (
                        <div key={exam.id} className="border border-gray-100 rounded-xl p-4 flex justify-between items-center bg-white hover:border-emerald-100 transition-colors group">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">{exam.examName}</p>
                                {/* Placeholder for score display if implementing score addition later */}
                                <p className="text-lg font-bold text-gray-900">-<span className="text-xs font-normal text-gray-400">/--</span></p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => openEditModal(index)}
                                    className="text-gray-400 hover:text-emerald-600 transition-colors"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(index)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <EditCompetitiveExamModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={editingIndex !== null ? exams[editingIndex] : undefined}
                onSave={handleSave}
            />
        </SectionContainer>
    );
};

export default CompetitiveExams;
