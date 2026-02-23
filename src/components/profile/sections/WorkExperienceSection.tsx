"use client";

import React from 'react';
import { SectionCard } from '../SectionCard';
import { Timeline } from '../Timeline';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { DatePicker } from '../DatePicker';
import { WorkExperience } from '@/lib/profileTypes';
import { Plus, Trash2 } from 'lucide-react';

interface WorkExperienceSectionProps {
    data: WorkExperience[];
    onChange: (data: WorkExperience[]) => void;
    isComplete?: boolean;
}

const employmentTypeOptions = [
    { value: 'intern', label: 'Intern' },
    { value: 'fulltime', label: 'Full-time' },
    { value: 'contract', label: 'Contract' },
];

export const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({
    data,
    onChange,
    isComplete = false,
}) => {
    const addExperience = () => {
        onChange([
            ...data,
            {
                id: Date.now().toString(),
                organization: '',
                jobTitle: '',
                employmentType: '',
                startDate: '',
                endDate: '',
                currentlyWorking: false,
                responsibilities: [],
                industry: '',
            },
        ]);
    };

    const removeExperience = (id: string) => {
        onChange(data.filter((exp) => exp.id !== id));
    };

    const updateExperience = (id: string, updates: Partial<WorkExperience>) => {
        onChange(data.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp)));
    };

    const addResponsibility = (id: string, responsibility: string) => {
        const exp = data.find((e) => e.id === id);
        if (exp && responsibility.trim()) {
            updateExperience(id, {
                responsibilities: [...exp.responsibilities, responsibility.trim()],
            });
        }
    };

    const removeResponsibility = (id: string, index: number) => {
        const exp = data.find((e) => e.id === id);
        if (exp) {
            updateExperience(id, {
                responsibilities: exp.responsibilities.filter((_, i) => i !== index),
            });
        }
    };

    // Convert to Timeline format for display
    const timelineItems = data.map((exp) => ({
        id: exp.id,
        title: exp.jobTitle,
        subtitle: exp.organization,
        startDate: exp.startDate,
        endDate: exp.endDate,
        current: exp.currentlyWorking,
        bullets: exp.responsibilities,
    }));

    return (
        <SectionCard
            title="Work Experience"
            subtitle="Show employers your professional journey"
            isComplete={isComplete}
        >
            <div className="space-y-6">
                {data.length > 0 && (
                    <div className="mb-8">
                        <Timeline items={timelineItems} />
                    </div>
                )}

                {/* Experience Form Cards */}
                {data.map((exp, index) => {
                    const [newResponsibility, setNewResponsibility] = React.useState('');

                    return (
                        <div key={exp.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-900">Experience #{index + 1}</h3>
                                <button
                                    type="button"
                                    onClick={() => removeExperience(exp.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormInput
                                        label="Organization / Company Name"
                                        name={`org-${exp.id}`}
                                        value={exp.organization}
                                        onChange={(e) => updateExperience(exp.id, { organization: e.target.value })}
                                        required
                                    />

                                    <FormInput
                                        label="Job Title / Role"
                                        name={`title-${exp.id}`}
                                        value={exp.jobTitle}
                                        onChange={(e) => updateExperience(exp.id, { jobTitle: e.target.value })}
                                        required
                                    />

                                    <FormSelect
                                        label="Employment Type"
                                        name={`type-${exp.id}`}
                                        options={employmentTypeOptions}
                                        value={exp.employmentType}
                                        onChange={(e) => updateExperience(exp.id, { employmentType: e.target.value })}
                                        required
                                    />

                                    <FormInput
                                        label="Industry / Domain"
                                        name={`industry-${exp.id}`}
                                        value={exp.industry}
                                        onChange={(e) => updateExperience(exp.id, { industry: e.target.value })}
                                    />

                                    <DatePicker
                                        label="Start Date"
                                        name={`start-${exp.id}`}
                                        type="month"
                                        value={exp.startDate}
                                        onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                                        required
                                    />

                                    <DatePicker
                                        label="End Date"
                                        name={`end-${exp.id}`}
                                        type="month"
                                        value={exp.endDate}
                                        onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                                        disabled={exp.currentlyWorking}
                                    />
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={exp.currentlyWorking}
                                        onChange={(e) => updateExperience(exp.id, { currentlyWorking: e.target.checked })}
                                        className="w-4 h-4 text-primary rounded focus:ring-primary"
                                    />
                                    <span className="text-sm font-semibold text-slate-700">Currently working here</span>
                                </label>

                                {/* Responsibilities */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                                        Key Responsibilities & Achievements
                                    </label>

                                    {exp.responsibilities.length > 0 && (
                                        <ul className="mb-3 space-y-2">
                                            {exp.responsibilities.map((resp, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 bg-white p-3 rounded-lg">
                                                    <span className="text-primary mt-0.5">•</span>
                                                    <span className="flex-1">{resp}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeResponsibility(exp.id, idx)}
                                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                                    >
                                                        ✕
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newResponsibility}
                                            onChange={(e) => setNewResponsibility(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addResponsibility(exp.id, newResponsibility);
                                                    setNewResponsibility('');
                                                }
                                            }}
                                            placeholder="Type a responsibility and press Enter"
                                            className="flex-1 bg-white border border-slate-200 rounded-2xl py-2.5 px-4 text-slate-700 text-sm
                        focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                addResponsibility(exp.id, newResponsibility);
                                                setNewResponsibility('');
                                            }}
                                            className="px-6 py-2.5 bg-primary text-white rounded-2xl font-semibold text-sm hover:opacity-90 transition-opacity"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Add Experience Button */}
                <button
                    type="button"
                    onClick={addExperience}
                    className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl
            text-primary font-semibold hover:border-primary hover:bg-primary/5 transition-all
            flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Work Experience
                </button>
            </div>
        </SectionCard>
    );
};
