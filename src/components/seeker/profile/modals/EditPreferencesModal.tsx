import React, { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';

interface EditPreferencesModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: {
        jobTypes: string[];
        availability: string;
        locations: string[];
        position: string;
    };
    onSave?: (data: { jobTypes: string[]; availability: string; locations: string[]; position: string }) => void;
}

import { useFormPersistence } from '@/hooks/useFormPersistence';

const EditPreferencesModal: React.FC<EditPreferencesModalProps> = ({
    isOpen,
    onClose,
    initialData = {
        jobTypes: ['Jobs'],
        availability: '15 Days or less',
        locations: ['Mumbai'],
        position: ''
    },
    onSave
}) => {
    const { data: preferences, setData: setPreferences, clearDraft } = useFormPersistence(
        'career_preferences_draft',
        isOpen,
        initialData
    );

    // Destructure for easier usage, but keep them reactive to the persistence hook
    const { jobTypes, availability, locations, position } = preferences;

    const [locationInput, setLocationInput] = React.useState('');
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setAnimateIn(true);
        } else {
            setAnimateIn(false);
        }
    }, [isOpen]);

    const handleSave = () => {
        if (onSave) {
            onSave(preferences);
        }
        clearDraft();
        onClose();
    };

    if (!isOpen) return null;

    const toggleJobType = (type: string) => {
        setPreferences(prev => ({
            ...prev,
            jobTypes: prev.jobTypes.includes(type)
                ? prev.jobTypes.filter(t => t !== type)
                : [...prev.jobTypes, type]
        }));
    };

    const handleAddLocation = (loc: string) => {
        const trimmedLoc = loc.trim();
        if (trimmedLoc && !locations.includes(trimmedLoc) && locations.length < 10) {
            setPreferences(prev => ({
                ...prev,
                locations: [...prev.locations, trimmedLoc]
            }));
            setLocationInput('');
        }
    };

    const removeLocation = (loc: string) => {
        setPreferences(prev => ({
            ...prev,
            locations: prev.locations.filter(l => l !== loc)
        }));
    };

    const handleSetAvailability = (option: string) => {
        setPreferences(prev => ({
            ...prev,
            availability: option
        }));
    };

    const handleSetPosition = (position: string) => {
        setPreferences(prev => ({
            ...prev,
            position
        }));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300 min-h-[100dvh] w-screen top-0 left-0">
            <div className={`bg-white rounded-2xl w-full max-w-[520px] max-h-[90vh] flex flex-col shadow-2xl transform transition-all duration-300 ${animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                {/* Header */}
                <div className="pt-8 px-8 pb-4 relative shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Career preferences</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Tell us your preferences for your next job & we'll send you most relevant recommendations
                    </p>
                </div>

                <div className="px-8 pb-6 space-y-7 overflow-y-auto">
                    {/* Looking For */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                            Looking For
                        </label>
                        <div className="flex bg-gray-50 p-1 rounded-full inline-flex">
                            {['Internships', 'Jobs'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => toggleJobType(type)}
                                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${jobTypes.includes(type)
                                        ? 'bg-[#117a7a] text-white shadow-md'
                                        : 'bg-transparent text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Position */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                            Position / Role
                        </label>
                        <input
                            type="text"
                            value={position}
                            onChange={(e) => handleSetPosition(e.target.value)}
                            placeholder="e.g. Full Stack, Frontend, Marketing..."
                            className="w-full p-3 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all bg-white outline-none text-sm text-gray-700 placeholder:text-gray-400"
                        />
                    </div>

                    {/* Availability */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                            Availability to Work
                        </label>
                        <div className="flex flex-wrap gap-2.5">
                            {['15 Days or less', '1 Month', '2 Months', '3 Months', 'More than 3 Months', 'Serving Notice Period'].map(option => (
                                <button
                                    key={option}
                                    onClick={() => handleSetAvailability(option)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${availability === option
                                        ? 'bg-[#117a7a] text-white border-[#117a7a] shadow-md'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                            Preferred Work Location(s)
                        </label>
                        <div className="relative">
                            <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all bg-white min-h-[46px]">
                                {locations.map(loc => (
                                    <span key={loc} className="bg-[#e0f2f1] text-[#00695c] text-sm px-2.5 py-1 rounded-md flex items-center gap-1.5 font-medium">
                                        {loc}
                                        <button onClick={() => removeLocation(loc)} className="hover:text-emerald-900 transition-colors">
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    value={locationInput}
                                    onChange={(e) => setLocationInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && locationInput) {
                                            handleAddLocation(locationInput);
                                        }
                                    }}
                                    placeholder={locations.length === 0 ? "Search cities..." : ""}
                                    className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-400 min-w-[120px] py-1"
                                />
                                {/* Dropdown arrow could go here if needed */}
                            </div>
                        </div>

                        <div className="mt-4 flex gap-3 items-center text-xs">
                            <span className="text-gray-400 font-bold tracking-wide">SUGGESTIONS:</span>
                            <div className="flex gap-2">
                                <button onClick={() => handleAddLocation('Bengaluru')} className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md transition-colors border border-transparent hover:border-gray-200">Bengaluru <span className="text-[#117a7a] font-bold">+</span></button>
                                <button onClick={() => handleAddLocation('Delhi/NCR')} className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md transition-colors border border-transparent hover:border-gray-200">Delhi/NCR <span className="text-[#117a7a] font-bold">+</span></button>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
                            <Info size={14} className="text-gray-300" />
                            <span>You can add up to 10 locations</span>
                        </div>
                    </div>

                </div>
                {/* Footer buttons */}
                <div className="flex justify-between items-center pt-4 pb-6 px-8 border-t border-gray-100 shrink-0">
                    <button
                        onClick={onClose}
                        className="text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        I'll add this later
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-[#117a7a] hover:bg-[#0e6666] text-white text-sm font-bold py-3 px-8 rounded-lg transition-all shadow-lg shadow-emerald-900/10 hover:shadow-emerald-900/20 active:translate-y-0.5"
                    >
                        Save preferences
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPreferencesModal;
