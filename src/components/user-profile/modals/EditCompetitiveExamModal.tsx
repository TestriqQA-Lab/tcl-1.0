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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300">
            <div className={`bg-white rounded-2xl w-full max-w-[500px] shadow-2xl transform transition-all duration-300 ${animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                {/* Header */}
                <div className="p-8 pb-4 relative">
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

                <div className="px-8 pb-8 space-y-6">
                    {/* Exam Selector */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Competitive exam
                        </label>
                        <div className="relative">
                            <select
                                value={formData.examName}
                                onChange={(e) => handleSelectExam(e.target.value)}
                                className="w-full p-3 pr-10 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white placeholder:text-gray-400"
                            >
                                <option value="" disabled>Select Exam</option>
                                {quickSelections.map(exam => <option key={exam} value={exam}>{exam}</option>)}
                                <option value="CAT">CAT</option>
                                <option value="GATE">GATE</option>
                                <option value="Other">Other</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    {/* Quick Selections */}
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                            POPULAR SELECTIONS
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {quickSelections.map(exam => (
                                <button
                                    key={exam}
                                    onClick={() => handleSelectExam(exam)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${formData.examName === exam
                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {exam}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-[#f8fcfc] border border-[#e0f2f1] rounded-xl p-4 flex gap-3 items-start">
                        <div className="mt-0.5 text-[#117a7a]">
                            <Info size={16} className="fill-[#117a7a] text-white" />
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            You can add scores and certificates in the next step after selecting your exam type.
                        </p>
                    </div>

                    {/* Footer Buttons */}
                    <div className="pt-2 flex justify-end gap-3 items-center">
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
        </div>
    );
};

export default EditCompetitiveExamModal;
