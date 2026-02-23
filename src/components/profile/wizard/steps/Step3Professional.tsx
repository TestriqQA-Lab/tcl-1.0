"use client";

import React from 'react';
import { SegmentedControl } from '@/components/profile/SegmentedControl';
import { FormSelect } from '@/components/profile/FormSelect';
import { WizardChildProps } from '@/components/profile/wizard/ProfileWizard';
import { QuickAddChips } from '@/components/profile/smart/SmartSuggest';
import { motion, AnimatePresence } from 'framer-motion';

export const Step3Professional: React.FC<WizardChildProps> = ({ profileData, updateData }) => {
    const data = profileData.professionalStatus || {
        workStatus: 'fresher',
        lookingFor: [],
        employmentStatus: '',
        availability: '',
        preferredWorkTypes: [],
        preferredModes: [],
    };

    const toggleArrayValue = (array: string[], value: string) => {
        if (array.includes(value)) {
            return array.filter((item) => item !== value);
        }
        return [...array, value];
    };

    return (
        <div className="space-y-6">
            <SegmentedControl
                label="Work Status"
                options={[
                    { value: 'fresher', label: 'Fresher' },
                    { value: 'experienced', label: 'Experienced' },
                ]}
                value={data.workStatus}
                onChange={(value) =>
                    updateData({ professionalStatus: { ...data, workStatus: value as 'fresher' | 'experienced' } })
                }
                required
            />

            <AnimatePresence mode="wait">
                {data.workStatus === 'fresher' && (
                    <motion.div
                        key="fresher"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-slate-50 p-4 rounded-lg border border-slate-200"
                    >
                        <p className="text-sm text-slate-700 mb-3">
                            We will optimize your profile for internships and entry-level positions.
                        </p>
                        <QuickAddChips
                            title="Recommended roles:"
                            suggestions={['Internship', 'Entry-level Jobs', 'Fresher Roles']}
                            onAdd={(item) =>
                                updateData({
                                    professionalStatus: { ...data, lookingFor: [...data.lookingFor, item] },
                                })
                            }
                        />
                    </motion.div>
                )}

                {data.workStatus === 'experienced' && (
                    <motion.div
                        key="experienced"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-slate-50 p-4 rounded-lg border border-slate-200"
                    >
                        <p className="text-sm text-slate-700 mb-3">
                            We will tailor job recommendations for mid-level and senior positions.
                        </p>
                        <QuickAddChips
                            title="Popular engagement types:"
                            suggestions={['Full-time', 'Contract', 'Senior Roles']}
                            onAdd={(item) =>
                                updateData({
                                    professionalStatus: { ...data, preferredWorkTypes: [...data.preferredWorkTypes, item] },
                                })
                            }
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <FormSelect
                label="Availability / Notice Period"
                name="availability"
                options={[
                    { value: 'immediate', label: 'Immediate' },
                    { value: '15days', label: '15 days' },
                    { value: '30days', label: '30 days' },
                    { value: '60days', label: '60 days' },
                ]}
                value={data.availability}
                onChange={(e) => updateData({ professionalStatus: { ...data, availability: e.target.value } })}
                required
            />
        </div>
    );
};
