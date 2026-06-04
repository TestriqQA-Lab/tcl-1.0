import React from 'react';

interface SkillBadgeProps {
    skill: string;
    level?: 'Beginner' | 'Intermediate' | 'Advanced';
    className?: string;
}

const levelColors = {
    Beginner: 'bg-blue-100 text-blue-700 border-blue-200',
    Intermediate: 'bg-green-100 text-green-700 border-green-200',
    Advanced: 'bg-purple-100 text-purple-700 border-purple-200',
};

export const SkillBadge: React.FC<SkillBadgeProps> = ({
    skill,
    level,
    className = '',
}) => {
    return (
        <span
            className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border
        ${level ? levelColors[level] : 'bg-slate-100 text-slate-700 border-slate-200'}
        ${className}
      `}
        >
            {skill}
            {level && (
                <span className="text-[10px] opacity-70">({level})</span>
            )}
        </span>
    );
};
