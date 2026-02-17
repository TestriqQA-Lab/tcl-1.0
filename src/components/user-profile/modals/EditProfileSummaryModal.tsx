'use client';

import React, { useState, useEffect } from 'react';
import { X, Lightbulb } from 'lucide-react';

interface EditProfileSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: string;
    onSave: (summary: string) => void;
}

const EditProfileSummaryModal: React.FC<EditProfileSummaryModalProps> = ({
    isOpen,
    onClose,
    initialData = '',
    onSave
}) => {
    const [animateIn, setAnimateIn] = useState(false);
    const [summary, setSummary] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setAnimateIn(true);
            setSummary(initialData);
            setError('');
        } else {
            setAnimateIn(false);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= 1000) {
            setSummary(value);
            if (value.length > 0 && value.length < 50) {
                // We don't show error immediately while typing typically, but the design implies validation.
                // Let's clear error if they are typing
                setError('');
            }
        }
    };

    const handleSave = () => {
        if (summary.trim().length < 50) {
            setError('Write a meaningful summary of more than 50 characters.');
            return;
        }
        onSave(summary);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300">
            <div className={`bg-white rounded-2xl w-full max-w-[600px] shadow-2xl transform transition-all duration-300 ${animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                {/* Header */}
                <div className="p-8 pb-4 relative">
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Profile summary</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Mention highlights of your career/education, professional interests, and what kind of role you are looking for. <span className={summary.length < 50 && summary.length > 0 ? "text-red-500" : "text-emerald-700"}>Write a meaningful summary of more than 50 characters.</span>
                    </p>
                </div>

                <div className="px-8 pb-8 space-y-6">
                    {/* Summary Text Area */}
                    <div className="relative">
                        <label className="block text-xs font-bold text-gray-700 mb-2">Summary</label>
                        <textarea
                            value={summary}
                            onChange={handleChange}
                            placeholder="Type here"
                            rows={8}
                            className={`w-full p-4 border rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400 resize-none ${error ? 'border-red-500 bg-red-50/50' : 'border-gray-200'}`}
                        />
                        <div className="absolute bottom-4 right-4 text-xs font-medium text-gray-400 bg-white/80 px-2 py-1 rounded">
                            {summary.length}/1000
                        </div>
                        {error && (
                            <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
                        )}
                    </div>

                    {/* Pro Tip */}
                    <div className="bg-[#f2fcf9] border border-[#e0f2f1] rounded-xl p-4 flex gap-3 items-start">
                        <div className="mt-0.5 text-[#117a7a]">
                            <Lightbulb size={20} className="fill-[#117a7a]" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-[#117a7a] mb-1">Pro Tip</p>
                            <p className="text-xs text-[#0e6666]">
                                Use action words and measurable outcomes to stand out to recruiters.
                            </p>
                        </div>
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
                            className="bg-[#117a7a] hover:bg-[#0e6666] text-white text-sm font-bold py-2.5 px-8 rounded-lg transition-all shadow-lg shadow-emerald-900/10"
                        >
                            Save Summary
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfileSummaryModal;
