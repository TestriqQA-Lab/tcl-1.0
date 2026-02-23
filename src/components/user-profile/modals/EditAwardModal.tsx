'use client';

import React, { useState, useEffect } from 'react';
import { X, Trophy } from 'lucide-react';

export interface AwardData {
    id: string;
    description: string;
}

interface EditAwardModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: AwardData;
    onSave: (data: AwardData) => void;
}

const EditAwardModal: React.FC<EditAwardModalProps> = ({
    isOpen,
    onClose,
    initialData,
    onSave
}) => {
    const [animateIn, setAnimateIn] = useState(false);
    const [formData, setFormData] = useState<AwardData>({
        id: '',
        description: ''
    });

    useEffect(() => {
        if (isOpen) {
            setAnimateIn(true);
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData({
                    id: Math.random().toString(36).substr(2, 9),
                    description: ''
                });
            }
        } else {
            setAnimateIn(false);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= 1000) {
            setFormData(prev => ({ ...prev, description: e.target.value }));
        }
    };

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300">
            <div className={`bg-white rounded-2xl w-full max-w-[500px] shadow-2xl transform transition-all duration-300 ${animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                {/* Header */}
                <div className="p-8 pb-4 relative">
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Awards</h3>
                    <p className="text-sm text-[#117a7a] leading-relaxed">
                        Adding awards & accomplishments helps you stand out
                    </p>
                </div>

                <div className="px-8 pb-8 space-y-6">
                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                            Awards & Achievements
                        </label>
                        <div className="relative">
                            <textarea
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Mention your academic or extra-curricular achievements where you were recognised for your performance"
                                className="w-full p-4 h-32 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                            />
                            <div className="absolute bottom-3 right-3 text-[10px] text-gray-400">
                                {formData.description.length}/1000
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="pt-2 flex justify-end gap-3 items-center">
                        <button
                            onClick={onClose}
                            className="text-sm font-bold text-[#117a7a] hover:text-[#0e6666] transition-colors px-4"
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
        </div>
    );
};

export default EditAwardModal;
