"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { motion } from 'framer-motion';

interface WizardNavigationProps {
    currentStep: number;
    totalSteps: number;
    onPrevious: () => void;
    onNext: () => void;
    onSave?: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
    canProceed: boolean;
    isLoading?: boolean;
}

export const WizardNavigation: React.FC<WizardNavigationProps> = ({
    currentStep,
    totalSteps,
    onPrevious,
    onNext,
    onSave,
    isFirstStep,
    isLastStep,
    canProceed,
    isLoading = false,
}) => {
    return (
        <div className="flex items-center justify-between">
            {/* Previous Button */}
            <motion.button
                type="button"
                onClick={onPrevious}
                disabled={isFirstStep || isLoading}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-slate-600 transition-all ${isFirstStep || isLoading
                    ? 'opacity-0 cursor-default'
                    : 'hover:bg-slate-100'
                    }`}
                whileHover={!isFirstStep && !isLoading ? { x: -4 } : {}}
            >
                <ChevronLeft className="w-5 h-5" />
                Back
            </motion.button>

            <div className="flex items-center gap-4">
                {onSave && (
                    <button
                        type="button"
                        onClick={onSave}
                        className="text-slate-400 hover:text-slate-600 font-medium text-sm px-4 py-2 transition-colors"
                    >
                        Save as Draft
                    </button>
                )}

                {/* Next/Submit Button */}
                <motion.button
                    type="button"
                    onClick={onNext}
                    disabled={!canProceed || isLoading}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-md transition-all ${!canProceed || isLoading
                        ? 'bg-slate-300 shadow-none cursor-not-allowed'
                        : 'bg-primary hover:shadow-lg hover:bg-primary/90'
                        }`}
                    whileHover={canProceed && !isLoading ? { scale: 1.02 } : {}}
                    whileTap={canProceed && !isLoading ? { scale: 0.98 } : {}}
                >
                    {isLoading ? (
                        <>
                            <motion.div
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            />
                            Saving...
                        </>
                    ) : isLastStep ? (
                        <>
                            Submit Application
                            <ChevronRight className="w-5 h-5" />
                        </>
                    ) : (
                        <>
                            Continue
                            <ChevronRight className="w-5 h-5" />
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
};
