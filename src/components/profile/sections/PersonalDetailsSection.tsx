"use client";

import React from 'react';
import { SectionCard } from '../SectionCard';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { DatePicker } from '../DatePicker';
import { MapPin, Flag } from 'lucide-react';
import { PersonalDetailsData } from '@/lib/profileTypes';
import { calculateAge } from '@/lib/profileUtils';

interface PersonalDetailsSectionProps {
    data: PersonalDetailsData;
    onChange: (data: PersonalDetailsData) => void;
    isComplete?: boolean;
}

const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export const PersonalDetailsSection: React.FC<PersonalDetailsSectionProps> = ({
    data,
    onChange,
    isComplete = false,
}) => {
    const [locationInput, setLocationInput] = React.useState('');

    const age = data.dateOfBirth ? calculateAge(data.dateOfBirth) : null;

    const handleAddLocation = () => {
        if (locationInput.trim() && !data.preferredLocations.includes(locationInput.trim())) {
            onChange({
                ...data,
                preferredLocations: [...data.preferredLocations, locationInput.trim()],
            });
            setLocationInput('');
        }
    };

    const handleRemoveLocation = (location: string) => {
        onChange({
            ...data,
            preferredLocations: data.preferredLocations.filter((loc) => loc !== location),
        });
    };

    return (
        <SectionCard
            title="Personal Details"
            subtitle="Information shown to potential employers"
            isComplete={isComplete}
        >
            <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Gender */}
                    <FormSelect
                        label="Gender"
                        name="gender"
                        options={genderOptions}
                        value={data.gender}
                        onChange={(e) => onChange({ ...data, gender: e.target.value })}
                        placeholder="Select gender"
                    />

                    {/* Date of Birth */}
                    <div>
                        <DatePicker
                            label="Date of Birth"
                            name="dateOfBirth"
                            type="date"
                            value={data.dateOfBirth}
                            onChange={(e) => {
                                const newAge = calculateAge(e.target.value);
                                onChange({ ...data, dateOfBirth: e.target.value, age: newAge });
                            }}
                            required
                            max={new Date().toISOString().split('T')[0]}
                        />
                        {age && (
                            <p className="mt-1.5 text-xs text-slate-500">Age: {age} years</p>
                        )}
                    </div>
                </div>

                {/* Current Location */}
                <FormInput
                    label="Current Location"
                    name="currentLocation"
                    type="text"
                    placeholder="e.g. Mumbai, Maharashtra"
                    value={data.currentLocation}
                    onChange={(e) => onChange({ ...data, currentLocation: e.target.value })}
                    leftIcon={MapPin}
                    required
                    helperText="This helps employers find local candidates"
                />

                {/* Preferred Work Locations */}
                <div>
                    <label className="block text-sm font-semibold mb-1.5 text-slate-700">
                        Preferred Work Location(s)
                    </label>

                    {/* Location Tags */}
                    {data.preferredLocations.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {data.preferredLocations.map((location, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                                >
                                    <MapPin className="w-3 h-3" />
                                    {location}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveLocation(location)}
                                        className="ml-1 hover:opacity-70"
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Add Location */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={locationInput}
                            onChange={(e) => setLocationInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLocation())}
                            placeholder="Type city name and press Enter"
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-4 text-slate-700 text-sm
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                        <button
                            type="button"
                            onClick={handleAddLocation}
                            className="px-6 py-2.5 bg-primary text-white rounded-2xl font-semibold text-sm hover:opacity-90 transition-opacity"
                        >
                            Add
                        </button>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500">Add multiple locations where you'd like to work</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Nationality */}
                    <FormInput
                        label="Nationality"
                        name="nationality"
                        type="text"
                        placeholder="e.g. Indian"
                        value={data.nationality}
                        onChange={(e) => onChange({ ...data, nationality: e.target.value })}
                        leftIcon={Flag}
                    />

                    {/* Willing to Relocate */}
                    <div>
                        <label className="block text-sm font-semibold mb-1.5 text-slate-700">
                            Willing to Relocate?
                        </label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => onChange({ ...data, willingToRelocate: true })}
                                className={`flex-1 py-2.5 px-4 rounded-2xl border-2 font-semibold text-sm transition-all ${data.willingToRelocate
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-primary/30'
                                    }`}
                            >
                                Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => onChange({ ...data, willingToRelocate: false })}
                                className={`flex-1 py-2.5 px-4 rounded-2xl border-2 font-semibold text-sm transition-all ${!data.willingToRelocate
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-primary/30'
                                    }`}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>

                {/* Employer Visibility Note */}
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                    <p className="text-sm text-blue-800 flex items-start gap-2">
                        <span className="text-lg">👁️</span>
                        <span>These details help employers match you with relevant opportunities</span>
                    </p>
                </div>
            </div>
        </SectionCard>
    );
};
