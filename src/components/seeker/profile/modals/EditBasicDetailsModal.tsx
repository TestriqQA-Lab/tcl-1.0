'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface EditBasicDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: {
        fullName: string;
        phoneNumber: string;
        gender: string;
        currentLocation: string;
        currentIndustry: string;
        noticePeriod: string;
    };
    onSave?: (data: {
        fullName: string;
        phoneNumber: string;
        gender: string;
        currentLocation: string;
        currentIndustry: string;
        noticePeriod: string;
    }) => void;
}

const genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
    { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
];

const industryOptions = [
    'HR', 'Marketing', 'IT', 'Operations', 'Finance', 'Healthcare',
    'Education', 'Manufacturing', 'Retail', 'Construction', 'Other'
];

const noticePeriodOptions = [
    { value: 'IMMEDIATE', label: 'Immediate' },
    { value: '15_DAYS', label: '15 Days' },
    { value: '30_DAYS', label: '30 Days' },
    { value: '60_DAYS', label: '60 Days' },
    { value: '90_DAYS', label: '90 Days' },
];

const EditBasicDetailsModal: React.FC<EditBasicDetailsModalProps> = ({
    isOpen,
    onClose,
    initialData = { fullName: '', phoneNumber: '', gender: '', currentLocation: '' },
    onSave,
}) => {
    const [fullName, setFullName] = useState(initialData.fullName || '');
    const [phoneNumber, setPhoneNumber] = useState(initialData.phoneNumber || '');
    const [gender, setGender] = useState(initialData.gender || '');
    const [currentLocation, setCurrentLocation] = useState(initialData.currentLocation || '');
    const [currentIndustry, setCurrentIndustry] = useState(initialData.currentIndustry || '');
    const [noticePeriod, setNoticePeriod] = useState(initialData.noticePeriod || '');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFullName(initialData.fullName || '');
            setPhoneNumber(initialData.phoneNumber || '');
            setGender(initialData.gender || '');
            setCurrentLocation(initialData.currentLocation || '');
            setCurrentIndustry(initialData.currentIndustry || '');
            setNoticePeriod(initialData.noticePeriod || '');
        }
    }, [isOpen, initialData]);

    // Lock scroll
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleSave = async () => {
        setSaving(true);
        onSave?.({
            fullName,
            phoneNumber,
            gender,
            currentLocation,
            currentIndustry,
            noticePeriod
        });
        setSaving(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Edit Basic Details</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 -m-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 overflow-y-auto space-y-5">
                    {/* Full Name */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl
                                placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f766d]/20 focus:border-[#0f766d]
                                transition-all duration-200"
                        />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Enter your phone number"
                            className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl
                                placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f766d]/20 focus:border-[#0f766d]
                                transition-all duration-200"
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Gender
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {genderOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setGender(opt.value)}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200
                                        ${gender === opt.value
                                            ? 'bg-[#0f766d] text-white border-[#0f766d] shadow-sm'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Current Location
                        </label>
                        <input
                            type="text"
                            value={currentLocation}
                            onChange={(e) => setCurrentLocation(e.target.value)}
                            placeholder="e.g. Mumbai, India"
                            className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl
                                placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f766d]/20 focus:border-[#0f766d]
                                transition-all duration-200"
                        />
                    </div>

                    {/* Industry */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Industry
                        </label>
                        <select
                            value={currentIndustry}
                            onChange={(e) => setCurrentIndustry(e.target.value)}
                            className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl
                                focus:outline-none focus:ring-2 focus:ring-[#0f766d]/20 focus:border-[#0f766d]
                                transition-all duration-200"
                        >
                            <option value="">Select Industry</option>
                            {industryOptions.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    {/* Notice Period */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Notice Period
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {noticePeriodOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setNoticePeriod(opt.value)}
                                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-200
                                        ${noticePeriod === opt.value
                                            ? 'bg-[#0f766d] text-white border-[#0f766d] shadow-sm'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || !fullName.trim()}
                        className="px-5 py-2 text-sm font-semibold text-white bg-[#0f766d] hover:bg-[#0d6b63] rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditBasicDetailsModal;
