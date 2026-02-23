import React from 'react';

interface ProgressBarProps {
    percentage: number;
    className?: string;
    showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    percentage,
    className = '',
    showLabel = true,
}) => {
    const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

    const getColor = () => {
        if (clampedPercentage < 30) return 'bg-red-500';
        if (clampedPercentage < 60) return 'bg-yellow-500';
        if (clampedPercentage < 90) return 'bg-blue-500';
        return 'bg-green-500';
    };

    return (
        <div className={`w-full ${className}`}>
            {showLabel && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700">Profile Completion</span>
                    <span className="text-sm font-bold text-primary">{clampedPercentage}%</span>
                </div>
            )}

            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`h-full ${getColor()} transition-all duration-500 ease-out rounded-full`}
                    style={{ width: `${clampedPercentage}%` }}
                ></div>
            </div>
        </div>
    );
};
