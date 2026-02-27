import React from 'react';
import { Briefcase } from 'lucide-react';

interface TimelineItem {
    id: string;
    title: string;
    subtitle: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description?: string;
    bullets?: string[];
}

interface TimelineProps {
    items: TimelineItem[];
    className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({
    items,
    className = '',
}) => {
    return (
        <div className={`relative ${className}`}>
            {items.map((item, index) => (
                <div key={item.id} className="relative flex gap-6 pb-8 last:pb-0">
                    {/* Timeline Line */}
                    <div className="relative flex flex-col items-center">
                        {/* Dot */}
                        <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center z-10">
                            <Briefcase className="w-5 h-5 text-primary" />
                        </div>

                        {/* Vertical Line */}
                        {index < items.length - 1 && (
                            <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 -mt-1">
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                                    <p className="text-sm text-slate-600 mt-0.5">{item.subtitle}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                                        {item.startDate} - {item.current ? 'Present' : item.endDate}
                                    </span>
                                    {item.current && (
                                        <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                            Current
                                        </span>
                                    )}
                                </div>
                            </div>

                            {item.description && (
                                <p className="text-sm text-slate-600 mt-3">{item.description}</p>
                            )}

                            {item.bullets && item.bullets.length > 0 && (
                                <ul className="mt-3 space-y-1.5">
                                    {item.bullets.map((bullet, idx) => (
                                        <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                                            <span className="text-primary mt-1.5">•</span>
                                            <span>{bullet}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
