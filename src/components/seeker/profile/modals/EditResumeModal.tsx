'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, FileText, Trash2, Download, RefreshCw, Upload, ArrowRight, Sparkles } from 'lucide-react';

export interface ResumeData {
    id: string;
    fileName: string;
    fileUrl: string;
    uploadDate: string;
    size: string;
}

interface EditResumeModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: ResumeData | null;
    onSave: (data: ResumeData | null) => void;
}

const EditResumeModal: React.FC<EditResumeModalProps> = ({
    isOpen,
    onClose,
    initialData,
    onSave
}) => {
    const [animateIn, setAnimateIn] = useState(false);
    const [resume, setResume] = useState<ResumeData | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setAnimateIn(true);
            setResume(initialData || null);
        } else {
            setAnimateIn(false);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const newResume: ResumeData = {
                    id: Math.random().toString(36).substr(2, 9),
                    fileName: file.name,
                    fileUrl: base64String, // Use actual base64 string for persistence
                    uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
                };
                setResume(newResume);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = () => {
        setResume(null);
    };

    const handleSave = () => {
        onSave(resume);
        onClose();
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300 min-h-[100dvh] w-screen top-0 left-0">
            <div className={`bg-white rounded-2xl w-full max-w-[550px] shadow-2xl transform transition-all duration-300 max-h-[90vh] flex flex-col ${animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                {/* Header */}
                <div className="p-8 pb-4 relative shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Resume</h3>
                    <p className="text-sm text-gray-500">
                        Your resume is the first impression you make on potential employers.
                    </p>
                </div>

                <div className="px-8 pb-8 space-y-6 overflow-y-auto">
                    {/* Upload Area or Current File */}
                    {!resume ? (
                        <div
                            className="border-2 border-dashed border-emerald-100 rounded-2xl bg-[#f8fcfc] p-8 flex flex-col items-center justify-center text-center hover:bg-[#f0f9f9] transition-colors cursor-pointer"
                            onClick={triggerFileUpload}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".doc,.docx,.rtf,.pdf"
                                onChange={handleFileChange}
                            />
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-[#117a7a]">
                                <Upload size={24} />
                            </div>
                            <h4 className="text-base font-bold text-gray-900 mb-1">
                                Upload resume
                            </h4>
                            <p className="text-sm text-gray-500 mb-4">
                                Supported formats: doc, docx, rtf, pdf up to 2MB
                            </p>
                            <button className="bg-[#117a7a] hover:bg-[#0e6666] text-white text-sm font-bold py-2 px-6 rounded-lg transition-all shadow-lg shadow-emerald-900/10">
                                Upload resume
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div
                                className="border-2 border-dashed border-emerald-100 rounded-2xl bg-[#f8fcfc] p-8 flex flex-col items-center justify-center text-center hover:bg-[#f0f9f9] transition-colors cursor-pointer mb-6"
                                onClick={triggerFileUpload}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".doc,.docx,.rtf,.pdf"
                                    onChange={handleFileChange}
                                />
                                <div className="w-12 h-12 bg-[#e0f2f2] rounded-full flex items-center justify-center mb-3 text-[#117a7a]">
                                    <Upload size={20} />
                                </div>
                                <h4 className="text-base font-bold text-gray-900 mb-1">
                                    Upload resume
                                </h4>
                                <p className="text-sm text-gray-500 mb-4">
                                    Drag and drop or click to upload
                                </p>
                                <button className="bg-[#117a7a] hover:bg-[#0e6666] text-white text-sm font-bold py-2 px-6 rounded-lg transition-all shadow-lg shadow-emerald-900/10">
                                    Upload resume
                                </button>
                            </div>

                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">CURRENT FILE</h4>
                            <div className="border border-gray-100 rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-bold text-gray-900 truncate max-w-[200px]">
                                            {resume.fileName}
                                        </h5>
                                        <p className="text-xs text-gray-500">
                                            {resume.size} • Uploaded {resume.uploadDate}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        className="p-2 text-gray-400 hover:text-[#117a7a] transition-colors"
                                        onClick={triggerFileUpload}
                                        title="Replace"
                                    >
                                        <RefreshCw size={18} />
                                    </button>
                                    <button
                                        className="p-2 text-gray-400 hover:text-[#117a7a] transition-colors"
                                        title="Download"
                                        onClick={(e) => { e.stopPropagation(); window.open(resume.fileUrl, '_blank'); }}
                                    >
                                        <Download size={18} />
                                    </button>
                                    <button
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        onClick={handleDelete}
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="p-6 pt-2 flex justify-end gap-3 items-center border-t border-gray-50 shrink-0">
                    <button
                        onClick={onClose}
                        className="text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors px-4"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-[#117a7a] hover:bg-[#0e6666] text-white text-sm font-bold py-2.5 px-8 rounded-lg transition-all shadow-lg shadow-emerald-900/10"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditResumeModal;
