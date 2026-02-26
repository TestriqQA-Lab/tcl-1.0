"use client";

import React from 'react';
import { SectionCard } from '../SectionCard';
import { SegmentedControl } from '../SegmentedControl';
import { FormSelect } from '../FormSelect';
import { ProfessionalStatusData } from '@/lib/profileTypes';
import { Briefcase, Clock, Laptop, MapPin as WorkMode } from 'lucide-react';

interface ProfessionalStatusSectionProps {
    data: ProfessionalStatusData;
    onChange: (data: ProfessionalStatusData) => void;
    isComplete?: boolean;
}

const availabilityOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: '15days', label: '15 days' },
    { value: '30days', label: '30 days' },
    { value: '60days', label: '60 days' },
    { value: '90days', label: '90 days' },
];

const workTypeOptions = ['Full-time', 'Part-time', 'Internship', 'Contract/Freelance'];
const workModeOptions = ['On-site', 'Remote', 'Hybrid'];
const lookingForOptions = ['Job', 'Internship', 'Both'];

export const ProfessionalStatusSection: React.FC<ProfessionalStatusSectionProps> = ({
    data,
    onChange,
    isComplete = false,
}) => {
    const toggleArrayValue = (array: string[], value: string) => {
        if (array.includes(value)) {
            return array.filter((item) => item !== value);
        }
        return [...array, value];
    };

    return (
        <SectionCard
            title="Professional Status"
            subtitle="Critical information for recruiter matching"
            isComplete={isComplete}
        >
            <div className="space-y-6">
                {/* Work Status */}
                <SegmentedControl
                    label="Work Status"
                    options={[
                        { value: 'fresher', label: 'Fresher' },
                        { value: 'experienced', label: 'Experienced' },
                    ]}
                    value={data.workStatus}
                    onChange={(value) => onChange({ ...data, workStatus: value as 'fresher' | 'experienced' })}
                    required
                />

                {/* Looking For */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                        Looking For <span className="text-primary">*</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {lookingForOptions.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() =>
                                    onChange({
                                        ...data,
                                        lookingFor: toggleArrayValue(data.lookingFor, option),
                                    })
                                }
                                className={`px-5 py-2.5 rounded-2xl border-2 font-semibold text-sm transition-all ${data.lookingFor.includes(option)
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-primary/30'
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Current Employment Status */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                        Current Employment Status <span className="text-primary">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                            { id: 'unemployed', label: 'Unemployed', icon: '🔍' },
                            { id: 'employed', label: 'Employed', icon: '💼' },
                            { id: 'student', label: 'Student', icon: '🎓' },
                        ].map((status) => (
                            <button
                                key={status.id}
                                type="button"
                                onClick={() => onChange({ ...data, employmentStatus: status.id })}
                                className={`p-4 rounded-2xl border-2 transition-all ${data.employmentStatus === status.id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-slate-200 bg-slate-50 hover:border-primary/30 hover:bg-white'
                                    }`}
                            >
                                <div className="text-2xl mb-2">{status.icon}</div>
                                <div className={`font-semibold text-sm ${data.employmentStatus === status.id ? 'text-primary' : 'text-slate-700'
                                    }`}>
                                    {status.label}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Availability / Notice Period */}
                <FormSelect
                    label="Availability / Notice Period"
                    name="availability"
                    options={availabilityOptions}
                    value={data.availability}
                    onChange={(e) => onChange({ ...data, availability: e.target.value })}
                    required
                    helperText="When can you start working?"
                />

                {/* Preferred Work Type */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Preferred Work Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {workTypeOptions.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() =>
                                    onChange({
                                        ...data,
                                        preferredWorkTypes: toggleArrayValue(data.preferredWorkTypes, option),
                                    })
                                }
                                className={`px-4 py-2 rounded-full border-2 font-medium text-sm transition-all ${data.preferredWorkTypes.includes(option)
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-primary/50'
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Select all that apply</p>
                </div>

                {/* Preferred Work Mode */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700 flex items-center gap-2">
                        <Laptop className="w-4 h-4" />
                        Preferred Work Mode
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {workModeOptions.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() =>
                                    onChange({
                                        ...data,
                                        preferredModes: toggleArrayValue(data.preferredModes, option),
                                    })
                                }
                                className={`px-4 py-2 rounded-full border-2 font-medium text-sm transition-all ${data.preferredModes.includes(option)
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-primary/50'
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Select all that apply</p>
                </div>

                {/* Recruiter Note */}
                <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                    <p className="text-sm text-orange-800 flex items-start gap-2">
                        <span className="text-lg">⭐</span>
                        <span>These preferences help recruiters find the perfect match for you</span>
                    </p>
                </div>
            </div>
        </SectionCard>
    );
};
