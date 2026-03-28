"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

export const AuthModal = ({ isOpen, onClose, children, title, subtitle }: AuthModalProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen || !mounted) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                {/* Header with gradient - Fixed at top */}
                <div className="relative bg-gradient-to-br from-[#0f766d] to-[#0d5c55] px-6 sm:px-8 pt-6 sm:pt-8 pb-6 shrink-0 z-10">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>

                    {/* Title */}
                    <div className="text-center">
                        <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
                        {subtitle && (
                            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-white/80">{subtitle}</p>
                        )}
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="px-6 sm:px-8 py-6 sm:py-8 bg-white overflow-y-auto flex-1 overscroll-contain">
                    {children}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};
