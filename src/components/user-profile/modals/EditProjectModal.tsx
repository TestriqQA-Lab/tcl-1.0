'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Calendar, AlertCircle } from 'lucide-react';

export interface ProjectData {
    title: string;
    startMonth: string;
    startYear: string;
    endMonth: string;
    endYear: string;
    description: string;
    keySkills?: string;
    projectUrl?: string;
}

interface EditProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: ProjectData;
    onSave: (data: ProjectData) => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
    isOpen,
    onClose,
    initialData,
    onSave
}) => {
    const [animateIn, setAnimateIn] = useState(false);
    const [formData, setFormData] = useState<ProjectData>({
        title: '',
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
        description: '',
        keySkills: '',
        projectUrl: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (isOpen) {
            setAnimateIn(true);
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData({
                    title: '',
                    startMonth: '',
                    startYear: '',
                    endMonth: '',
                    endYear: '',
                    description: '',
                    keySkills: '',
                    projectUrl: ''
                });
            }
            setErrors({});
        } else {
            setAnimateIn(false);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (field: keyof ProjectData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.title.trim()) newErrors.title = 'Project title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';

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
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Projects</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Showcase your talent with the best projects you have worked on during college and work
                    </p>
                </div>

                <div className="px-8 pb-8 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    {/* Project Name */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Project name
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="Enter project title"
                            className={`w-full p-3 border rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400 ${errors.title ? 'border-red-500' : 'border-gray-200'}`}
                        />
                    </div>

                    {/* Project Duration */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Project duration
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
                                            className="w-full p-2.5 pr-8 border border-gray-200 rounded-lg text-sm text-gray-900 appearance-none focus:outline-none focus:border-emerald-500 bg-white"
                                        >
                                            <option value="">Month</option>
                                            {months.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                    </div>
                                    <div className="relative flex-1">
                                        <select
                                            value={formData.endYear}
                                            onChange={(e) => handleChange('endYear', e.target.value)}
                                            className="w-full p-2.5 pr-8 border border-gray-200 rounded-lg text-sm text-gray-900 appearance-none focus:outline-none focus:border-emerald-500 bg-white"
                                        >
                                            <option value="">Year</option>
                                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>
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
                            placeholder="Describe what the project was about"
                            rows={4}
                            className={`w-full p-3 border rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400 resize-none ${errors.description ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200'}`}
                        />
                        {/* Does the project modal image have explicit error text below? It shows "Description is required" in the internship image. I will add it here for consistency if validation fails. */}
                        {errors.description && (
                            <p className="mt-1 text-xs text-red-500">Description is required</p>
                        )}
                    </div>

                    {/* Key skills used */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-bold text-gray-700">
                                Key skills used
                            </label>
                        </div>

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
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-bold text-gray-700">
                                Project URL
                            </label>
                            <span className="text-[10px] text-emerald-600 italic">Optional</span>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                value={formData.projectUrl}
                                onChange={(e) => handleChange('projectUrl', e.target.value)}
                                placeholder="https://"
                                className="w-full p-3 pl-10 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <span className="font-bold text-xs">🔗</span>
                            </div>
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
                            Save Project
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProjectModal;
