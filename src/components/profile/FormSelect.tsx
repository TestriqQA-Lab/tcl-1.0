import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FormSelectProps {
    label: string;
    name: string;
    options: { value: string; label: string }[];
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
    helperText?: string;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
    label,
    name,
    options,
    value,
    onChange,
    error,
    helperText,
    required = false,
    disabled = false,
    placeholder = 'Select an option',
    className = '',
}) => {
    return (
        <div className={`w-full ${className}`}>
            <label
                htmlFor={name}
                className="block text-sm font-semibold mb-1.5 text-slate-700"
            >
                {label}
                {required && <span className="text-primary ml-1">*</span>}
            </label>

            <div className="relative">
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`
            w-full appearance-none bg-slate-50 border rounded-2xl py-2.5 pl-4 pr-10 
            text-slate-700 text-sm cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            transition-all
            ${error ? 'border-red-300 focus:ring-red-100 focus:border-red-500' : 'border-slate-200'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
                >
                    <option value="" disabled>{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <ChevronDown className="text-slate-400 w-4 h-4" />
                </div>
            </div>

            {error && (
                <p className="mt-1.5 text-xs text-red-600">{error}</p>
            )}

            {helperText && !error && (
                <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
            )}
        </div>
    );
};
