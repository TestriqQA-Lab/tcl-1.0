"use client";
import React, { useState, useEffect } from 'react';
import { Lightbulb, Plus } from 'lucide-react';
import EditSkillsModal from '../modals/EditSkillsModal';

const KeySkills = () => {
    const [skills, setSkills] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/profile/skills')
            .then(res => res.json())
            .then(json => {
                if (Array.isArray(json)) {
                    setSkills(json.map((s: { skillName: string }) => s.skillName));
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (newSkills: string[]) => {
        setSkills(newSkills);
        await fetch('/api/profile/skills', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skills: newSkills }),
        });
    };

    return (
        <div id="key-skills" className="bg-white rounded-2xl p-6 shadow-sm scroll-mt-28">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="text-emerald-700"><Lightbulb /></div>
                    <h2 className="text-lg font-bold text-gray-900">Key skills</h2>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-emerald-700 hover:text-emerald-800 text-sm font-medium px-3 py-1 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                    Edit
                </button>
            </div>

            {loading ? (
                <div className="flex flex-wrap gap-3 animate-pulse">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-8 bg-gray-200 rounded-full w-20" />
                    ))}
                </div>
            ) : (
                <div className="flex flex-wrap gap-3">
                    {skills.map((skill, index) => (
                        <span key={index} className="px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-sm font-medium border border-gray-100 hover:bg-gray-100 transition-colors cursor-default">
                            {skill}
                        </span>
                    ))}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 border border-emerald-600 text-emerald-700 rounded-full text-sm font-medium hover:bg-emerald-50 transition-colors flex items-center gap-1"
                    >
                        <Plus size={16} />
                        Add more
                    </button>
                </div>
            )}

            <EditSkillsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialSkills={skills}
                onSave={handleSave}
            />
        </div>
    );
};

export default KeySkills;
