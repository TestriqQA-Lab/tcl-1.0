'use client';

import React, { useState } from 'react';
import { FileText, Plus, Pencil, Download, Trash2, Upload } from 'lucide-react';
import EditResumeModal, { ResumeData } from '../modals/EditResumeModal';

const Resume = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [resume, setResume] = useState<ResumeData | null>(null);

    const handleSave = (data: ResumeData | null) => {
        setResume(data);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Resume</h2>
                {!resume && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-[#117a7a] font-bold text-sm hover:underline"
                    >
                        Add resume
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {resume ? (
                    <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-500 shrink-0">
                                <FileText size={24} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-sm font-bold text-gray-900 truncate">{resume.fileName}</h3>
                                <p className="text-xs text-gray-500 truncate">
                                    Uploaded on {resume.uploadDate} • {resume.size}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <a
                                href={resume.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 text-gray-400 hover:text-[#117a7a] transition-colors"
                            >
                                <Download size={18} />
                            </a>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="p-2 text-gray-400 hover:text-[#117a7a] transition-colors"
                            >
                                <Pencil size={18} />
                            </button>
                            <button
                                onClick={() => setResume(null)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-400">
                            <Upload size={24} />
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1">Upload resume</h3>
                        <p className="text-xs text-gray-500">
                            We accept .doc, .docx, .rtf, .pdf files
                        </p>
                    </div>
                )}
            </div>

            <EditResumeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={resume}
                onSave={handleSave}
            />
        </div>
    );
};

export default Resume;
