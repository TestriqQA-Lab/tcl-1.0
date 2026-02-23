import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormInputProps {
    label: string;
    name: string;
    type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'url';
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    helperText?: string;
    required?: boolean;
    disabled?: boolean;
    leftIcon?: LucideIcon;
    rightIcon?: LucideIcon;
    className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
    label,
    name,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    helperText,
    required = false,
    disabled = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
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
                {LeftIcon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <LeftIcon className="w-5 h-5 text-slate-400" />
                    </div>
                )}

                <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`
            w-full bg-slate-50 border rounded-2xl py-2.5 px-4 text-slate-700 text-sm
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            transition-all
            ${LeftIcon ? 'pl-12' : ''}
            ${RightIcon ? 'pr-12' : ''}
            ${error ? 'border-red-300 focus:ring-red-100 focus:border-red-500' : 'border-slate-200'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
                />

                {RightIcon && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <RightIcon className="w-5 h-5 text-slate-400" />
                    </div>
                )}
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
