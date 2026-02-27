"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Check, Briefcase, GraduationCap, Settings } from "lucide-react";

interface OnboardingStepperProps {
    activeStepOverride?: string; // e.g. "account" to highlight Account Creation as active
}

export const OnboardingStepper = ({ activeStepOverride }: OnboardingStepperProps = {}) => {
    const pathname = usePathname();

    // Helper to determine step status
    // Helper to determine step status
    const getStepStatus = (stepPath: string) => {
        const stepOrder = ["employment", "education", "preferences"];
        const currentStepIndex = stepOrder.findIndex(step => pathname.includes(step));
        const targetStepIndex = stepOrder.indexOf(stepPath);

        if (currentStepIndex === -1) return "pending";

        if (targetStepIndex < currentStepIndex) return "completed";
        if (targetStepIndex === currentStepIndex) return "active";

        return "pending";
    };

    // If override provided, use it to determine statuses
    const getOverrideStatus = (stepId: string) => {
        if (!activeStepOverride) return null;
        const stepOrder = ["account", "employment", "education", "preferences"];
        const activeIndex = stepOrder.indexOf(activeStepOverride);
        const targetIndex = stepOrder.indexOf(stepId);
        if (targetIndex < activeIndex) return "completed";
        if (targetIndex === activeIndex) return "active";
        return "pending";
    };

    const resolveStatus = (stepId: string, fallbackStatus: string) => {
        return getOverrideStatus(stepId) ?? fallbackStatus;
    };

    const resolveSubLabel = (status: string) => {
        if (status === "completed") return "COMPLETED";
        if (status === "active") return "ACTIVE STEP";
        return "";
    };

    const steps = [
        {
            id: "account",
            label: "Account Creation",
            icon: Check,
            status: resolveStatus("account", "completed"),
            subLabel: resolveSubLabel(resolveStatus("account", "completed"))
        },
        {
            id: "employment",
            label: "Employment",
            icon: Briefcase,
            status: resolveStatus("employment", getStepStatus("employment")),
            subLabel: resolveSubLabel(resolveStatus("employment", getStepStatus("employment")))
        },
        {
            id: "education",
            label: "Education",
            icon: GraduationCap,
            status: resolveStatus("education", getStepStatus("education")),
            subLabel: resolveSubLabel(resolveStatus("education", getStepStatus("education")))
        },
        {
            id: "preferences",
            label: "Preferences",
            icon: Settings,
            status: resolveStatus("preferences", getStepStatus("preferences")),
            subLabel: resolveSubLabel(resolveStatus("preferences", getStepStatus("preferences")))
        }
    ];

    return (
        <div className="space-y-8 sticky top-24 px-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Onboarding Progress</h3>

            <div className="relative space-y-5">
                {/* Connecting Line */}
                <div className="absolute left-[21px] top-6 bottom-10 w-0.5 bg-gray-200 -z-10"></div>

                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        className={`relative flex items-center gap-4 py-3 px-3 -ml-3 rounded-full transition-all duration-300 ${step.status === 'active' ? 'bg-[#E8F3F2] shadow-sm' : ''}`}
                    >
                        {/* Circle Indicator */}
                        <div className={`
                            w-11 h-11 rounded-full flex items-center justify-center border-[3px] z-10 transition-colors duration-300
                            ${step.status === 'completed' ? 'bg-green-100 border-green-100 text-green-600' : ''}
                            ${step.status === 'active' ? 'bg-[#0f766d] border-[#0f766d] text-white shadow-lg shadow-[#0f766d]/30' : ''}
                            ${step.status === 'pending' ? 'bg-gray-50 border-gray-100 text-gray-300' : ''}
                        `}>
                            {step.status === 'completed' ? (
                                <Check className="w-5 h-5 stroke-[3]" />
                            ) : (
                                <step.icon className={`w-5 h-5 ${step.status === 'active' ? 'fill-current' : ''}`} />
                            )}
                        </div>

                        {/* Label */}
                        <div className="flex flex-col">
                            <span className={`text-base font-bold transition-colors duration-300 ${step.status === 'active' ? 'text-[#0f766d]' : (step.status === 'completed' ? 'text-gray-600' : 'text-gray-400')
                                }`}>
                                {step.label}
                            </span>
                            {step.subLabel && (
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${step.status === 'completed' ? 'text-green-600' : 'text-[#0f766d]'
                                    }`}>
                                    {step.subLabel}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
