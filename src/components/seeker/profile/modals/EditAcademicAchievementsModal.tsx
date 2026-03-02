'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Check, Plus } from 'lucide-react';

export interface AcademicAchievementData {
    id: string;
    educationId: string; // Links to an education entry
    achievements: string[]; // List of selected chips
}

interface EditAcademicAchievementsModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: AcademicAchievementData;
    onSave: (data: AcademicAchievementData) => void;
    educationList: { id: string; institution: string; degree: string }[]; // Pass available education to link
}

const ACHIEVEMENT_OPTIONS = [
    'College topper',
    'Department topper',
    'Top 3 in class',
    'Top 10 in class',
    'Gold medalist',
    'Received scholarship',
    'All rounder',
    'Other'
];

const EditAcademicAchievementsModal: React.FC<EditAcademicAchievementsModalProps> = ({
    isOpen,
    onClose,
    initialData,
    onSave,
    educationList
}) => {
    const [animateIn, setAnimateIn] = useState(false);
    const [formData, setFormData] = useState<AcademicAchievementData>({
        id: '',
        educationId: '',
        achievements: []
    });

    useEffect(() => {
        if (isOpen) {
            setAnimateIn(true);
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData({
                    id: Math.random().toString(36).substr(2, 9),
                    educationId: educationList.length > 0 ? educationList[0].id : '',
                    achievements: []
                });
            }
        } else {
            setAnimateIn(false);
        }
    }, [isOpen, initialData, educationList]);

    if (!isOpen) return null;

    const handleEducationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, educationId: e.target.value }));
    };

    const toggleAchievement = (achievement: string) => {
        setFormData(prev => {
            const exists = prev.achievements.includes(achievement);
            if (exists) {
                return { ...prev, achievements: prev.achievements.filter(a => a !== achievement) };
            } else {
                return { ...prev, achievements: [...prev.achievements, achievement] };
            }
        });
    };

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300">
            <div className={`bg-white rounded-2xl w-full max-w-[500px] shadow-2xl transform transition-all duration-300 ${animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                {/* Header */}
                <div className="p-8 pb-4 relative">
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Academic achievements</h3>
                    <p className="text-sm text-gray-500">
                        Adding your achievements helps recruiters know your value as a potential candidate
                    </p>
                </div>

                <div className="px-8 pb-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {/* Education Dropdown */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Academic achievements
                        </label>
                        <div className="relative">
                            <select
                                value={formData.educationId}
                                onChange={handleEducationChange}
                                className="w-full p-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-[#117a7a] appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                            >
                                {educationList.length === 0 && <option value="">No education listed</option>}
                                {educationList.map(edu => (
                                    <option key={edu.id} value={edu.id}>During {edu.degree} {edu.institution}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
                        </div>
                    </div>

                    {/* Received During Chips */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                            Received during ...
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {ACHIEVEMENT_OPTIONS.map(option => {
                                const isSelected = formData.achievements.includes(option);
                                return (
                                    <button
                                        key={option}
                                        onClick={() => toggleAchievement(option)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all flex items-center gap-2 ${isSelected
                                            ? 'bg-emerald-50 border-[#117a7a] text-[#117a7a]'
                                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                    >
                                        {isSelected ? <Check size={14} /> : <Plus size={14} />}
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-[#f0f9f9] border border-[#e0f2f2] rounded-xl p-6 flex flex-col items-center justify-center text-center mt-4">
                        <div className="text-[#117a7a] mb-2">
                            {/* Placeholder for medal icon from image */}
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-1 mx-auto">
                                <span className="text-xl">🏆</span>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-[#117a7a] tracking-wider uppercase">ACADEMIC EXCELLENCE</span>
                    </div>

                </div>

                {/* Footer Buttons */}
                <div className="p-6 pt-2 flex justify-end gap-3 items-center border-t border-gray-50">
                    <button
                        onClick={onClose}
                        className="text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors px-4"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-[#117a7a] hover:bg-[#0e6666] text-white text-sm font-bold py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-emerald-900/10"
                    >
                        Save Achievements
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditAcademicAchievementsModal;
