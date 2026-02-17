'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

interface EditLanguagesModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: LanguageData[];
    onSave?: (data: LanguageData[]) => void;
}

export interface LanguageData {
    name: string;
    proficiency: 'Speak' | 'Read/Write' | 'Both';
}

const EditLanguagesModal: React.FC<EditLanguagesModalProps> = ({
    isOpen,
    onClose,
    initialData = [{ name: 'English', proficiency: 'Read/Write' }],
    onSave
}) => {
    const [animateIn, setAnimateIn] = useState(false);
    const [languages, setLanguages] = useState<LanguageData[]>(initialData);
    const [inputValue, setInputValue] = useState('');
    const [activeLangIndex, setActiveLangIndex] = useState<number>(0);

    useEffect(() => {
        if (isOpen) {
            setAnimateIn(true);
            setLanguages(initialData.length > 0 ? initialData : [{ name: 'English', proficiency: 'Read/Write' }]);
            setActiveLangIndex(0);
        } else {
            setAnimateIn(false);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleAddLanguage = (name: string) => {
        if (name.trim() && !languages.some(l => l.name.toLowerCase() === name.toLowerCase())) {
            setLanguages([...languages, { name: name.trim(), proficiency: 'Speak' }]);
            setInputValue('');
            setActiveLangIndex(languages.length); // Switch to newly added
        }
    };

    const handleRemoveLanguage = (index: number) => {
        const newLangs = languages.filter((_, i) => i !== index);
        setLanguages(newLangs);
        if (activeLangIndex >= newLangs.length) setActiveLangIndex(Math.max(0, newLangs.length - 1));
    };

    const updateProficiency = (index: number, type: 'Speak' | 'Read/Write') => {
        const newLangs = [...languages];
        const current = newLangs[index].proficiency;

        // Simple toggle logic based on UI which seems to imply radio behavior or multi-select?
        // The UI shows "Comfortable in" with pills. Let's assume multi-select logic where 'Both' is possible?
        // Or simpler: The UI shows two distinct options. Let's make them toggleable.

        // Actually looking at the image, it seems like a toggle group. 
        // Let's implement as: Click 'Speak' -> toggles speak. Click 'Read/Write' -> toggles read/write.
        // If both selected -> 'Both'.

        let newProficiency = current;

        if (type === 'Speak') {
            if (current === 'Read/Write') newProficiency = 'Both';
            else if (current === 'Both') newProficiency = 'Read/Write';
            else if (current === 'Speak') return; // Can't unselect the only option? Or maybe can. Let's keep it simple.
            else newProficiency = 'Speak';
        } else {
            if (current === 'Speak') newProficiency = 'Both';
            else if (current === 'Both') newProficiency = 'Speak';
            else if (current === 'Read/Write') return;
            else newProficiency = 'Read/Write';
        }

        // Logic refined: The image shows just two buttons. 
        // Let's assume standard "select one" or "select multiple" behavior.
        // Let's stick to the image which looks like they can be active independently.

        // Re-reading image: "Comfortable in" -> "Speak" (gray), "Read/Write" (Showed green/selected).
        // It looks like you can select one or both.

        // Let's treat 'proficiency' as just a string for simplicity in display, but strictly logic wise:
        // We'll update the boolean state for the active language.

        // To simplify for this specific UI clone:
        // We will just update the current active language's proficiency.

        // Wait, the UI implies per-language settings?
        // "Language" input has "English x".
        // "Comfortable in" toggles apply to... the selected language in the input? 
        // Or is it a global setting for the added language?

        // User flow likely: 
        // 1. Add/Select language pill.
        // 2. Toggles below update that specific language.

        newLangs[index].proficiency = newProficiency as any; // simplified for now
        setLanguages(newLangs);
    };

    // Better logic for proficiency handling to match "Comfortable in" pill selector
    const toggleProficiency = (index: number, mode: 'Speak' | 'Read/Write') => {
        if (index < 0 || index >= languages.length) return;

        const lang = languages[index];
        const isSpeak = lang.proficiency.includes('Speak') || lang.proficiency === 'Both';
        const isRW = lang.proficiency.includes('Read') || lang.proficiency === 'Both';

        let next: 'Speak' | 'Read/Write' | 'Both' = lang.proficiency;

        if (mode === 'Speak') {
            if (isSpeak && isRW) next = 'Read/Write';
            else if (isSpeak) return; // Prevent unselecting the last one?
            else if (isRW) next = 'Both';
            else next = 'Speak';
        } else {
            if (isRW && isSpeak) next = 'Speak';
            else if (isRW) return;
            else if (isSpeak) next = 'Both';
            else next = 'Read/Write';
        }

        const newLangs = [...languages];
        newLangs[index].proficiency = next;
        setLanguages(newLangs);
    };

    const currentLang = languages[activeLangIndex];
    const isSpeakActive = currentLang && (currentLang.proficiency === 'Speak' || currentLang.proficiency === 'Both');
    const isRWActive = currentLang && (currentLang.proficiency === 'Read/Write' || currentLang.proficiency === 'Both');

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
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Languages known</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Strengthen your resume by letting recruiters know you can communicate in multiple languages
                    </p>
                </div>

                <div className="px-8 pb-8 space-y-6">
                    {/* Language Input */}
                    <div>
                        <div className="flex justify-between items-baseline mb-2">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                                Language
                            </label>
                            <span className="text-[10px] text-gray-400">You can add multiple languages</span>
                        </div>

                        <div className="border border-gray-200 rounded-xl p-2 min-h-[50px] flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all bg-white">
                            {languages.map((lang, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveLangIndex(idx)}
                                    className={`pl-3 pr-2 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors border ${activeLangIndex === idx
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100'
                                        }`}
                                >
                                    {lang.name}
                                    <span
                                        onClick={(e) => { e.stopPropagation(); handleRemoveLanguage(idx); }}
                                        className="hover:text-red-500 transition-colors"
                                    >
                                        <X size={14} />
                                    </span>
                                </button>
                            ))}
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddLanguage(inputValue);
                                }}
                                placeholder={languages.length === 0 ? "Search languages..." : ""}
                                className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-400 min-w-[100px] py-1 px-1"
                            />
                        </div>
                    </div>

                    {/* Comfortable In */}
                    {languages.length > 0 && (
                        <div className="animate-in fade-in">
                            <label className="block text-xs font-bold text-gray-700 mb-3">
                                Comfortable in
                            </label>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => toggleProficiency(activeLangIndex, 'Speak')}
                                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${isSpeakActive
                                            ? 'bg-[#117a7a] text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Speak
                                </button>
                                <button
                                    onClick={() => toggleProficiency(activeLangIndex, 'Read/Write')}
                                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${isRWActive
                                            ? 'bg-[#117a7a] text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Read/Write
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="pt-4 flex justify-end gap-4 items-center">
                        <button
                            onClick={onClose}
                            className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                if (onSave) onSave(languages);
                                onClose();
                            }}
                            className="bg-[#117a7a] hover:bg-[#0e6666] text-white text-sm font-bold py-2.5 px-8 rounded-lg transition-all shadow-lg shadow-emerald-900/10"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditLanguagesModal;
