"use client";

import React from 'react';
import { WIZARD_STEPS } from '@/lib/wizardConfig';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface StepProgressProps {
    currentStep: number;
    completedSteps: number[];
    onStepClick?: (stepId: number) => void;
}

export const StepProgress: React.FC<StepProgressProps> = ({
    currentStep,
    completedSteps,
    onStepClick,
}) => {
    return (
        <div className="w-full py-8">
            {/* Mobile: Compact Progress */}
            <div className="block lg:hidden">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700">
                        Step {currentStep} of {WIZARD_STEPS.length}
                    </span>
                    <span className="text-sm text-slate-500">
                        {Math.round((currentStep / WIZARD_STEPS.length) * 100)}% Complete
                    </span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-primary to-teal-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStep / WIZARD_STEPS.length) * 100}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>
            </div>

            {/* Desktop: Full Progress Stepper */}
            <div className="hidden lg:block">
                <div className="flex items-center justify-between relative">
                    {/* Progress Line Background */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200" />

                    {/* Active Progress Line */}
                    <motion.div
                        className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-primary to-teal-600"
                        initial={{ width: '0%' }}
                        animate={{
                            width: `${((currentStep - 1) / (WIZARD_STEPS.length - 1)) * 100}%`,
                        }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />

                    {/* Step Dots */}
                    {WIZARD_STEPS.map((step, index) => {
                        const isCompleted = completedSteps.includes(step.id);
                        const isCurrent = step.id === currentStep;
                        const isClickable = isCompleted || isCurrent;

                        return (
                            <div
                                key={step.id}
                                className="relative flex flex-col items-center"
                                style={{ zIndex: 10 }}
                            >
                                {/* Step Circle */}
                                <motion.button
                                    type="button"
                                    onClick={() => isClickable && onStepClick?.(step.id)}
                                    disabled={!isClickable}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                    transition-all duration-300 ${isCompleted
                                            ? 'bg-gradient-to-r from-primary to-teal-600 text-white shadow-lg'
                                            : isCurrent
                                                ? 'bg-white border-4 border-primary text-primary shadow-lg ring-4 ring-primary/20'
                                                : 'bg-white border-2 border-slate-300 text-slate-400'
                                        } ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'}`}
                                    whileHover={isClickable ? { scale: 1.1 } : {}}
                                    whileTap={isClickable ? { scale: 0.95 } : {}}
                                >
                                    {isCompleted ? (
                                        <Check className="w-5 h-5" />
                                    ) : isCurrent ? (
                                        <motion.span
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                        >
                                            {step.id}
                                        </motion.span>
                                    ) : (
                                        step.id
                                    )}
                                </motion.button>

                                {/* Step Label */}
                                <div className="mt-3 text-center">
                                    <p
                                        className={`text-xs font-semibold transition-colors ${isCurrent ? 'text-primary' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                                            }`}
                                    >
                                        {step.icon}
                                    </p>
                                    <p
                                        className={`text-xs mt-1 max-w-[80px] transition-colors ${isCurrent ? 'text-primary font-semibold' : 'text-slate-500'
                                            }`}
                                    >
                                        {step.title}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
