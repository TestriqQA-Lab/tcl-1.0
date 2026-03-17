"use client";

import React, { useState, useEffect } from "react";
import { hasUserAppliedAction, getJobScreeningQuestions } from "@/actions/job.actions";
import { useSession } from "next-auth/react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { JobApplicationModal } from "./JobApplicationModal";

interface JobApplyButtonProps {
    jobId: string;
    className?: string;
}

export const JobApplyButton = ({ jobId, className = "" }: JobApplyButtonProps) => {
    const { data: session } = useSession();
    const [isApplied, setIsApplied] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [hasResume, setHasResume] = useState(false);
    const [screeningData, setScreeningData] = useState<{
        screeningExperienceMin: number | null;
        screeningEducationLevel: string | null;
        screeningEnglishLevel: string | null;
    } | null>(null);

    useEffect(() => {
        async function checkStatus() {
            if (session?.user?.id) {
                const applied = await hasUserAppliedAction(jobId);
                setIsApplied(applied);

                // Fetch only screening questions (lightweight, no nested arrays)
                const screening = await getJobScreeningQuestions(jobId);
                setScreeningData(screening);
                
                try {
                    const res = await fetch('/api/seeker/profile');
                    if (res.ok) {
                        const profile = await res.json();
                        setHasResume(!!profile?.resumeUrl);
                    }
                } catch(e) {
                     console.error("Failed to check resume status", e);
                }
            }
            setIsChecking(false);
        }
        checkStatus();
    }, [jobId, session]);

    const handleApplyClick = () => {
        if (!session) {
            alert("Please log in to apply.");
            return;
        }
        setIsModalOpen(true);
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
            <button
                onClick={handleApplyClick}
                className={`bg-[#0f766d] hover:bg-[#0d6b63] text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${className}`}
            >
                Apply Now
            </button>

            {isModalOpen && screeningData && (
                <JobApplicationModal
                    jobId={jobId}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onApplied={() => setIsApplied(true)}
                    hasResume={hasResume}
                    screeningExperienceMin={screeningData.screeningExperienceMin}
                    screeningEducationLevel={screeningData.screeningEducationLevel}
                    screeningEnglishLevel={screeningData.screeningEnglishLevel}
                />
            )}
        </>
    );
};

