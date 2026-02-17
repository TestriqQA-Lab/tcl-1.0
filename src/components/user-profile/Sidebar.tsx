'use client';

import React, { useState, useEffect } from 'react';

const sections = [
    { id: 'preferences', label: 'Preference', icon: 'sliders-horizontal' },
    { id: 'education', label: 'Education', icon: 'graduation-cap' },
    { id: 'key-skills', label: 'Key skills', icon: 'lightbulb' },
    { id: 'languages', label: 'Languages', icon: 'languages' },
    { id: 'internships', label: 'Internships', icon: 'briefcase' },
    { id: 'projects', label: 'Projects', icon: 'folder' },
    { id: 'profile-summary', label: 'Profile summary', icon: 'file-text' },
    { id: 'accomplishments', label: 'Accomplishments', icon: 'trophy' },
    { id: 'competitive-exams', label: 'Competitive exams', icon: 'clipboard-list' },
    { id: 'employment', label: 'Employment', icon: 'building-2' },
    { id: 'academic-achievements', label: 'Academic achievements', icon: 'medal' },
    { id: 'resume', label: 'Resume', icon: 'file-user' },
];

// Map for icons to Lucide components later. For now using text/simple SVG if needed or just labels
// I will import lucide-react icons in the next refinement step for better visual fidelity.
import {
    SlidersHorizontal, GraduationCap, Lightbulb, Languages, Briefcase,
    Folder, FileText, Trophy, ClipboardList, Building2, Medal, FileUser
} from 'lucide-react';

const iconMap: any = {
    'sliders-horizontal': SlidersHorizontal,
    'graduation-cap': GraduationCap,
    'lightbulb': Lightbulb,
    'languages': Languages,
    'briefcase': Briefcase,
    'folder': Folder,
    'file-text': FileText,
    'trophy': Trophy,
    'clipboard-list': ClipboardList,
    'building-2': Building2,
    'medal': Medal,
    'file-user': FileUser,
};


const Sidebar = () => {
    const [activeSection, setActiveSection] = useState('preferences');

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            // Offset for sticky header if any, or just smooth scroll
            const offset = 100; // Adjust based on navbar height
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="bg-transparent lg:bg-white rounded-2xl p-0 lg:p-4 shadow-none lg:shadow-sm w-full overflow-x-auto lg:overflow-visible no-scrollbar">
            <h3 className="hidden lg:block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                Profile Sections
            </h3>
            <nav className="flex lg:flex-col gap-3 lg:gap-1 min-w-max lg:min-w-0 px-1 lg:px-0 py-2 lg:py-0">
                {sections.map((section) => {
                    const Icon = iconMap[section.icon] || FileText; // Fallback
                    const isActive = activeSection === section.id;

                    return (
                        <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={`flex items-center gap-2 lg:gap-3 px-5 py-2 lg:px-3 lg:py-2.5 text-sm lg:text-sm font-medium rounded-full lg:rounded-lg transition-all duration-200 whitespace-nowrap shadow-sm lg:shadow-none
                                ${isActive
                                    ? 'bg-[#0f766d] text-white lg:bg-emerald-50 lg:text-emerald-700 lg:ring-0'
                                    : 'bg-white text-gray-600 border border-gray-200 lg:border-0 lg:bg-transparent lg:hover:bg-gray-50 lg:hover:text-gray-900'
                                }`}
                        >
                            <Icon size={16} className={`hidden lg:block lg:w-[18px] lg:h-[18px] ${isActive ? 'lg:text-emerald-600' : 'text-gray-400'}`} />
                            {section.label}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default Sidebar;
