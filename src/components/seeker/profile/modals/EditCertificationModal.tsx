'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';

export interface CertificationData {
    id: string;
    name: string;
    completionId: string;
    url: string;
    startMonth: string;
    startYear: string;
    endMonth: string;
    endYear: string;
    doesNotExpire: boolean;
}

interface EditCertificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: CertificationData;
    onSave: (data: CertificationData) => void;
}

const EditCertificationModal: React.FC<EditCertificationModalProps> = ({
    isOpen,
    onClose,
    initialData,
    onSave
}) => {
    const [animateIn, setAnimateIn] = useState(false);
    const [formData, setFormData] = useState<CertificationData>({
        id: '',
        name: '',
        completionId: '',
        url: '',
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
        doesNotExpire: false
    });

    useEffect(() => {
        if (isOpen) {
            setAnimateIn(true);
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData({
                    id: Math.random().toString(36).substr(2, 9),
                    name: '',
                    completionId: '',
                    url: '',
                    startMonth: '',
                    startYear: '',
                    endMonth: '',
                    endYear: '',
                    doesNotExpire: false
                });
            }
        } else {
            setAnimateIn(false);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (field: keyof CertificationData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        // Basic validation could go here
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Certification</h3>
                    <p className="text-sm text-gray-500 leading-relaxed text-[#117a7a]">
                        Add details of your certification. You can add up to 10 in your profile.
                    </p>
                </div>

                <div className="px-8 pb-8 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    {/* Certification Name */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Certification name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="e.g. AWS Certified Solutions Architect"
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400"
                        />
                    </div>

                    {/* Certification Completion ID */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Certification completion ID
                        </label>
                        <input
                            type="text"
                            value={formData.completionId}
                            onChange={(e) => handleChange('completionId', e.target.value)}
                            placeholder="e.g. 123456" // "Credential ID" in one mockup, numbers in another. Using "e.g. 123456" or "Credential ID" as placeholder.
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400"
                        />
                    </div>

                    {/* Certification URL */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Certification URL
                        </label>
                        <input
                            type="text"
                            value={formData.url}
                            onChange={(e) => handleChange('url', e.target.value)}
                            placeholder="https://" // "e.g. https://..." in one mockup
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400"
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* From */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2">From</label>
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

                        {/* To */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2">To</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <select
                                        value={formData.endMonth}
                                        onChange={(e) => handleChange('endMonth', e.target.value)}
                                        disabled={formData.doesNotExpire}
                                        className={`w-full p-2.5 pr-8 border border-gray-200 rounded-lg text-sm text-gray-900 appearance-none focus:outline-none focus:border-emerald-500 transition-all ${formData.doesNotExpire ? 'bg-gray-50 text-gray-400' : 'bg-white'}`}
                                    >
                                        <option value="">Month</option>
                                        {!formData.doesNotExpire && months.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                </div>
                                <div className="relative flex-1">
                                    <select
                                        value={formData.endYear}
                                        onChange={(e) => handleChange('endYear', e.target.value)}
                                        disabled={formData.doesNotExpire}
                                        className={`w-full p-2.5 pr-8 border border-gray-200 rounded-lg text-sm text-gray-900 appearance-none focus:outline-none focus:border-emerald-500 transition-all ${formData.doesNotExpire ? 'bg-gray-50 text-gray-400' : 'bg-white'}`}
                                    >
                                        <option value="">Year</option>
                                        {!formData.doesNotExpire && years.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Does not expire Checkbox */}
                    <div className="flex items-center gap-2 mt-1">
                        <input
                            type="checkbox"
                            id="doesNotExpire"
                            checked={formData.doesNotExpire}
                            onChange={(e) => handleChange('doesNotExpire', e.target.checked)}
                            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        />
                        <label htmlFor="doesNotExpire" className="text-sm font-medium text-[#117a7a] select-none cursor-pointer">
                            This certification does not expire
                        </label>
                    </div>

                    {/* Footer Buttons */}
                    <div className="pt-2 flex justify-between items-center sm:justify-end gap-3">
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

export default EditCertificationModal;
