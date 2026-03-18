'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';

export interface ClubData {
    id: string;
    clubName: string;
    position: string;
    educationId?: string;
    startMonth: string;
    startYear: string;
    endMonth: string;
    endYear: string;
    isCurrent: boolean;
    description: string;
}

interface EditClubModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: ClubData;
    onSave: (data: ClubData) => void;
}

const EditClubModal: React.FC<EditClubModalProps> = ({
    isOpen,
    onClose,
    initialData,
    onSave
}) => {
    const [animateIn, setAnimateIn] = useState(false);
    const [formData, setFormData] = useState<ClubData>({
        id: '',
        clubName: '',
        position: '',
        educationId: '',
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
        isCurrent: false,
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
                    clubName: '',
                    position: '',
                    educationId: '',
                    startMonth: '',
                    startYear: '',
                    endMonth: '',
                    endYear: '',
                    isCurrent: false,
                    description: ''
                });
            }
        } else {
            setAnimateIn(false);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (field: keyof ClubData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const years = Array.from({ length: 50 }, (_, i) => (new Date().getFullYear() + 1 - i).toString());

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
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Club & committees</h3>
                    <p className="text-sm text-[#117a7a] leading-relaxed">
                        Showcase your leadership skills by adding positions of responsibility you have held
                    </p>
                </div>

                <div className="px-8 pb-8 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    {/* Club Name */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Club or committee name
                        </label>
                        <input
                            type="text"
                            value={formData.clubName}
                            onChange={(e) => handleChange('clubName', e.target.value)}
                            placeholder="e.g., E-Cell"
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400"
                        />
                    </div>

                    {/* Designation */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Designation/Position
                        </label>
                        <input
                            type="text"
                            value={formData.position}
                            onChange={(e) => handleChange('position', e.target.value)}
                            placeholder="e.g., President"
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400"
                        />
                    </div>

                    {/* Associate with education */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Associate with education (optional)
                        </label>
                        <div className="relative">
                            <select
                                value={formData.educationId}
                                onChange={(e) => handleChange('educationId', e.target.value)}
                                className="w-full p-3 pr-10 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white placeholder:text-gray-400"
                            >
                                <option value="">Select educational background</option>
                                {/* In a real app, map through user's education here */}
                                <option value="1">B.Tech - IIT Bombay</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Duration
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Start Date */}
                            <div className="flex gap-2">
                                <span className="sr-only">Start Date</span>
                                <div className="relative flex-1">
                                    <select
                                        value={formData.startMonth}
                                        onChange={(e) => handleChange('startMonth', e.target.value)}
                                        className="w-full p-2.5 pr-8 border border-gray-200 rounded-lg text-sm text-gray-900 appearance-none focus:outline-none focus:border-emerald-500 bg-white"
                                    >
                                        <option value="">Month</option>
                                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                </div>
                                <div className="relative flex-1">
                                    <select
                                        value={formData.startYear}
                                        onChange={(e) => handleChange('startYear', e.target.value)}
                                        className="w-full p-2.5 pr-8 border border-gray-200 rounded-lg text-sm text-gray-900 appearance-none focus:outline-none focus:border-emerald-500 bg-white"
                                    >
                                        <option value="">Year</option>
                                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                </div>
                            </div>

                            {/* End Date */}
                            <div className="flex gap-2">
                                <span className="sr-only">End Date</span>
                                <div className="relative flex-1">
                                    <select
                                        value={formData.endMonth}
                                        onChange={(e) => handleChange('endMonth', e.target.value)}
                                        disabled={formData.isCurrent}
                                        className={`w-full p-2.5 pr-8 border border-gray-200 rounded-lg text-sm text-gray-900 appearance-none focus:outline-none focus:border-emerald-500 transition-all ${formData.isCurrent ? 'bg-gray-50 text-gray-400' : 'bg-white'}`}
                                    >
                                        <option value="">{formData.isCurrent ? 'Present' : 'Month'}</option>
                                        {!formData.isCurrent && months.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                </div>
                                <div className="relative flex-1">
                                    <select
                                        value={formData.endYear}
                                        onChange={(e) => handleChange('endYear', e.target.value)}
                                        disabled={formData.isCurrent}
                                        className={`w-full p-2.5 pr-8 border border-gray-200 rounded-lg text-sm text-gray-900 appearance-none focus:outline-none focus:border-emerald-500 transition-all ${formData.isCurrent ? 'bg-gray-50 text-gray-400' : 'bg-white'}`}
                                    >
                                        <option value="">{formData.isCurrent ? 'Present' : 'Year'}</option>
                                        {!formData.isCurrent && years.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Currently Working Checkbox */}
                    <div className="flex items-center gap-2 mt-1">
                        <input
                            type="checkbox"
                            id="currentRole"
                            checked={formData.isCurrent}
                            onChange={(e) => handleChange('isCurrent', e.target.checked)}
                            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        />
                        <label htmlFor="currentRole" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                            I am currently working in this role
                        </label>
                    </div>

                    {/* Description */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-bold text-gray-700">
                                Description
                            </label>
                            <span className="text-[10px] text-gray-400">{formData.description.length}/1000</span>
                        </div>
                        <textarea
                            value={formData.description}
                            onChange={(e) => {
                                if (e.target.value.length <= 1000) {
                                    handleChange('description', e.target.value);
                                }
                            }}
                            placeholder="Describe your responsibilities and achievements..."
                            rows={4}
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400 resize-none"
                        />
                    </div>

                    {/* Media (Placeholder) */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Media (optional)
                        </label>
                        <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center text-gray-400 text-sm">
                            Media upload placeholder
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
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditClubModal;
