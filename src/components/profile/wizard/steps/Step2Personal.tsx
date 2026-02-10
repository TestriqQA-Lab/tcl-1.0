"use client";

import React, { useState, useEffect } from 'react';
import { FormInput } from '@/components/profile/FormInput';
import { FormSelect } from '@/components/profile/FormSelect';
import { QuickAddChips } from '@/components/profile/smart/SmartSuggest';
import { WizardChildProps } from '@/components/profile/wizard/ProfileWizard';
import { CITIES, getNearbyCities } from '@/lib/suggestionData';
import { DatePicker } from '@/components/profile/DatePicker';
import { calculateAge } from '@/lib/profileUtils';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export const Step2Personal: React.FC<WizardChildProps> = ({ profileData, updateData }) => {
    const [nearbyCities, setNearbyCities] = useState<string[]>([]);
    const [isStudent, setIsStudent] = useState(false);

    const data = profileData.personalDetails || {
        gender: '',
        dateOfBirth: '',
        age: 0,
        currentLocation: '',
        preferredLocations: [],
        nationality: '',
        willingToRelocate: false,
    };

    const age = data.dateOfBirth ? calculateAge(data.dateOfBirth) : null;

    useEffect(() => {
        if (age && age < 18) {
            setIsStudent(true);
        }
    }, [age]);

    useEffect(() => {
        if (data.currentLocation) {
            const nearby = getNearbyCities(data.currentLocation);
            setNearbyCities(nearby);
        }
    }, [data.currentLocation]);

    const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormSelect
                    label="Gender"
                    name="gender"
                    options={genderOptions}
                    value={data.gender}
                    onChange={(e) => updateData({ personalDetails: { ...data, gender: e.target.value } })}
                />

                <div>
                    <DatePicker
                        label="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        value={data.dateOfBirth}
                        onChange={(e) => {
                            const newAge = calculateAge(e.target.value);
                            updateData({ personalDetails: { ...data, dateOfBirth: e.target.value, age: newAge } });
                        }}
                        required
                        max={new Date().toISOString().split('T')[0]}
                    />
                    {age && <p className="mt-1 text-xs text-slate-500">Age: {age} years</p>}
                </div>
            </div>

            {isStudent && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-lg"
                >
                    <p className="text-sm text-slate-700">
                        Based on your age, we have identified you as a student. We will highlight internship and fresher opportunities.
                    </p>
                </motion.div>
            )}

            <FormInput
                label="Current Location"
                name="currentLocation"
                placeholder="e.g. Mumbai"
                value={data.currentLocation}
                onChange={(e) => updateData({ personalDetails: { ...data, currentLocation: e.target.value } })}
                leftIcon={MapPin}
                required
            />

            {nearbyCities.length > 0 && (
                <QuickAddChips
                    title="Nearby cities you might prefer:"
                    suggestions={nearbyCities}
                    onAdd={(city) => {
                        if (!data.preferredLocations.includes(city)) {
                            updateData({
                                personalDetails: {
                                    ...data,
                                    preferredLocations: [...data.preferredLocations, city],
                                },
                            });
                        }
                    }}
                />
            )}

            <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">
                    Willing to Relocate?
                </label>
                <div className="flex gap-3">
                    <button
                        type="button" className={`flex-1 py-2.5 px-4 rounded-2xl border-2 font-semibold text-sm ${data.willingToRelocate
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-slate-200 bg-slate-50 text-slate-600'
                            }`}
                        onClick={() => updateData({ personalDetails: { ...data, willingToRelocate: true } })}
                    >
                        Yes
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-2.5 px-4 rounded-2xl border-2 font-semibold text-sm ${!data.willingToRelocate
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-slate-200 bg-slate-50 text-slate-600'
                            }`}
                        onClick={() => updateData({ personalDetails: { ...data, willingToRelocate: false } })}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};
