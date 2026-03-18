'use client';

import React, { useState, useEffect } from 'react';
import { X, Info, ChevronDown } from 'lucide-react';

export interface CompetitiveExamData {
    id: string;
    examName: string;
    score?: string;
    totalScore?: string;
    year?: string;
}

interface EditCompetitiveExamModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: CompetitiveExamData;
    onSave: (data: CompetitiveExamData) => void;
}

const EditCompetitiveExamModal: React.FC<EditCompetitiveExamModalProps> = ({
    isOpen,
    onClose,
    initialData,
    onSave
}) => {
    const [animateIn, setAnimateIn] = useState(false);
    const [formData, setFormData] = useState<CompetitiveExamData>({
        id: '',
        examName: '',
        score: '',
        totalScore: '',
        year: ''
    });
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setAnimateIn(true);
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData({
                    id: Math.random().toString(36).substr(2, 9),
                    examName: '',
                    score: '',
                    totalScore: '',
                    year: ''
                });
            }
            setTouched(false);
        } else {
            setAnimateIn(false);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSelectExam = (exam: string) => {
        setFormData(prev => ({ ...prev, examName: exam }));
        setTouched(true);
    };

    const handleSave = () => {
        if (!formData.examName) {
            return; // Don't save if no exam selected
        }
        // For now, since the mockup only shows selecting the exam type in the first step,
        // we'll save just the name. In a real app, this might lead to a second step for scores.
        // Based on "You can add scores and certificates in the next step..." in the image.
        // We will assume this modal just adds the exam entry to the list, and maybe score editing happens separately or this modal expands.
        // Given the instructions "clone exactly same to same", I will implement the modal as shown in the image.
        // The image shows a "Save" button.
        onSave(formData);
        onClose();
    };

    const quickSelections = ['TOEFL', 'GMAT', 'GRE', 'SAT', 'IELTS'];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300 min-h-[100dvh] w-screen top-0 left-0">
            <div className={`bg-white rounded-2xl w-full max-w-[500px] shadow-2xl transform transition-all duration-300 max-h-[90vh] flex flex-col ${animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                {/* Header */}
                <div className="p-8 pb-4 relative shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            {/* Graduation cap icon or similar */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Competitive exams</h3>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Add details of competitive exams you have taken to enhance your profile and increase visibility to top recruiters.
                    </p>
                </div>

                <div className="px-8 pb-8 space-y-6 overflow-y-auto">
                    {/* Exam Name */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Exam Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.examName}
                            onChange={(e) => { setFormData(prev => ({ ...prev, examName: e.target.value })); setTouched(true); }}
                            placeholder="Ex: TOEFL, GMAT, GRE, CAT, GATE..."
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400"
                        />
                    </div>

                    {/* Score & Total Score */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2">
                                Score
                            </label>
                            <input
                                type="text"
                                value={formData.score || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, score: e.target.value }))}
                                placeholder="Ex: 320"
                                className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2">
                                Total Score
                            </label>
                            <input
                                type="text"
                                value={formData.totalScore || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, totalScore: e.target.value }))}
                                placeholder="Ex: 340"
                                className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Year */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Year
                        </label>
                        <input
                            type="text"
                            value={formData.year || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                            placeholder="Ex: 2024"
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-8 pb-8 pt-2 flex justify-end gap-3 items-center shrink-0">
                    <button
                        onClick={onClose}
                        className="text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors px-4"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!formData.examName}
                        className={`text-white text-sm font-bold py-2.5 px-8 rounded-lg transition-all shadow-lg ${formData.examName
                            ? 'bg-[#117a7a] hover:bg-[#0e6666] shadow-emerald-900/10 cursor-pointer'
                            : 'bg-gray-300 shadow-none cursor-not-allowed'
                            }`}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCompetitiveExamModal;
