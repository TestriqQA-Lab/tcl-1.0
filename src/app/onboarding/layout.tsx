import React from "react";
import { OnboardingSidebar } from "@/components/onboarding/OnboardingSidebar";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50/50 py-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column - Stepper (3 cols) */}
                <div className="hidden lg:block lg:col-span-3">
                    <OnboardingStepper />
                </div>

                {/* Center Column - Form (6 cols) */}
                <div className="lg:col-span-6 space-y-6">
                    {children}
                </div>

                {/* Right Column - Sidebar Widgets (3 cols) */}
                <div className="hidden lg:block lg:col-span-3 space-y-6">
                    <div className="sticky top-24">
                        <OnboardingSidebar progress={50} />
                    </div>
                </div>
            </div>
        </div>
    );
}
