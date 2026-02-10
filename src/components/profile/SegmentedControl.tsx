import React from 'react';

interface Option {
    value: string;
    label: string;
}

interface SegmentedControlProps {
    label: string;
    options: Option[];
    value?: string;
    onChange: (value: string) => void;
    required?: boolean;
    className?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
    label,
    options,
    value,
    onChange,
    required = false,
    className = '',
}) => {
    return (
        <div className={`w-full ${className}`}>
            <label className="block text-sm font-semibold mb-1.5 text-slate-700">
                {label}
                {required && <span className="text-primary ml-1">*</span>}
            </label>

            <div className="inline-flex bg-slate-100 rounded-2xl p-1 w-full">
                {options.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={`
              flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
              ${value === option.value
                                ? 'bg-primary text-white shadow-md'
                                : 'text-slate-600 hover:text-slate-900'
                            }
            `}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
