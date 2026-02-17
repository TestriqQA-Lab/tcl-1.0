'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface EditSkillsModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialSkills?: string[];
    onSave?: (skills: string[]) => void;
}

const EditSkillsModal: React.FC<EditSkillsModalProps> = ({
    isOpen,
    onClose,
    initialSkills = ["Fullstack Development", "React.js", "Next.js"],
    onSave
}) => {
    const [skills, setSkills] = useState<string[]>(initialSkills);
    const [inputValue, setInputValue] = useState('');
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setAnimateIn(true);
            setSkills(initialSkills);
        } else {
            setAnimateIn(false);
        }
    }, [isOpen, initialSkills]);

    if (!isOpen) return null;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            if (!skills.includes(inputValue.trim()) && skills.length < 15) {
                setSkills([...skills, inputValue.trim()]);
                setInputValue('');
            }
        } else if (e.key === 'Backspace' && !inputValue && skills.length > 0) {
            setSkills(skills.slice(0, -1));
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const addSkill = (skill: string) => {
        if (!skills.includes(skill)) {
            setSkills([...skills, skill]);
        }
    };

    const handleSave = () => {
        if (onSave) onSave(skills);
        onClose();
    };

    const suggestions = ["Nextjs", "Nextgen", "Next Education India", "Nexthink", "NextGen Healthcare"];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300">
            <div
                className={`bg-white rounded-2xl w-full max-w-lg shadow-2xl transform transition-all duration-300 ${animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 pb-2">
                    <h2 className="text-2xl font-bold text-gray-900">Key skills</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 pb-2">
                    <p className="text-sm text-gray-600 mb-6">
                        Recruiters look for candidates with specific keyskills. Add them here to appear in searches.
                    </p>

                    {/* Input Area */}
                    <div className="border border-emerald-200 rounded-2xl p-2 min-h-[120px] focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all bg-white relative">
                        <div className="flex flex-wrap gap-2">
                            {skills.map(skill => (
                                <span key={skill} className="bg-[#117a7a] text-white text-sm font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                    {skill}
                                    <button
                                        onClick={() => removeSkill(skill)}
                                        className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                                    >
                                        <X size={12} strokeWidth={3} />
                                    </button>
                                </span>
                            ))}
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={skills.length === 0 ? "Enter your key skills" : ""}
                                className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-400 bg-transparent min-w-[120px] py-1.5 px-1"
                                autoFocus
                            />
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 italic">Press Enter to add a skill</p>

                    {/* Suggestions */}
                    <div className="mt-6">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                            Based on your current selection
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map(suggestion => (
                                <button
                                    key={suggestion}
                                    onClick={() => addSkill(suggestion)}
                                    className="px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 text-gray-600 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 transition-all flex items-center gap-1 bg-white"
                                >
                                    {suggestion}
                                    <span className="text-emerald-600 font-bold">+</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 mt-2 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-[#117a7a] text-white text-sm font-bold px-8 py-2.5 rounded-lg hover:bg-[#0e6666] transition-colors shadow-sm shadow-emerald-900/10"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditSkillsModal;
