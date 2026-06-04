"use client";

import React, { useState, useEffect } from 'react';
import { TagInput } from '@/components/profile/TagInput';
import { QuickAddChips } from '@/components/profile/smart/SmartSuggest';
import { WizardChildProps } from '@/components/profile/wizard/ProfileWizard';
import { Tag } from '@/lib/profileTypes';
import { getSkillSuggestions, suggestJobTitles } from '@/lib/suggestionData';
import { Code, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Step5Skills: React.FC<WizardChildProps> = ({ profileData, updateData }) => {
    const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]);
    const [suggestedRoles, setSuggestedRoles] = useState<string[]>([]);

    const data = profileData.skills || {
        keySkills: [],
        technicalSkills: [],
        tools: [],
        languages: [],
    };

    // Generate smart suggestions based on added skills
    useEffect(() => {
        const allSkills = [
            ...data.keySkills.map((s) => s.label),
            ...data.technicalSkills.map((s) => s.label),
        ];

        if (allSkills.length > 0) {
            const lastSkill = allSkills[allSkills.length - 1];
            const suggestions = getSkillSuggestions(lastSkill);

            // Filter out already added skills
            const filteredSuggestions = suggestions.filter(
                (s) => !allSkills.map((sk) => sk.toLowerCase()).includes(s.toLowerCase())
            ).slice(0, 5);

            setSmartSuggestions(filteredSuggestions);

            // Suggest job roles
            const roles = suggestJobTitles(allSkills);
            setSuggestedRoles(roles.slice(0, 3));
        } else {
            setSmartSuggestions([]);
            setSuggestedRoles([]);
        }
    }, [data.keySkills, data.technicalSkills]);

    return (
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
                    onAddTag={(tag) => updateData({ skills: { ...data, keySkills: [...data.keySkills, tag] } })}
                    onRemoveTag={(id) =>
                        updateData({ skills: { ...data, keySkills: data.keySkills.filter((t) => t.id !== id) } })
                    }
                    placeholder="e.g. Problem Solving, Leadership"
                />
            </div>

            {/* Technical Skills */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-2xl border border-purple-200">
                <div className="flex items-center gap-2 mb-4">
                    <Code className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-slate-900">Technical Skills</h3>
                </div>
                <TagInput
                    label=""
                    tags={data.technicalSkills}
                    onAddTag={(tag) =>
                        updateData({ skills: { ...data, technicalSkills: [...data.technicalSkills, tag] } })
                    }
                    onRemoveTag={(id) =>
                        updateData({ skills: { ...data, technicalSkills: data.technicalSkills.filter((t) => t.id !== id) } })
                    }
                    placeholder="e.g. JavaScript, Python"
                    showProficiency
                />
            </div>

            {/* Smart Suggestions */}
            {/* Smart Suggestions */}
            <AnimatePresence>
                {smartSuggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-slate-50 p-4 rounded-lg border border-slate-200"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-4 h-4 text-slate-600" />
                            <h4 className="font-semibold text-slate-800 text-sm">Suggested Skills</h4>
                        </div>
                        <QuickAddChips
                            title=""
                            suggestions={smartSuggestions}
                            onAdd={(skill) => {
                                const newTag: Tag = {
                                    id: Date.now().toString(),
                                    label: skill,
                                    level: 'Intermediate' as const,
                                };
                                updateData({
                                    skills: { ...data, technicalSkills: [...data.technicalSkills, newTag] },
                                });
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Role Suggestions */}
            <AnimatePresence>
                {suggestedRoles.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-slate-50 p-4 rounded-lg border border-slate-200"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-4 h-4 text-slate-600" />
                            <h4 className="font-semibold text-slate-800 text-sm">Matched Roles</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {suggestedRoles.map((role, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-700 border border-slate-300"
                                >
                                    {role}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
