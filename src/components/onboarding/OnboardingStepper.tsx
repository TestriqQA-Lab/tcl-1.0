"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Check, Briefcase, GraduationCap, Settings } from "lucide-react";

export const OnboardingStepper = () => {
    const pathname = usePathname();

    // Helper to determine step status
    const getStepStatus = (stepPath: string, isFirstStep: boolean = false) => {
        if (isFirstStep) return "completed"; // Basic details always done

        if (pathname.includes(stepPath)) return "active";

        // Logic for completion based on known flow order: employment -> education
        if (pathname.includes("education") && stepPath === "employment") return "completed";
        if (pathname.includes("preferences") && stepPath === "education") return "completed";
        if (pathname.includes("preferences") && stepPath === "preferences") return "active";

        return "pending";
    };

    const steps = [
        {
            id: "basic",
            label: "Basic Details",
            icon: Check,
            status: "completed", // Always completed coming from registration
            subLabel: "COMPLETED"
        },
        {
            id: "employment",
            label: "Employment",
            icon: Briefcase,
            status: getStepStatus("employment"),
            subLabel: getStepStatus("employment") === "active" ? "ACTIVE STEP" : (getStepStatus("employment") === "completed" ? "COMPLETED" : "")
        },
        {
            id: "education",
            label: "Education",
            icon: GraduationCap,
            status: getStepStatus("education"),
            subLabel: getStepStatus("education") === "active" ? "ACTIVE STEP" : (getStepStatus("education") === "completed" ? "COMPLETED" : "")
        },
        {
            id: "preferences",
            label: "Preferences",
            icon: Settings,
            status: getStepStatus("preferences"),
            subLabel: getStepStatus("preferences") === "active" ? "ACTIVE STEP" : ""
        }
    ];

    return (
        <div className="space-y-8 sticky top-24">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-4">Onboarding Progress</h3>

            <div className="relative space-y-5">
                {/* Connecting Line */}
                <div className="absolute left-[35px] top-6 bottom-10 w-0.5 bg-gray-200 -z-10"></div>

                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        className={`relative flex items-center gap-4 py-3 px-3 rounded-full transition-all duration-300 ${step.status === 'active' ? 'bg-[#E8F3F2] shadow-sm' : ''}`}
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
