"use client";

import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Loader2, CheckCircle2, ChevronRight, UploadCloud, FileText } from "lucide-react";
import { applyToJobAction } from "@/actions/job.actions";
import { Button } from "@/components/ui/Button";

interface JobApplicationModalProps {
    jobId: string;
    isOpen: boolean;
    onClose: () => void;
    onApplied: () => void;
    hasResume: boolean;
    screeningExperienceMin: number | null;
    screeningEducationLevel: string | null;
    screeningEnglishLevel: string | null;
}

export const JobApplicationModal = ({
    jobId,
    isOpen,
    onClose,
    onApplied,
    hasResume,
    screeningExperienceMin,
    screeningEducationLevel,
    screeningEnglishLevel
}: JobApplicationModalProps) => {
    const [currentStep, setCurrentStep] = useState<"RESUME" | "SCREENING" | "SUBMIT">("RESUME");
    const [customResumeBase64, setCustomResumeBase64] = useState<string | null>(null);
    const [customResumeName, setCustomResumeName] = useState<string | null>(null);
    
    // Resume states
    const [resumeSource, setResumeSource] = useState<"EXISTING" | "NEW">(hasResume ? "EXISTING" : "NEW");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Screening answers
    const [answers, setAnswers] = useState<{
        experience?: number;
        education?: string;
        english?: string;
    }>({});

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // If no screening questions, we can skip right to SUBMIT
    const hasScreeningQuestions = screeningExperienceMin !== null || screeningEducationLevel !== null || screeningEnglishLevel !== null;

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCustomResumeName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCustomResumeBase64(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNext = () => {
        if (currentStep === "RESUME") {
            if (hasScreeningQuestions) {
                setCurrentStep("SCREENING");
            } else {
                setCurrentStep("SUBMIT");
            }
        } else if (currentStep === "SCREENING") {
            // Validation
            if (screeningExperienceMin && answers.experience === undefined) {
                setError("Please answer the experience question");
                return;
            }
            if (screeningEducationLevel && !answers.education) {
                setError("Please answer the education question");
                return;
            }
            if (screeningEnglishLevel && !answers.english) {
                setError("Please answer the english proficiency question");
                return;
            }
            setError(null);
            setCurrentStep("SUBMIT");
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);
        
        const screeningAnswersString = hasScreeningQuestions ? JSON.stringify(answers) : undefined;
        const result = await applyToJobAction(jobId, resumeSource === "NEW" ? customResumeBase64 || undefined : undefined, screeningAnswersString);
        
        setIsSubmitting(false);

        if (result.success) {
            onApplied();
            onClose();
        } else {
            setError(result.error || "Failed to apply");
        }
    };

    const isResumeValid = resumeSource === "EXISTING" || (resumeSource === "NEW" && customResumeBase64 !== null);

    const [mounted, setMounted] = useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Apply for Job</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        ✕
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center justify-between text-sm">
                    <div className={`flex items-center gap-2 ${currentStep === "RESUME" ? "text-[#0f766d] font-semibold" : "text-gray-500"}`}>
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep === "RESUME" ? "bg-[#0f766d] text-white" : "bg-gray-200"}`}>1</span>
                        Resume
                    </div>
                    {hasScreeningQuestions && (
                        <>
                            <div className="h-px bg-gray-300 flex-1 mx-4" />
                            <div className={`flex items-center gap-2 ${currentStep === "SCREENING" ? "text-[#0f766d] font-semibold" : "text-gray-500"}`}>
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep === "SCREENING" ? "bg-[#0f766d] text-white" : "bg-gray-200"}`}>2</span>
                                Screening
                            </div>
                        </>
                    )}
                    <div className="h-px bg-gray-300 flex-1 mx-4" />
                    <div className={`flex items-center gap-2 ${currentStep === "SUBMIT" ? "text-[#0f766d] font-semibold" : "text-gray-500"}`}>
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep === "SUBMIT" ? "bg-[#0f766d] text-white" : "bg-gray-200"}`}>
                            {hasScreeningQuestions ? "3" : "2"}
                        </span>
                        Submit
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6 overflow-y-auto flex-1">
                    {/* Step 1: Resume */}
                    {currentStep === "RESUME" && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800">Choose Resume Option</h3>
                            
                            <div className="space-y-4">
                                <label className={`flex gap-4 p-4 border rounded-xl cursor-pointer transition-all ${resumeSource === "EXISTING" ? "border-[#0f766d] bg-teal-50/50" : "border-gray-200 hover:border-[#0f766d]/50"}`}>
                                    <input 
                                        type="radio" 
                                        name="resumeSource" 
                                        className="mt-1"
                                        checked={resumeSource === "EXISTING"} 
                                        onChange={() => setResumeSource("EXISTING")}
                                        disabled={!hasResume}
                                    />
                                    <div>
                                        <p className={`font-semibold ${hasResume ? "text-gray-900" : "text-gray-400"}`}>Use existing profile resume</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {hasResume ? "Use the resume from your profile." : "No resume found in your profile."}
                                        </p>
                                    </div>
                                </label>

                                <label className={`flex gap-4 p-4 border rounded-xl cursor-pointer transition-all ${resumeSource === "NEW" ? "border-[#0f766d] bg-teal-50/50" : "border-gray-200 hover:border-[#0f766d]/50"}`}>
                                    <input 
                                        type="radio" 
                                        name="resumeSource" 
                                        className="mt-1"
                                        checked={resumeSource === "NEW"} 
                                        onChange={() => setResumeSource("NEW")}
                                    />
                                    <div className="flex-1 w-full">
                                        <p className="font-semibold text-gray-900">Upload new resume for this job applying</p>
                                        {resumeSource === "NEW" && (
                                            <div className="mt-4">
                                                <input 
                                                    type="file" 
                                                    ref={fileInputRef} 
                                                    onChange={handleFileChange}
                                                    accept=".pdf,.doc,.docx"
                                                    className="hidden"
                                                />
                                                <button 
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#0f766d] transition-colors bg-white"
                                                >
                                                    {customResumeName ? (
                                                        <>
                                                            <FileText className="w-8 h-8 text-[#0f766d] mb-2" />
                                                            <span className="font-medium text-gray-900 truncate max-w-[200px]">{customResumeName}</span>
                                                            <span className="text-xs text-[#0f766d] mt-2 underline">Change file</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                                                            <span className="font-medium text-gray-700">Click to upload</span>
                                                            <span className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 5MB</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Screening */}
                    {currentStep === "SCREENING" && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800">Employer Screening Questions</h3>
                            <p className="text-sm text-gray-500 border-l-2 border-[#0f766d] pl-3 py-1 bg-gray-50/50">
                                The employer requires candidates to answer these questions before applying.
                            </p>

                            <div className="space-y-6 mt-6">
                                {screeningExperienceMin && (
                                    <div className="space-y-3">
                                        <label className="font-medium text-gray-800">How many years of work experience do you have?</label>
                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                            {[0, 1, 2, 3, 5, 8, 10, 12].map(years => (
                                                <button
                                                    key={years}
                                                    onClick={() => setAnswers(prev => ({ ...prev, experience: years }))}
                                                    className={`py-2 px-3 border rounded-lg text-sm font-medium transition-colors ${answers.experience === years ? "bg-[#0f766d] border-[#0f766d] text-white" : "bg-white border-gray-200 text-gray-700 hover:border-[#0f766d]/50 hover:bg-teal-50/30"}`}
                                                >
                                                    {years === 0 ? "Fresher" : `${years}+ years`}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {screeningEducationLevel && (
                                    <div className="space-y-3">
                                        <label className="font-medium text-gray-800">What is your highest level of education?</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {["diploma", "12 pass", "graduate", "post-graduate"].map(edu => (
                                                <button
                                                    key={edu}
                                                    onClick={() => setAnswers(prev => ({ ...prev, education: edu }))}
                                                    className={`py-3 px-4 border rounded-lg text-sm font-medium capitalize text-left transition-colors ${answers.education === edu ? "bg-[#0f766d] border-[#0f766d] text-white" : "bg-white border-gray-200 text-gray-700 hover:border-[#0f766d]/50 hover:bg-teal-50/30"}`}
                                                >
                                                    {edu.replace("-", " ")}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {screeningEnglishLevel && (
                                    <div className="space-y-3">
                                        <label className="font-medium text-gray-800">What is your English proficiency level?</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {["no english", "basic english", "good english", "fluent english"].map(level => (
                                                <button
                                                    key={level}
                                                    onClick={() => setAnswers(prev => ({ ...prev, english: level }))}
                                                    className={`py-3 px-4 border rounded-lg text-sm font-medium capitalize text-left transition-colors ${answers.english === level ? "bg-[#0f766d] border-[#0f766d] text-white" : "bg-white border-gray-200 text-gray-700 hover:border-[#0f766d]/50 hover:bg-teal-50/30"}`}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Final Submit */}
                    {currentStep === "SUBMIT" && (
                        <div className="py-8 text-center px-4">
                            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FileText className="w-8 h-8 text-[#0f766d]" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Apply?</h3>
                            <p className="text-gray-500 mb-6">
                                You are about to submit your application. We will include {resumeSource === "EXISTING" ? "your profile resume" : "your uploaded resume"} 
                                {hasScreeningQuestions ? " and screening answers" : ""}.
                            </p>
                            
                            <div className="bg-gray-50 rounded-xl p-4 text-left border border-gray-100 text-sm mb-6">
                                <p className="font-medium text-gray-800 mb-2 border-b pb-2">Review</p>
                                <div className="space-y-2 text-gray-600">
                                    <p className="flex justify-between items-center">
                                        <span>Resume attached:</span>
                                        <span className="font-semibold text-gray-900"><CheckCircle2 className="w-4 h-4 text-green-500 inline-block mr-1" /> Yes</span>
                                    </p>
                                    {hasScreeningQuestions && (
                                        <p className="flex justify-between items-center">
                                            <span>Screening answered:</span>
                                            <span className="font-semibold text-gray-900"><CheckCircle2 className="w-4 h-4 text-green-500 inline-block mr-1" /> Yes</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                            <p className="text-xs text-gray-400">By clicking submit, you agree to the platform's application terms.</p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 font-medium">
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center rounded-b-2xl">
                    <button 
                        onClick={() => {
                            if (currentStep === "SUBMIT") {
                                setCurrentStep(hasScreeningQuestions ? "SCREENING" : "RESUME");
                            } else if (currentStep === "SCREENING") {
                                setCurrentStep("RESUME");
                            } else {
                                onClose();
                            }
                        }}
                        className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900"
                        disabled={isSubmitting}
                    >
                        {currentStep === "RESUME" ? "Cancel" : "Back"}
                    </button>

                    {currentStep !== "SUBMIT" ? (
                        <Button 
                            onClick={handleNext} 
                            disabled={!isResumeValid}
                            className="bg-[#0f766d] hover:bg-[#0d6b63]"
                        >
                            Continue <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleSubmit} 
                            disabled={isSubmitting}
                            className="bg-[#0f766d] hover:bg-[#0d6b63] min-w-[140px]"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting</>
                            ) : (
                                "Submit Application"
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};
