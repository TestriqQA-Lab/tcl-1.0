"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    verificationStatus: string | null;
}

export function VerificationModal({
    isOpen,
    onClose,
    verificationStatus
}: VerificationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl flex flex-col items-center gap-4 animate-[fadeIn_0.2s_ease]">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-2">
                    <ShieldAlert size={28} />
                </div>
                <h3 className="text-xl font-bold text-center text-[#0e1b1a]">Verification Required</h3>
                <p className="text-sm text-center text-[#64748B] mb-2">
                    {verificationStatus === "PENDING"
                        ? "Your account is currently under review. Once approved, you can start posting jobs."
                        : "Please verify your account to start posting jobs. It only takes a minute."}
                </p>
                <div className="flex items-center gap-3 w-full">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-lg border border-[#E2E8F0] text-[#64748B] font-semibold hover:bg-[#F8FAFB] transition-colors"
                    >
                        Cancel
                    </button>
                    <Link
                        href="/employer-dashboard/verification"
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-lg bg-[#0f766d] hover:bg-[#0d635c] text-white font-semibold text-center transition-colors"
                    >
                        {verificationStatus === "PENDING" ? "Check Status" : "Verify Now"}
                    </Link>
                </div>
            </div>
        </div>
    );
}
