'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Info } from 'lucide-react';

interface EditEducationModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: EducationData;
    onSave?: (data: EducationData) => void;
}

export interface EducationData {
    type?: 'Class X' | 'Class XII' | 'Diploma' | 'Degree' | 'Post Graduation';
    board?: string;
    medium?: string;
    percentage: string;
    passingYear?: string; // Keep for backward compatibility if needed, or remove. Let's make optional.
    endingYear: string;
    isPursuing: boolean;
    institute?: string;
    degree?: string;
    stream?: string;
}

import { useFormPersistence } from '@/hooks/useFormPersistence';

const EditEducationModal: React.FC<EditEducationModalProps> = ({
    isOpen,
    onClose,
    initialData,
    onSave
}) => {
    const defaultState: EducationData = {
        type: 'Class X',
        board: '',
        medium: '',
        percentage: '',
        endingYear: '',
        isPursuing: false,
        institute: '',
        degree: '',
        stream: ''
    };

    // Generate a unique key based on whether we are adding or editing
    // If initialData exists, we try to use its type to uniqueness, otherwise fallback to generic edit
    const persistenceKey = initialData && (initialData as any).dbId
        ? `education_edit_draft_${(initialData as any).dbId}`
        : 'education_add_draft';

    const { data: formData, setData: setFormData, clearDraft } = useFormPersistence<EducationData>(
        persistenceKey,
        isOpen,
        initialData || defaultState
    );

    const [animateIn, setAnimateIn] = useState(false);
    const [educationType, setEducationType] = useState<EducationData['type']>('Class X');

    useEffect(() => {
        if (isOpen) {
            setAnimateIn(true);
            // Sync educationType with the loaded formData data
            if (formData.type) {
                setEducationType(formData.type);
            } else if (initialData?.type) {
                setEducationType(initialData.type);
            } else {
                setEducationType('Class X');
            }
        } else {
            setAnimateIn(false);
        }
    }, [isOpen, formData.type, initialData?.type]);

    // Derived state for the UI tabs to group Class XII and Diploma
    const currentTab = (educationType === 'Class XII' || educationType === 'Diploma')
        ? 'Class XII / Diploma'
        : educationType;

    if (!isOpen) return null;

    const handleChange = (field: keyof EducationData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleTypeChange = (type: EducationData['type']) => {
        setEducationType(type);
        setFormData({ ...defaultState, type });
    };

    const years = Array.from({ length: 50 }, (_, i) => (new Date().getFullYear() + 5 - i).toString());

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300 min-h-[100dvh] w-screen top-0 left-0">
            <div className={`bg-white rounded-2xl w-full max-w-[650px] shadow-2xl transform transition-all duration-300 ${animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                {/* Header */}
                <div className="p-8 pb-4 relative">
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Education</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Adding your educational details help recruiters know your value as a potential candidate
                    </p>
                </div>

                <div className="px-8 pb-8 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Education Type Selector */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Education Type
                        </label>
                        <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto hide-scrollbar">
                            {(['Class X', 'Class XII / Diploma', 'Degree', 'Post Graduation'] as const).map(tabName => {
                                const isSelected = currentTab === tabName;
                                const defaultTypeForTab = tabName === 'Class XII / Diploma' ? 'Class XII' : tabName as EducationData['type'];
                                // Disable tab if editing existing data that belongs to a different tab
                                const isTabDisabled = !!initialData && currentTab !== tabName;

                                return (
                                    <button
                                        key={tabName}
                                        type="button"
                                        disabled={isTabDisabled}
                                        onClick={() => handleTypeChange(defaultTypeForTab)}
                                        className={`flex-1 min-w-[max-content] px-3 py-2 text-sm font-medium rounded-lg transition-all ${isSelected
                                            ? 'bg-white text-emerald-700 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                            } ${isTabDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                                    >
                                        {tabName}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sub-selector for Class XII / Diploma */}
                    {currentTab === 'Class XII / Diploma' && (
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2">
                                Specific Type
                            </label>
                            <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                                {(['Class XII', 'Diploma'] as const).map(subType => (
                                    <button
                                        key={subType}
                                        type="button"
                                        disabled={!!initialData && initialData.type !== subType}
                                        onClick={() => handleTypeChange(subType)}
                                        className={`px-6 py-1.5 text-sm font-medium rounded-lg transition-all ${educationType === subType
                                            ? 'bg-white text-emerald-700 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                            } ${!!initialData && initialData.type !== subType ? 'opacity-40 cursor-not-allowed' : ''}`}
                                    >
                                        {subType}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentTab === 'Degree' || currentTab === 'Post Graduation' ? (
                        <>
                            {/* College/University */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">
                                    College / University
                                </label>
                                <input
                                    type="text"
                                    value={formData.institute}
                                    onChange={(e) => handleChange('institute', e.target.value)}
                                    placeholder="Ex: IIT Bombay"
                                    className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400"
                                />
                            </div>

                            {/* Degree & Stream */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">
                                        Degree
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.degree}
                                        onChange={(e) => handleChange('degree', e.target.value)}
                                        placeholder="Ex: B.Tech / M.Tech"
                                        className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">
                                        Stream
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.stream}
                                        onChange={(e) => handleChange('stream', e.target.value)}
                                        placeholder="Ex: CS"
                                        className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* School/Institute Name */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">
                                    {educationType === 'Diploma' ? 'Institute Name' : 'School Name'}
                                </label>
                                <input
                                    type="text"
                                    value={formData.institute}
                                    onChange={(e) => handleChange('institute', e.target.value)}
                                    placeholder={educationType === 'Diploma' ? "Ex: Government Polytechnic" : "Ex: St. Xavier's High School"}
                                    className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400"
                                />
                            </div>

                            {(educationType === 'Class XII' || educationType === 'Diploma') && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">
                                        Stream / Specialization
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.stream}
                                        onChange={(e) => handleChange('stream', e.target.value)}
                                        placeholder="Ex: Science (PCM), Commerce"
                                        className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400"
                                    />
                                </div>
                            )}

                            {/* Examination Board */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">
                                    Examination board
                                </label>
                                <input
                                    type="text"
                                    value={formData.board}
                                    onChange={(e) => handleChange('board', e.target.value)}
                                    placeholder="Ex: CBSE, ICSE, State Board"
                                    className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400"
                                />
                            </div>

                            {/* Medium of Study */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2">
                                    Medium of study
                                </label>
                                <input
                                    type="text"
                                    value={formData.medium}
                                    onChange={(e) => handleChange('medium', e.target.value)}
                                    placeholder="Ex: English, Hindi"
                                    className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:font-normal placeholder:text-gray-400"
                                />
                            </div>
                        </>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        {/* Ending Year */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2">
                                Ending Year
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.endingYear}
                                    onChange={(e) => handleChange('endingYear', e.target.value)}
                                    disabled={formData.isPursuing}
                                    className={`w-full p-3 pr-10 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white ${formData.isPursuing ? 'bg-gray-50 text-gray-400' : ''}`}
                                >
                                    <option value="">{formData.isPursuing ? 'Present' : 'Select Year'}</option>
                                    {!formData.isPursuing && years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        {/* Percentage */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2">
                                {currentTab === 'Degree' || currentTab === 'Post Graduation' ? 'CGPA / Percentage' : 'Percentage'}
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={formData.percentage}
                                    onChange={(e) => handleChange('percentage', e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                            </div>
                        </div>
                    </div>

                    {/* Pursuing Checkbox */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="pursuing"
                            checked={formData.isPursuing}
                            onChange={(e) => handleChange('isPursuing', e.target.checked)}
                            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        />
                        <label htmlFor="pursuing" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                            Currently pursuing
                        </label>
                    </div>



                    <div className="pt-2 flex justify-between items-center">
                        <div className="flex-1"></div>
                        <div className="flex gap-4 items-center">
                            <button
                                onClick={onClose}
                                className="text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (onSave) onSave({
                                        ...formData,
                                        type: educationType,
                                        endingYear: formData.isPursuing ? 'Present' : formData.endingYear,
                                        passingYear: formData.isPursuing ? 'Present' : formData.endingYear
                                    });
                                    clearDraft();
                                    onClose();
                                }}
                                className="bg-[#117a7a] hover:bg-[#0e6666] text-white text-sm font-bold py-2.5 px-8 rounded-lg transition-all shadow-lg shadow-emerald-900/10"
                            >
                                Save
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <p className="text-xs text-gray-400 flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-slate-400 text-white flex items-center justify-center text-[8px] font-bold">i</span>
                            You can edit later
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditEducationModal;
