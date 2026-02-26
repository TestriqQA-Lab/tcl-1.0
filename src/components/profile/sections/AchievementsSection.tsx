"use client";

import React from 'react';
import { SectionCard } from '../SectionCard';
import { FormInput } from '../FormInput';
import { DatePicker } from '../DatePicker';
import { Achievement } from '@/lib/profileTypes';
import { Plus, Trash2, Award, Trophy, Star, Code2 } from 'lucide-react';

interface AchievementsSectionProps {
    data: Achievement[];
    onChange: (data: Achievement[]) => void;
    isComplete?: boolean;
}

const achievementTypes = [
    { value: 'certification' as const, label: 'Certification', icon: Award, color: 'blue' },
    { value: 'award' as const, label: 'Award', icon: Trophy, color: 'yellow' },
    { value: 'academic' as const, label: 'Academic', icon: Star, color: 'purple' },
    { value: 'hackathon' as const, label: 'Hackathon', icon: Code2, color: 'green' },
];

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({
    data,
    onChange,
    isComplete = false,
}) => {
    const addAchievement = (type: Achievement['type']) => {
        onChange([
            ...data,
            {
                id: Date.now().toString(),
                type,
                title: '',
                organization: '',
                date: '',
                description: '',
            },
        ]);
    };

    const removeAchievement = (id: string) => {
        onChange(data.filter((ach) => ach.id !== id));
    };

    const updateAchievement = (id: string, updates: Partial<Achievement>) => {
        onChange(data.map((ach) => (ach.id === id ? { ...ach, ...updates } : ach)));
    };

    const getTypeInfo = (type: Achievement['type']) =>
        achievementTypes.find((t) => t.value === type) || achievementTypes[0];

    return (
        <SectionCard
            title="Achievements & Certifications"
            subtitle="Stand out with your accomplishments"
            isComplete={isComplete}
        >
            <div className="space-y-6">
                {/* Achievement Cards Grid */}
                {data.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {data.map((achievement) => {
                            const typeInfo = getTypeInfo(achievement.type);
                            const Icon = typeInfo.icon;

                            return (
                                <div
                                    key={achievement.id}
                                    className={`bg-gradient-to-br from-${typeInfo.color}-50 to-white p-5 rounded-2xl border border-${typeInfo.color}-200 relative`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`p-2 bg-${typeInfo.color}-100 rounded-lg`}>
                                            <Icon className={`w-5 h-5 text-${typeInfo.color}-600`} />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeAchievement(achievement.id)}
                                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <FormInput
                                            label="Title"
                                            name={`title-${achievement.id}`}
                                            value={achievement.title}
                                            onChange={(e) => updateAchievement(achievement.id, { title: e.target.value })}
                                            required
                                        />

                                        <FormInput
                                            label="Organization / Issuer"
                                            name={`org-${achievement.id}`}
                                            value={achievement.organization}
                                            onChange={(e) => updateAchievement(achievement.id, { organization: e.target.value })}
                                        />

                                        <DatePicker
                                            label="Date"
                                            name={`date-${achievement.id}`}
                                            type="month"
                                            value={achievement.date}
                                            onChange={(e) => updateAchievement(achievement.id, { date: e.target.value })}
                                        />

                                        <div>
                                            <label className="block text-sm font-semibold mb-1.5 text-slate-700">
                                                Description
                                            </label>
                                            <textarea
                                                value={achievement.description}
                                                onChange={(e) =>
                                                    updateAchievement(achievement.id, { description: e.target.value })
                                                }
                                                placeholder="Brief description..."
                                                rows={2}
                                                className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 px-4 text-slate-700 text-sm
                          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Add Achievement Buttons */}
                <div>
                    <p className="text-sm font-semibold text-slate-700 mb-3">Add Achievement:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {achievementTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => addAchievement(type.value)}
                                    className="p-4 border-2 border-dashed border-slate-300 rounded-2xl
                    hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center gap-2"
                                >
                                    <Icon className="w-6 h-6 text-primary" />
                                    <span className="text-sm font-semibold text-slate-700">{type.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                    <p className="text-sm text-yellow-800 flex items-start gap-2">
                        <span className="text-lg">🏆</span>
                        <span>Achievements boost your profile strength and catch recruiter attention</span>
                    </p>
                </div>
            </div>
        </SectionCard>
    );
};
