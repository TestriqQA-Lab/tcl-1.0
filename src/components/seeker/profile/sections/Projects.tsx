'use client';

import React, { useState, useEffect } from 'react';
import { Folder, Pencil, Trash2 } from 'lucide-react';
import SectionContainer from '../SectionContainer';
import EmptyState from '../EmptyState';
import EditProjectModal, { ProjectData } from '../modals/EditProjectModal';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

function dbToUi(row: any): ProjectData & { dbId: string } {
    return {
        dbId: row.id,
        title: row.title || '',
        startMonth: row.startMonth || '',
        startYear: row.startYear || '',
        endMonth: row.endMonth || '',
        endYear: row.endYear || '',
        description: row.description || '',
        keySkills: Array.isArray(row.technologies) ? row.technologies.join(', ') : '',
        projectUrl: row.url || '',
    };
}

const Projects = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projects, setProjects] = useState<(ProjectData & { dbId?: string })[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/profile/projects')
            .then(res => res.json())
            .then(json => {
                if (Array.isArray(json)) setProjects(json.map(dbToUi));
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (data: ProjectData) => {
        const editingItem = editingIndex !== null ? projects[editingIndex] : null;
        const dbId = (editingItem as any)?.dbId;

        if (dbId) {
            const res = await fetch('/api/profile/projects', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: dbId, ...data }),
            });
            const updated = await res.json();
            const newList = [...projects];
            newList[editingIndex!] = dbToUi(updated);
            setProjects(newList);
        } else {
            const res = await fetch('/api/profile/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const inserted = await res.json();
            setProjects(prev => [...prev, dbToUi(inserted)]);
        }
        setIsModalOpen(false);
        setEditingIndex(null);
    };

    const handleDelete = async (index: number) => {
        const item = projects[index] as any;
        if (item?.dbId) {
            await fetch(`/api/profile/projects?id=${item.dbId}`, { method: 'DELETE' });
        }
        setProjects(projects.filter((_, i) => i !== index));
    };

    const openAddModal = () => { setEditingIndex(null); setIsModalOpen(true); };
    const openEditModal = (index: number) => { setEditingIndex(index); setIsModalOpen(true); };

    return (
        <SectionContainer id="projects" title="Projects" icon={<Folder />} onAdd={projects.length > 0 ? openAddModal : undefined}>
            {loading ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-24 bg-gray-100 rounded-xl" />
                </div>
            ) : projects.length === 0 ? (
                <EmptyState
                    icon={<div className="text-3xl">🚀</div>}
                    title=""
                    description="Highlight your best work and personal projects."
                    actionText="Add Project"
                    onAction={openAddModal}
                />
            ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    {projects.map((project, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-emerald-200 transition-colors group">
                            <div className="flex justify-between items-start mb-2">
                                <div className="min-w-0 flex-1 pr-2">
                                    <h3 className="text-sm font-bold text-gray-900 truncate">{project.title}</h3>
                                    <span className="text-[10px] text-gray-400 block mt-0.5 whitespace-nowrap">
                                        {project.startMonth} {project.startYear} - {project.endMonth} {project.endYear}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => openEditModal(index)}
                                        className="text-gray-400 hover:text-emerald-600 p-1 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{project.description}</p>
                            {project.keySkills && (
                                <div className="flex flex-wrap gap-2">
                                    {project.keySkills.split(',').map((skill, i) => (
                                        <span key={i} className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-600">
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <EditProjectModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingIndex(null); }}
                initialData={editingIndex !== null ? projects[editingIndex] : undefined}
                onSave={handleSave}
            />
        </SectionContainer>
    );
};

export default Projects;
