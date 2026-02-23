"use client";

import React, { useState, useEffect } from 'react';
import { StepProgress } from './StepProgress';
import { StepTransition } from './StepTransition';
import { WizardNavigation } from './WizardNavigation';
import { WIZARD_STEPS, getTotalSteps } from '@/lib/wizardConfig';
import { ProfileData } from '@/lib/profileTypes';
import { calculateProfileCompletion, getSectionStatus } from '@/lib/profileUtils';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface ProfileWizardProps {
    initialData?: Partial<ProfileData>;
    onComplete?: (data: Partial<ProfileData>) => void;
    children: (props: WizardChildProps) => React.ReactNode;
}

export interface WizardChildProps {
    currentStep: number;
    profileData: Partial<ProfileData>;
    updateData: (updates: Partial<ProfileData>) => void;
}

export const ProfileWizard: React.FC<ProfileWizardProps> = ({
    initialData = {},
    onComplete,
    children,
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
    const [profileData, setProfileData] = useState<Partial<ProfileData>>(initialData);
    const [isLoading, setIsLoading] = useState(false);

    const totalSteps = getTotalSteps();
    const currentStepConfig = WIZARD_STEPS.find((s) => s.id === currentStep);

    // Check if current step can proceed
    const canProceed = true; // TODO: Add actual validation

    const updateData = (updates: Partial<ProfileData>) => {
        setProfileData((prev) => ({ ...prev, ...updates }));
    };

    const handleNext = async () => {
        if (!canProceed) return;

        // Mark current step as completed
        if (!completedSteps.includes(currentStep)) {
            setCompletedSteps([...completedSteps, currentStep]);
        }

        if (currentStep === totalSteps) {
            // Final step - submit
            setIsLoading(true);

            // Trigger confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });

            setTimeout(() => {
                onComplete?.(profileData);
                setIsLoading(false);
            }, 1500);
        } else {
            // Move to next step
            setDirection('forward');
            setCurrentStep((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setDirection('backward');
            setCurrentStep((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleStepClick = (stepId: number) => {
        if (stepId < currentStep || completedSteps.includes(stepId)) {
            setDirection(stepId < currentStep ? 'backward' : 'forward');
            setCurrentStep(stepId);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSave = () => {
        // Auto-save functionality
        console.log('Saving profile data...', profileData);
        // TODO: Implement actual save to backend
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">

                {/* Header Section */}
                <div className="mb-8">
                    {/* Segmented Progress Bar */}
                    <div className="flex gap-1 mb-6">
                        {Array.from({ length: totalSteps }).map((_, index) => (
                            <div
                                key={index}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${index + 1 <= currentStep ? 'bg-primary' : 'bg-slate-200'
                                    }`}
                            />
                        ))}
                    </div>

                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-sm font-bold text-primary tracking-wide uppercase mb-1">
                                Step {currentStep} of {totalSteps}
                            </h2>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                                {currentStepConfig?.title}
                            </h1>
                            <p className="text-lg text-slate-500 mt-2">
                                {currentStepConfig?.subtitle}
                            </p>
                        </div>
                        {currentStepConfig?.isOptional && (
                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
                                Optional
                            </span>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <StepTransition stepId={currentStep} direction={direction}>
                        {children({
                            currentStep,
                            profileData,
                            updateData,
                        })}
                    </StepTransition>
                </div>

                {/* Natural Flow Navigation */}
                <div className="mt-8">
                    <WizardNavigation
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                        onSave={handleSave}
                        isFirstStep={currentStep === 1}
                        isLastStep={currentStep === totalSteps}
                        canProceed={canProceed}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
};
