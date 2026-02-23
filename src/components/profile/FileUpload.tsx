"use client";

import React, { useState, useRef } from 'react';
import { Upload, X, File, Check } from 'lucide-react';

interface FileUploadProps {
    label: string;
    accept?: string;
    maxSize?: number; // in MB
    onFileSelect: (file: File | null) => void;
    currentFile?: File | null;
    required?: boolean;
    className?: string;
    showPreview?: boolean;
    helperText?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
    label,
    accept = '*',
    maxSize = 10,
    onFileSelect,
    currentFile,
    required = false,
    className = '',
    showPreview = false,
    helperText,
}) => {
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string>('');
    const [preview, setPreview] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        setError('');

        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
            setError(`File size must be less than ${maxSize}MB`);
            return;
        }

        // Generate preview for images
        if (showPreview && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }

        onFileSelect(file);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleRemove = () => {
        setPreview('');
        onFileSelect(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className={`w-full ${className}`}>
            <label className="block text-sm font-semibold mb-1.5 text-slate-700">
                {label}
                {required && <span className="text-primary ml-1">*</span>}
            </label>

            {currentFile ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {preview ? (
                            <img src={preview} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <File className="w-6 h-6 text-primary" />
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-medium text-slate-700">{currentFile.name}</p>
                            <p className="text-xs text-slate-500">
                                {(currentFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4 text-slate-400" />
                    </button>
                </div>
            ) : (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`
            border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center 
            text-center cursor-pointer transition-all group
            ${dragActive
                            ? 'border-primary bg-primary/5'
                            : error
                                ? 'border-red-300 bg-red-50 hover:border-red-400'
                                : 'border-slate-300 hover:border-primary hover:bg-primary/5'
                        }
          `}
                >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors
            ${dragActive ? 'bg-primary/20' : 'bg-slate-100 group-hover:bg-white'}
          `}>
                        <Upload className={`w-6 h-6 transition-colors
              ${dragActive ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}
            `} />
                    </div>
                    <p className="text-sm font-medium text-slate-700 mb-1">
                        Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-slate-400">
                        {helperText || `${accept.toUpperCase()} up to ${maxSize}MB`}
                    </p>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleChange}
                className="hidden"
            />

            {error && (
                <p className="mt-1.5 text-xs text-red-600">{error}</p>
            )}
        </div>
    );
};
