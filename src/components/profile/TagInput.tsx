"use client";

import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface Tag {
    id: string;
    label: string;
    level?: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface TagInputProps {
    label: string;
    tags: Tag[];
    onAddTag: (tag: Tag) => void;
    onRemoveTag: (tagId: string) => void;
    placeholder?: string;
    showProficiency?: boolean;
    required?: boolean;
    className?: string;
}

const proficiencyColors = {
    Beginner: 'bg-blue-100 text-blue-700 border-blue-200',
    Intermediate: 'bg-green-100 text-green-700 border-green-200',
    Advanced: 'bg-purple-100 text-purple-700 border-purple-200',
};

export const TagInput: React.FC<TagInputProps> = ({
    label,
    tags,
    onAddTag,
    onRemoveTag,
    placeholder = 'Type and press Enter',
    showProficiency = false,
    required = false,
    className = '',
}) => {
    const [inputValue, setInputValue] = useState('');
    const [selectedLevel, setSelectedLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            const newTag: Tag = {
                id: Date.now().toString(),
                label: inputValue.trim(),
                ...(showProficiency && { level: selectedLevel }),
            };
            onAddTag(newTag);
            setInputValue('');
        }
    };

    return (
        <div className={`w-full ${className}`}>
            <label className="block text-sm font-semibold mb-1.5 text-slate-700">
                {label}
                {required && <span className="text-primary ml-1">*</span>}
            </label>

            {/* Tag Display */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag) => (
                        <span
                            key={tag.id}
                            className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border
                ${tag.level && proficiencyColors[tag.level] || 'bg-slate-100 text-slate-700 border-slate-200'}
              `}
                        >
                            {tag.label}
                            {tag.level && (
                                <span className="text-[10px] opacity-70">({tag.level})</span>
                            )}
                            <button
                                type="button"
                                onClick={() => onRemoveTag(tag.id)}
                                className="ml-1 hover:opacity-70 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Input Area */}
            <div className="flex gap-2">
                <div className="flex-1">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-4 text-slate-700 text-sm
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>

                {showProficiency && (
                    <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-4 text-slate-700 text-sm
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                    >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                )}
            </div>

            <p className="mt-1.5 text-xs text-slate-500">
                Press Enter to add {showProficiency && 'with proficiency level'}
            </p>
        </div>
    );
};
