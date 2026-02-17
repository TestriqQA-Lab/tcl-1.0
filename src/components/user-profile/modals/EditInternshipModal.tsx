'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Calendar, AlertCircle } from 'lucide-react';

export interface InternshipData {
    companyName: string;
    role: string; // "Project name/Role" in image
    startMonth: string;
    startYear: string;
    endMonth: string;
    endYear: string;
    description: string;
    keySkills?: string;
    projectUrl?: string;
    isCurrent: boolean;
}

interface EditInternshipModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: InternshipData;
    onSave: (data: InternshipData) => void;
}

const EditInternshipModal: React.FC<EditInternshipModalProps> = ({
    isOpen,
    onClose,
    initialData,
    onSave
}) => {
    const [animateIn, setAnimateIn] = useState(false);
    const [formData, setFormData] = useState<InternshipData>({
        companyName: '',
        role: '',
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
        description: '',
        keySkills: '',
        projectUrl: '',
        isCurrent: false
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (isOpen) {
            setAnimateIn(true);
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData({
                    companyName: '',
                    role: '',
                    startMonth: '',
                    startYear: '',
                    endMonth: '',
                    endYear: '',
                    description: '',
                    keySkills: '',
                    projectUrl: '',
                    isCurrent: false
                });
            }
            setErrors({});
        } else {
            setAnimateIn(false);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (field: keyof InternshipData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
        if (!formData.role.trim()) newErrors.role = 'Project name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.startMonth || !formData.startYear) newErrors.startDate = 'Start date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validate()) {
            onSave(formData);
            onClose();
        }
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Internships</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Show your professional learnings
                    </p>
                </div>

                <div className="px-8 pb-8 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    {/* Company Name */}
                    {/* The design uses "Company name" label */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Company name
                        </label>
                        <input
                            type="text"
                            value={formData.companyName}
                            onChange={(e) => handleChange('companyName', e.target.value)}
                            placeholder="e.g. Google"
                            className={`w-full p-3 border rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400 ${errors.companyName ? 'border-red-500' : 'border-gray-200'}`}
                        />
                    </div>

                    {/* Internship Duration */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Internship duration
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            {/* FROM */}
                            <div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">FROM</span>
                                <div className="flex gap-2">
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
                            </div>

                            {/* TO */}
                            <div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">TO</span>
                                <div className="flex gap-2">
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
                        <div className="flex items-center gap-2 mt-3">
                            <input
                                type="checkbox"
                                id="currentInternship"
                                checked={formData.isCurrent}
                                onChange={(e) => handleChange('isCurrent', e.target.checked)}
                                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                            />
                            <label htmlFor="currentInternship" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                                Currently working here
                            </label>
                        </div>
                    </div>

                    {/* Project name */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Project name
                        </label>
                        <input
                            type="text"
                            value={formData.role}
                            onChange={(e) => handleChange('role', e.target.value)}
                            placeholder="e.g. User Dashboard Redesign"
                            className={`w-full p-3 border rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400 ${errors.role ? 'border-red-500' : 'border-gray-200'}`}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-bold text-gray-700">
                                Describe what you did at internship<span className="text-red-500">*</span>
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
                            placeholder="Provide details about your role and impact..."
                            rows={4}
                            className={`w-full p-3 border rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400 resize-none ${errors.description ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200'}`}
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs text-red-500 font-medium flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errors.description}
                            </p>
                        )}
                        {/* The image shows exact error text "Description is required" in red below the box */}
                        {errors.description && (
                            <p className="mt-1 text-xs text-red-500">Description is required</p>
                        )}
                    </div>

                    {/* Key skills */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Key skills
                        </label>
                        <input
                            type="text"
                            value={formData.keySkills}
                            onChange={(e) => handleChange('keySkills', e.target.value)}
                            placeholder="e.g. React, Figma"
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400"
                        />
                    </div>

                    {/* Project URL */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Project URL <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <input
                            type="text"
                            value={formData.projectUrl}
                            onChange={(e) => handleChange('projectUrl', e.target.value)}
                            placeholder="https://"
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400"
                        />
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

export default EditInternshipModal;
