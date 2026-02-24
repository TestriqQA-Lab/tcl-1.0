'use client';

import React, { useState, useEffect } from 'react';
import { X, Trophy } from 'lucide-react';

export interface AwardData {
    id: string;
    title: string;
    issuer: string;
    issueMonth: string;
    issueYear: string;
    description: string;
}

interface EditAwardModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: AwardData;
    onSave: (data: AwardData) => void;
}

const EditAwardModal: React.FC<EditAwardModalProps> = ({
    isOpen,
    onClose,
    initialData,
    onSave
}) => {
    const [animateIn, setAnimateIn] = useState(false);
    const [formData, setFormData] = useState<AwardData>({
        id: '',
        title: '',
        issuer: '',
        issueMonth: '',
        issueYear: '',
        description: ''
    });

    useEffect(() => {
        if (isOpen) {
            setAnimateIn(true);
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData({
                    id: Math.random().toString(36).substr(2, 9),
                    title: '',
                    issuer: '',
                    issueMonth: '',
                    issueYear: '',
                    description: ''
                });
            }
        } else {
            setAnimateIn(false);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (field: keyof AwardData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const MONTHS = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const YEARS = Array.from({ length: 50 }, (_, i) => (new Date().getFullYear() - i).toString());

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
                        <X size={20} />
                    </button>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Awards</h3>
                    <p className="text-sm text-[#117a7a] leading-relaxed">
                        Adding awards & accomplishments helps you stand out
                    </p>
                </div>

                <div className="px-8 pb-8 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Award Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="Ex: Employee of the Year"
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Issuer / Organization
                        </label>
                        <input
                            type="text"
                            value={formData.issuer}
                            onChange={(e) => handleChange('issuer', e.target.value)}
                            placeholder="Ex: Google"
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2">
                                Issue Month
                            </label>
                            <select
                                value={formData.issueMonth}
                                onChange={(e) => handleChange('issueMonth', e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
                            >
                                <option value="">Month</option>
                                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2">
                                Issue Year
                            </label>
                            <select
                                value={formData.issueYear}
                                onChange={(e) => handleChange('issueYear', e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
                            >
                                <option value="">Year</option>
                                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Description
                        </label>
                        <div className="relative">
                            <textarea
                                value={formData.description}
                                onChange={(e) => {
                                    if (e.target.value.length <= 1000) handleChange('description', e.target.value)
                                }}
                                placeholder="Mention your academic or extra-curricular achievements where you were recognised for your performance"
                                className="w-full p-4 h-32 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                            />
                            <div className="absolute bottom-3 right-3 text-[10px] text-gray-400">
                                {formData.description.length}/1000
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="pt-2 flex justify-end gap-3 items-center">
                        <button
                            onClick={onClose}
                            className="text-sm font-bold text-[#117a7a] hover:text-[#0e6666] transition-colors px-4"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
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

export default EditAwardModal;
