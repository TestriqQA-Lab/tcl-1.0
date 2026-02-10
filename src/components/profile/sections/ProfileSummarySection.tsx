"use client";

import React from 'react';
import { SectionCard } from '../SectionCard';
import { ProfileSummaryData } from '@/lib/profileTypes';
import { FileText } from 'lucide-react';

interface ProfileSummarySectionProps {
    data: ProfileSummaryData;
    onChange: (data: ProfileSummaryData) => void;
    isComplete?: boolean;
}

const MAX_CHARS = 500;

export const ProfileSummarySection: React.FC<ProfileSummarySectionProps> = ({
    data,
    onChange,
    isComplete = false,
}) => {
    const charCount = data.summary.length;
    const remaining = MAX_CHARS - charCount;

    return (
        <SectionCard
            title="Profile Summary"
            subtitle="Most read section by employers - make it count!"
            isComplete={isComplete}
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold mb-1.5 text-slate-700 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Professional Summary <span className="text-primary">*</span>
                    </label>

                    <textarea
                        value={data.summary}
                        onChange={(e) => {
                            if (e.target.value.length <= MAX_CHARS) {
                                onChange({ summary: e.target.value });
                            }
                        }}
                        placeholder="Example:&#10;AI & Data Science enthusiast with hands-on experience in React, Firebase, and ML-based projects. Passionate about building scalable web applications and solving complex problems through technology. Strong foundation in algorithms and data structures with proven ability to deliver quality solutions."
                        rows={6}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-slate-700 text-sm
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />

                    <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-slate-500">
                            Keep it concise (3-5 lines). Focus on skills, experience, and career goals.
                        </p>
                        <span className={`text-xs font-medium ${remaining < 50 ? 'text-orange-600' : 'text-slate-500'}`}>
                            {charCount} / {MAX_CHARS}
                        </span>
                    </div>
                </div>

                {/* Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                    <h4 className="font-semibold text-blue-900 text-sm mb-2">💡 Tips for a great summary:</h4>
                    <ul className="space-y-1 text-xs text-blue-800">
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Start with your current role or field of expertise</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Highlight your top 3-5 skills</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Mention your career goals or what you're looking for</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Keep it specific and avoid generic statements</span>
                        </li>
                    </ul>
                </div>
            </div>
        </SectionCard>
    );
};
