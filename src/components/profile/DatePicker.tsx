import React from 'react';
import { Calendar } from 'lucide-react';

interface DatePickerProps {
    label: string;
    name: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: 'date' | 'month';
    error?: string;
    required?: boolean;
    min?: string;
    max?: string;
    className?: string;
    disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
    label,
    name,
    value,
    onChange,
    type = 'date',
    error,
    required = false,
    min,
    max,
    className = '',
    disabled = false,
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
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />

                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    min={min}
                    max={max}
                    disabled={disabled}
                    className={`
            w-full bg-slate-50 border rounded-2xl py-2.5 pl-12 pr-4 text-slate-700 text-sm
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            transition-all cursor-pointer
            ${error ? 'border-red-300 focus:ring-red-100 focus:border-red-500' : 'border-slate-200'}
          `}
                />
            </div>

            {error && (
                <p className="mt-1.5 text-xs text-red-600">{error}</p>
            )}
        </div>
    );
};
