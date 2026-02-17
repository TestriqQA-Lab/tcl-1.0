'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';

export interface EmploymentData {
    id: string;
    companyName: string;
    designation: string;
    startMonth: string;
    startYear: string;
    endMonth: string;
    endYear: string;
    isCurrent: boolean;
    description: string;
}

interface EditEmploymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: EmploymentData;
    onSave: (data: EmploymentData) => void;
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const YEARS = Array.from({ length: 50 }, (_, i) => (new Date().getFullYear() - i).toString());

const EditEmploymentModal: React.FC<EditEmploymentModalProps> = ({
    isOpen,
    onClose,
    initialData,
    onSave
}) => {
    const [animateIn, setAnimateIn] = useState(false);
    const [formData, setFormData] = useState<EmploymentData>({
        id: '',
        companyName: '',
        designation: '',
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
                    companyName: '',
                    designation: '',
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'description' && value.length > 4000) return;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            isCurrent: e.target.checked,
            endMonth: e.target.checked ? '' : prev.endMonth,
            endYear: e.target.checked ? '' : prev.endYear
        }));
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
                        <X size={20} />
                    </button>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Employment details</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Adding roles & companies you have worked with help employers understand your background
                    </p>
                </div>

                <div className="px-8 pb-8 space-y-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {/* Company Name */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Company name
                        </label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="e.g. Google"
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                    </div>

                    {/* Designation */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Designation
                        </label>
                        <input
                            type="text"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            placeholder="e.g. Product Designer"
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                    </div>

                    {/* Working Since */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Working since
                        </label>
                        <div className="flex items-center gap-3">
                            <div className="relative w-full">
                                <select
                                    value={formData.startMonth}
                                    onChange={(e) => handleSelectChange('startMonth', e.target.value)}
                                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 appearance-none focus:outline-none focus:border-emerald-500 cursor-pointer"
                                >
                                    <option value="">Month</option>
                                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                            </div>
                            <div className="relative w-full">
                                <select
                                    value={formData.startYear}
                                    onChange={(e) => handleSelectChange('startYear', e.target.value)}
                                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 appearance-none focus:outline-none focus:border-emerald-500 cursor-pointer"
                                >
                                    <option value="">Year</option>
                                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                            </div>
                            <span className="text-gray-500 text-sm">to</span>
                            {!formData.isCurrent ? (
                                <>
                                    <div className="relative w-full">
                                        <select
                                            value={formData.endMonth}
                                            onChange={(e) => handleSelectChange('endMonth', e.target.value)}
                                            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 appearance-none focus:outline-none focus:border-emerald-500 cursor-pointer"
                                        >
                                            <option value="">Month</option>
                                            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                    </div>
                                    <div className="relative w-full">
                                        <select
                                            value={formData.endYear}
                                            onChange={(e) => handleSelectChange('endYear', e.target.value)}
                                            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 appearance-none focus:outline-none focus:border-emerald-500 cursor-pointer"
                                        >
                                            <option value="">Year</option>
                                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                    </div>
                                </>
                            ) : (
                                <div className="w-full flex items-center justify-center p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-400 cursor-not-allowed">
                                    Present
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Currently Working Checkbox */}
                    <div className="flex items-center gap-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isCurrent}
                                onChange={handleCheckboxChange}
                                className="sr-only peer"
                            />
                            <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-[#117a7a] peer-checked:border-[#117a7a] transition-colors flex items-center justify-center">
                                {formData.isCurrent && <X className="text-white rotate-45" size={14} strokeWidth={3} />}
                            </div>
                        </label>
                        <span className="text-sm font-medium text-gray-900 selection:bg-none cursor-pointer" onClick={() => handleCheckboxChange({ target: { checked: !formData.isCurrent } } as any)}>
                            I currently work here
                        </span>
                    </div>

                    {/* Description */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-bold text-gray-700">
                                Describe what you did at work
                            </label>
                            <span className="text-[10px] text-gray-400">{formData.description.length}/4000</span>
                        </div>
                        <div className="relative">
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="e.g. Lead the design of the main app landing page..."
                                className="w-full p-4 h-32 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                            />
                        </div>
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
                        className="bg-[#117a7a] hover:bg-[#0e6666] text-white text-sm font-bold py-2.5 px-8 rounded-lg transition-all shadow-lg shadow-emerald-900/10"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditEmploymentModal;
