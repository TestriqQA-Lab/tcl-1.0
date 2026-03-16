"use client";

import React, { useState, useEffect } from "react";
import { applyToJobAction, hasUserAppliedAction } from "@/actions/job.actions";
import { useSession } from "next-auth/react";
import { Loader2, CheckCircle2 } from "lucide-react";

interface JobApplyButtonProps {
    jobId: string;
    className?: string;
}

export const JobApplyButton = ({ jobId, className = "" }: JobApplyButtonProps) => {
    const { data: session } = useSession();
    const [isApplied, setIsApplied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function checkStatus() {
            if (session?.user?.id) {
                const applied = await hasUserAppliedAction(jobId);
                setIsApplied(applied);
            }
            setIsChecking(false);
        }
        checkStatus();
    }, [jobId, session]);

    const handleApply = async (customResume?: string) => {
        if (!session) {
            alert("Please log in to apply.");
            return;
        }

        setIsLoading(true);
        const result = await applyToJobAction(jobId, customResume);
        setIsLoading(false);

        if (result.success) {
            setIsApplied(true);
        } else if (result.error === "RESUME_REQUIRED") {
            // Trigger file picker if resume is missing
            if (fileInputRef.current) {
                fileInputRef.current.click();
            }
        } else {
            alert(result.error || "Failed to apply.");
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;
                await handleApply(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    if (isChecking) {
        return (
            <button disabled className={`bg-gray-100 text-gray-400 px-6 py-3 rounded-xl flex items-center justify-center gap-2 ${className}`}>
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking...
            </button>
        );
    }

    if (isApplied) {
        return (
            <button disabled className={`bg-teal-50 text-[#0f766d] border border-[#0f766d]/20 px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold ${className}`}>
                <CheckCircle2 className="w-4 h-4" />
                Applied
            </button>
        );
    }

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
            />
            <button
                onClick={() => handleApply()}
                disabled={isLoading}
                className={`bg-[#0f766d] hover:bg-[#0d6b63] text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Applying...
                    </>
                ) : (
                    "Apply Now"
                )}
            </button>
        </>
    );
};
