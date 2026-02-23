"use client";

import React from 'react';
import { SectionCard } from '../SectionCard';
import { FileUpload } from '../FileUpload';
import { FormInput } from '../FormInput';
import { ResumeLinksData } from '@/lib/profileTypes';
import { FileText, Globe, Github, Linkedin, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';

interface ResumeLinksSectionProps {
    data: ResumeLinksData;
    onChange: (data: ResumeLinksData) => void;
    isComplete?: boolean;
}

export const ResumeLinksSection: React.FC<ResumeLinksSectionProps> = ({
    data,
    onChange,
    isComplete = false,
}) => {
    const [newLinkLabel, setNewLinkLabel] = React.useState('');
    const [newLinkUrl, setNewLinkUrl] = React.useState('');

    const addOtherLink = () => {
        if (newLinkLabel.trim() && newLinkUrl.trim()) {
            onChange({
                ...data,
                otherLinks: [
                    ...data.otherLinks,
                    {
                        id: Date.now().toString(),
                        label: newLinkLabel.trim(),
                        url: newLinkUrl.trim(),
                    },
                ],
            });
            setNewLinkLabel('');
            setNewLinkUrl('');
        }
    };

    const removeOtherLink = (id: string) => {
        onChange({
            ...data,
            otherLinks: data.otherLinks.filter((link) => link.id !== id),
        });
    };

    return (
        <SectionCard
            title="Resume & Professional Links"
            subtitle="Essential documents and online presence"
            isComplete={isComplete}
        >
            <div className="space-y-6">
                {/* Resume Upload */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-200">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-green-600" />
                        <h3 className="font-bold text-slate-900">Resume / CV</h3>
                        <span className="text-primary text-xs font-semibold">*Required</span>
                    </div>
                    <FileUpload
                        label=""
                        accept=".pdf,.doc,.docx"
                        maxSize={10}
                        currentFile={data.resume}
                        onFileSelect={(file) => onChange({ ...data, resume: file })}
                        helperText="PDF, DOC, DOCX up to 10MB"
                    />
                </div>

                {/* Professional Links */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <LinkIcon className="w-5 h-5 text-primary" />
                        Professional Links
                    </h3>

                    <FormInput
                        label="Portfolio Website"
                        name="portfolio"
                        type="url"
                        placeholder="https://yourportfolio.com"
                        value={data.portfolioUrl}
                        onChange={(e) => onChange({ ...data, portfolioUrl: e.target.value })}
                        leftIcon={Globe}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            label="GitHub Profile"
                            name="github"
                            type="url"
                            placeholder="https://github.com/username"
                            value={data.githubUrl}
                            onChange={(e) => onChange({ ...data, githubUrl: e.target.value })}
                            leftIcon={Github}
                        />

                        <FormInput
                            label="LinkedIn Profile"
                            name="linkedin"
                            type="url"
                            placeholder="https://linkedin.com/in/username"
                            value={data.linkedinUrl}
                            onChange={(e) => onChange({ ...data, linkedinUrl: e.target.value })}
                            leftIcon={Linkedin}
                        />
                    </div>
                </div>

                {/* Other Links */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-3">Other Links</h3>
                    <p className="text-sm text-slate-600 mb-4">
                        Add links to your blog, Kaggle, Behance, Medium, or any other professional profiles
                    </p>

                    {/* Existing Links */}
                    {data.otherLinks.length > 0 && (
                        <div className="space-y-2 mb-4">
                            {data.otherLinks.map((link) => (
                                <div
                                    key={link.id}
                                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200"
                                >
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900 text-sm">{link.label}</p>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-primary hover:underline"
                                        >
                                            {link.url}
                                        </a>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeOtherLink(link.id)}
                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add New Link */}
                    <div className="space-y-3">
                        <FormInput
                            label=""
                            name="newLinkLabel"
                            placeholder="Link label (e.g., Kaggle, Blog)"
                            value={newLinkLabel}
                            onChange={(e) => setNewLinkLabel(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <FormInput
                                label=""
                                name="newLinkUrl"
                                type="url"
                                placeholder="https://..."
                                value={newLinkUrl}
                                onChange={(e) => setNewLinkUrl(e.target.value)}
                                className="flex-1"
                            />
                            <button
                                type="button"
                                onClick={addOtherLink}
                                disabled={!newLinkLabel.trim() || !newLinkUrl.trim()}
                                className="px-6 py-2.5 bg-primary text-white rounded-2xl font-semibold text-sm 
                  hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center gap-2 whitespace-nowrap"
                            >
                                <Plus className="w-4 h-4" />
                                Add Link
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-2xl">
                    <p className="text-sm text-green-800 flex items-start gap-2">
                        <span className="text-lg">✅</span>
                        <span>Add your professional links to increase credibility and showcase your work</span>
                    </p>
                </div>
            </div>
        </SectionCard>
    );
};
