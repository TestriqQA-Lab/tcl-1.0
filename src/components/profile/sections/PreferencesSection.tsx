"use client";

import React from 'react';
import { SectionCard } from '../SectionCard';
import { RangeSlider } from '../RangeSlider';
import { PreferencesData } from '@/lib/profileTypes';
import { formatSalary } from '@/lib/profileUtils';
import { DollarSign, Building2, Clock } from 'lucide-react';

interface PreferencesSectionProps {
    data: PreferencesData;
    onChange: (data: PreferencesData) => void;
    isComplete?: boolean;
}

const industryOptions = [
    'IT & Software',
    'Finance & Banking',
    'Healthcare',
    'E-commerce',
    'Education',
    'Manufacturing',
    'Consulting',
    'Marketing & Advertising',
    'Real Estate',
    'Retail',
];

const companyTypeOptions = ['Startup', 'MNC', 'Product Company', 'Service Company'];

export const PreferencesSection: React.FC<PreferencesSectionProps> = ({
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
            title="Preferences & Salary"
            subtitle="Help us match you with the right opportunities"
            isComplete={isComplete}
        >
            <div className="space-y-6">
                {/* Expected Salary */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-200">
                    <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <h3 className="font-bold text-slate-900">Expected Salary / Stipend</h3>
                        <span className="text-primary text-xs font-semibold">*Required</span>
                    </div>
                    <RangeSlider
                        label=""
                        min={0}
                        max={5000000}
                        step={10000}
                        value={data.salaryRange}
                        onChange={(value) => onChange({ ...data, salaryRange: value })}
                        formatValue={(v) => formatSalary(v, '₹')}
                    />
                    <p className="text-xs text-slate-600 mt-3">
                        💡 Setting a realistic salary range helps match you with suitable opportunities
                    </p>
                </div>

                {/* Preferred Industries */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700 flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Preferred Industries <span className="text-primary">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {industryOptions.map((industry) => (
                            <button
                                key={industry}
                                type="button"
                                onClick={() =>
                                    onChange({
                                        ...data,
                                        preferredIndustries: toggleArrayValue(data.preferredIndustries, industry),
                                    })
                                }
                                className={`px-4 py-2 rounded-full border-2 font-medium text-sm transition-all ${data.preferredIndustries.includes(industry)
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-primary/50'
                                    }`}
                            >
                                {industry}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Select all that interest you</p>
                </div>

                {/* Preferred Company Type */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                        Preferred Company Type
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {companyTypeOptions.map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() =>
                                    onChange({
                                        ...data,
                                        companyTypes: toggleArrayValue(data.companyTypes, type),
                                    })
                                }
                                className={`p-4 rounded-2xl border-2 font-semibold text-sm transition-all ${data.companyTypes.includes(type)
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-primary/30'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Shift Preference */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Shift Preference
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {['Day Shift', 'Night Shift', 'Flexible'].map((shift) => (
                            <button
                                key={shift}
                                type="button"
                                onClick={() => onChange({ ...data, shiftPreference: shift })}
                                className={`py-3 px-4 rounded-2xl border-2 font-semibold text-sm transition-all ${data.shiftPreference === shift
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-primary/30'
                                    }`}
                            >
                                {shift}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-2xl">
                    <p className="text-sm text-indigo-800 flex items-start gap-2">
                        <span className="text-lg">🎯</span>
                        <span>These preferences power our matching algorithm to find you the perfect job</span>
                    </p>
                </div>
            </div>
        </SectionCard>
    );
};
