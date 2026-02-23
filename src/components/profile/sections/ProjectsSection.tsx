"use client";

import React from 'react';
import { SectionCard } from '../SectionCard';
import { FormInput } from '../FormInput';
import { SkillBadge } from '../SkillBadge';
import { Project } from '@/lib/profileTypes';
import { Plus, Trash2, Github, ExternalLink } from 'lucide-react';

interface ProjectsSectionProps {
    data: Project[];
    onChange: (data: Project[]) => void;
    isComplete?: boolean;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
    data,
    onChange,
    isComplete = false,
}) => {
    const addProject = () => {
        onChange([
            ...data,
            {
                id: Date.now().toString(),
                title: '',
                description: '',
                technologies: [],
                role: '',
                githubUrl: '',
                liveUrl: '',
                duration: '',
            },
        ]);
    };

    const removeProject = (id: string) => {
        onChange(data.filter((proj) => proj.id !== id));
    };

    const updateProject = (id: string, updates: Partial<Project>) => {
        onChange(data.map((proj) => (proj.id === id ? { ...proj, ...updates } : proj)));
    };

    const addTechnology = (id: string, tech: string) => {
        const project = data.find((p) => p.id === id);
        if (project && tech.trim() && !project.technologies.includes(tech.trim())) {
            updateProject(id, {
                technologies: [...project.technologies, tech.trim()],
            });
        }
    };

    const removeTechnology = (id: string, tech: string) => {
        const project = data.find((p) => p.id === id);
        if (project) {
            updateProject(id, {
                technologies: project.technologies.filter((t) => t !== tech),
            });
        }
    };

    return (
        <SectionCard
            title="Projects"
            subtitle="Showcase your work and technical expertise"
            isComplete={isComplete}
        >
            <div className="space-y-6">
                {/* Project Cards Grid */}
                {data.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 mb-6">
                        {data.map((project, index) => {
                            const [techInput, setTechInput] = React.useState('');

                            return (
                                <div
                                    key={project.id}
                                    className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-2xl border border-slate-200"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900 text-lg">
                                                {project.title || `Project #${index + 1}`}
                                            </h3>
                                            {project.description && (
                                                <p className="text-sm text-slate-600 mt-1">{project.description}</p>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeProject(project.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Technologies */}
                                    {project.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {project.technologies.map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                                                >
                                                    {tech}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTechnology(project.id, tech)}
                                                        className="ml-1 hover:opacity-70"
                                                    >
                                                        ✕
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Links */}
                                    {(project.githubUrl || project.liveUrl) && (
                                        <div className="flex flex-wrap gap-3 mb-4">
                                            {project.githubUrl && (
                                                <a
                                                    href={project.githubUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
                                                >
                                                    <Github className="w-3.5 h-3.5" />
                                                    GitHub
                                                </a>
                                            )}
                                            {project.liveUrl && (
                                                <a
                                                    href={project.liveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                    Live Demo
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    {/* Form Fields */}
                                    <div className="space-y-4 pt-4 border-t border-slate-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormInput
                                                label="Project Title"
                                                name={`title-${project.id}`}
                                                value={project.title}
                                                onChange={(e) => updateProject(project.id, { title: e.target.value })}
                                                required
                                            />

                                            <FormInput
                                                label="Your Role"
                                                name={`role-${project.id}`}
                                                value={project.role}
                                                onChange={(e) => updateProject(project.id, { role: e.target.value })}
                                                placeholder="e.g. Full Stack Developer"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-1.5 text-slate-700">
                                                Description
                                            </label>
                                            <textarea
                                                value={project.description}
                                                onChange={(e) => updateProject(project.id, { description: e.target.value })}
                                                placeholder="Describe the project, its goals, and your contributions..."
                                                rows={3}
                                                className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 px-4 text-slate-700 text-sm
                          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-1.5 text-slate-700">
                                                Technologies Used
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={techInput}
                                                    onChange={(e) => setTechInput(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            addTechnology(project.id, techInput);
                                                            setTechInput('');
                                                        }
                                                    }}
                                                    placeholder="e.g. React, Node.js (press Enter)"
                                                    className="flex-1 bg-white border border-slate-200 rounded-2xl py-2.5 px-4 text-slate-700 text-sm
                            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        addTechnology(project.id, techInput);
                                                        setTechInput('');
                                                    }}
                                                    className="px-6 py-2.5 bg-primary text-white rounded-2xl font-semibold text-sm hover:opacity-90 transition-opacity"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <FormInput
                                                label="GitHub URL"
                                                name={`github-${project.id}`}
                                                type="url"
                                                value={project.githubUrl}
                                                onChange={(e) => updateProject(project.id, { githubUrl: e.target.value })}
                                                leftIcon={Github}
                                            />

                                            <FormInput
                                                label="Live Project URL"
                                                name={`live-${project.id}`}
                                                type="url"
                                                value={project.liveUrl}
                                                onChange={(e) => updateProject(project.id, { liveUrl: e.target.value })}
                                                leftIcon={ExternalLink}
                                            />

                                            <FormInput
                                                label="Duration"
                                                name={`duration-${project.id}`}
                                                value={project.duration}
                                                onChange={(e) => updateProject(project.id, { duration: e.target.value })}
                                                placeholder="e.g. 3 months"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Add Project Button */}
                <button
                    type="button"
                    onClick={addProject}
                    className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl
            text-primary font-semibold hover:border-primary hover:bg-primary/5 transition-all
            flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Project
                </button>

                <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-2xl">
                    <p className="text-sm text-purple-800 flex items-start gap-2">
                        <span className="text-lg">💡</span>
                        <span>Projects are especially important for freshers - showcase your best work!</span>
                    </p>
                </div>
            </div>
        </SectionCard>
    );
};
