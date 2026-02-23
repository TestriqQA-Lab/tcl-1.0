import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface SectionCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    isComplete?: boolean;
    className?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
    title,
    subtitle,
    children,
    isComplete = false,
    className = '',
}) => {
    return (
        <div className={`bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
            {/* Section Header */}
            <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-5 border-b border-slate-100">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                            {title}
                            {isComplete && (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                            )}
                            {!isComplete && (
                                <Circle className="w-5 h-5 text-slate-300" />
                            )}
                        </h2>
                        {subtitle && (
                            <p className="text-sm text-slate-500">{subtitle}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Section Content */}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};
