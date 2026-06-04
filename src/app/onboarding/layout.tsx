import React from "react";
import { OnboardingSidebar } from "@/components/onboarding/OnboardingSidebar";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";
import { RegistrationJourneyIllustration } from "@/components/auth/RegistrationJourneyIllustration";

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50/50 py-8">
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column - Stepper (3 cols) */}
                <div className="hidden lg:block lg:col-span-3">
                    <OnboardingStepper />
                </div>

                {/* Center Column - Form (7 cols) */}
                <div className="lg:col-span-7 xl:col-span-6 space-y-6">
                    {children}
                </div>

                {/* Right Column - Sidebar Widgets (2 cols) */}
                <div className="hidden lg:block lg:col-span-2 xl:col-span-3 space-y-6">
                    <div className="sticky top-24">
                        <div className="mb-24">
                            <RegistrationJourneyIllustration />
                        </div>
                        <OnboardingSidebar progress={50} />
                    </div>
                </div>
            </div>
        </div>
    );
}
