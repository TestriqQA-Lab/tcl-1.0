"use client";

import React from 'react';
import { SectionCard } from '../SectionCard';
import { TagInput } from '../TagInput';
import { SkillsData, Tag } from '@/lib/profileTypes';
import { Code, Wrench, Languages } from 'lucide-react';

interface SkillsSectionProps {
    data: SkillsData;
    onChange: (data: SkillsData) => void;
    isComplete?: boolean;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
    data,
    onChange,
    isComplete = false,
}) => {
    const [newLanguage, setNewLanguage] = React.useState('');
    const [languageSkills, setLanguageSkills] = React.useState({
        read: false,
        write: false,
        speak: false,
    });

    const addLanguage = () => {
        if (newLanguage.trim()) {
            onChange({
                ...data,
                languages: [
                    ...data.languages,
                    {
                        language: newLanguage.trim(),
                        ...languageSkills,
                    },
                ],
            });
            setNewLanguage('');
            setLanguageSkills({ read: false, write: false, speak: false });
        }
    };

    const removeLanguage = (index: number) => {
        onChange({
            ...data,
            languages: data.languages.filter((_, i) => i !== index),
        });
    };

    return (
        <SectionCard
            title="Skills & Expertise"
            subtitle="Show employers what you're great at"
            isComplete={isComplete}
        >
            <div className="space-y-6">
                {/* Key Skills */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-200">
                    <div className="flex items-center gap-2 mb-4">
                        <Code className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-slate-900">Key Skills</h3>
                    </div>
                    <TagInput
                        label=""
                        tags={data.keySkills}
                        onAddTag={(tag) => onChange({ ...data, keySkills: [...data.keySkills, tag] })}
                        onRemoveTag={(id) =>
                            onChange({ ...data, keySkills: data.keySkills.filter((t) => t.id !== id) })
                        }
                        placeholder="e.g. Problem Solving, Leadership"
                        required
                    />
                </div>

                {/* Technical Skills with Proficiency */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-2xl border border-purple-200">
                    <div className="flex items-center gap-2 mb-4">
                        <Code className="w-5 h-5 text-purple-600" />
                        <h3 className="font-bold text-slate-900">Technical Skills</h3>
                    </div>
                    <TagInput
                        label=""
                        tags={data.technicalSkills}
                        onAddTag={(tag) =>
                            onChange({ ...data, technicalSkills: [...data.technicalSkills, tag] })
                        }
                        onRemoveTag={(id) =>
                            onChange({ ...data, technicalSkills: data.technicalSkills.filter((t) => t.id !== id) })
                        }
                        placeholder="e.g. JavaScript, Python, React"
                        showProficiency
                    />
                    <p className="mt-2 text-xs text-slate-600">
                        💡 Adding proficiency levels helps recruiters understand your expertise
                    </p>
                </div>

                {/* Tools & Technologies */}
                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-5 rounded-2xl border border-green-200">
                    <div className="flex items-center gap-2 mb-4">
                        <Wrench className="w-5 h-5 text-green-600" />
                        <h3 className="font-bold text-slate-900">Tools & Technologies</h3>
                    </div>
                    <TagInput
                        label=""
                        tags={data.tools}
                        onAddTag={(tag) => onChange({ ...data, tools: [...data.tools, tag] })}
                        onRemoveTag={(id) => onChange({ ...data, tools: data.tools.filter((t) => t.id !== id) })}
                        placeholder="e.g. Git, Docker, VS Code"
                    />
                </div>

                {/* Languages Known */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2 mb-4">
                        <Languages className="w-5 h-5 text-slate-600" />
                        <h3 className="font-bold text-slate-900">Languages Known</h3>
                    </div>

                    {/* Language List */}
                    {data.languages.length > 0 && (
                        <div className="mb-4 space-y-3">
                            {data.languages.map((lang, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200"
                                >
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900">{lang.language}</p>
                                        <div className="flex gap-2 mt-1">
                                            {lang.read && (
                                                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                                    Read
                                                </span>
                                            )}
                                            {lang.write && (
                                                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                                    Write
                                                </span>
                                            )}
                                            {lang.speak && (
                                                <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                                                    Speak
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeLanguage(index)}
                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add Language */}
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={newLanguage}
                            onChange={(e) => setNewLanguage(e.target.value)}
                            placeholder="Language name"
                            className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 px-4 text-slate-700 text-sm
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />

                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={languageSkills.read}
                                    onChange={(e) => setLanguageSkills({ ...languageSkills, read: e.target.checked })}
                                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                                />
                                <span className="text-sm text-slate-700">Read</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={languageSkills.write}
                                    onChange={(e) => setLanguageSkills({ ...languageSkills, write: e.target.checked })}
                                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                                />
                                <span className="text-sm text-slate-700">Write</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={languageSkills.speak}
                                    onChange={(e) => setLanguageSkills({ ...languageSkills, speak: e.target.checked })}
                                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                                />
                                <span className="text-sm text-slate-700">Speak</span>
                            </label>
                        </div>

                        <button
                            type="button"
                            onClick={addLanguage}
                            disabled={!newLanguage.trim()}
                            className="w-full px-6 py-2.5 bg-primary text-white rounded-2xl font-semibold text-sm 
                hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add Language
                        </button>
                    </div>
                </div>
            </div>
        </SectionCard>
    );
};
