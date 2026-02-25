"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SmartSuggestProps {
    suggestions: string[];
    onSelect: (suggestion: string) => void;
    placeholder?: string;
    icon?: React.ReactNode;
    className?: string;
    showIcon?: boolean;
}

export const SmartSuggest: React.FC<SmartSuggestProps> = ({
    suggestions,
    onSelect,
    placeholder = 'Type to see suggestions...',
    icon,
    className = '',
    showIcon = true,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setFilteredSuggestions(suggestions);
    }, [suggestions]);

    useEffect(() => {
        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex((prev) =>
                    prev < filteredSuggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredSuggestions[highlightedIndex]) {
                    onSelect(filteredSuggestions[highlightedIndex]);
                    setIsOpen(false);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Suggestions Available Indicator */}
            {showIcon && suggestions.length > 0 && (
                <motion.div
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                    <motion.div
                        animate={{
                            rotate: [0, 10, -10, 10, 0],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: 'easeInOut',
                        }}
                    >
                        <Sparkles className="w-5 h-5 text-primary" />
                    </motion.div>
                </motion.div>
            )}

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && filteredSuggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-64 overflow-y-auto"
                    >
                        <div className="p-2">
                            <p className="text-xs font-semibold text-slate-500 px-3 py-2 flex items-center gap-2">
                                <Sparkles className="w-3 h-3" />
                                Smart Suggestions
                            </p>
                            {filteredSuggestions.map((suggestion, index) => (
                                <motion.button
                                    key={index}
                                    type="button"
                                    onClick={() => {
                                        onSelect(suggestion);
                                        setIsOpen(false);
                                    }}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${index === highlightedIndex
                                            ? 'bg-primary/10 text-primary font-medium'
                                            : 'text-slate-700 hover:bg-slate-50'
                                        }`}
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {suggestion}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Helper component for quick add chips
interface QuickAddChipsProps {
    suggestions: string[];
    onAdd: (suggestion: string) => void;
    title?: string;
}

export const QuickAddChips: React.FC<QuickAddChipsProps> = ({
    suggestions,
    onAdd,
    title = 'Quick Add:',
}) => {
    const [added, setAdded] = useState<Set<string>>(new Set());

    const handleAdd = (suggestion: string) => {
        onAdd(suggestion);
        setAdded(new Set(added).add(suggestion));

        // Remove from added after animation
        setTimeout(() => {
            setAdded((prev) => {
                const newSet = new Set(prev);
                newSet.delete(suggestion);
                return newSet;
            });
        }, 1000);
    };

    return (
        <div className="mt-4">
            <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-primary" />
                {title}
            </p>
            <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                    <motion.button
                        key={index}
                        type="button"
                        onClick={() => handleAdd(suggestion)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${added.has(suggestion)
                                ? 'bg-green-100 text-green-700 border-2 border-green-300'
                                : 'bg-slate-100 text-slate-700 border-2 border-slate-200 hover:border-primary hover:bg-primary/5 hover:text-primary'
                            }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        {added.has(suggestion) ? '✓ Added' : `+ ${suggestion}`}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};
