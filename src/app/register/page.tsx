"use client";

import React, { useState, useEffect } from "react";
import { SeekerRegisterForm } from "@/components/auth/SeekerRegisterForm";
import { RegistrationJourneyIllustration } from "@/components/auth/RegistrationJourneyIllustration";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";
import { useSession, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Rocket, Check, ChevronDown, ChevronUp, Shield, Zap, ArrowRight, X, Sparkles } from "lucide-react";

export default function RegisterPage() {
    const [isWhyRegisterOpen, setIsWhyRegisterOpen] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [googleData, setGoogleData] = useState<{ name: string; email: string } | null>(null);

    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const isGoogleCallback = searchParams.get("google") === "success";

    // Detect Google OAuth callback and extract session data
    useEffect(() => {
        if (isGoogleCallback && status === "authenticated" && session?.user) {
            const name = session.user.name || "";
            const email = session.user.email || "";
            setGoogleData({ name, email });
            setShowSuccessPopup(true);
        }
    }, [isGoogleCallback, status, session]);

    // Determine active stepper step
    const activeStep = googleData ? "basic" : "account";

    const benefits = [
        "Build your profile and let recruiters find you",
        "Get job updates delivered to your email",
        "Find a job and grow your career",
    ];

    const handleGoogleRegister = async () => {
        try {
            setIsGoogleLoading(true);
            document.cookie = `oauth_role=SEEKER; path=/; max-age=300`;
            await signIn("google", {
                callbackUrl: "/register?google=success",
                redirect: true,
            });
        } catch (error) {
            console.error("Google sign-up error:", error);
            setIsGoogleLoading(false);
        }
    };

    const renderGoogleCard = () => (
        <div className="w-full">
            {/* "Or register with" label */}
            <div className="relative flex items-center mb-5">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="mx-3 text-xs font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">Or register with</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Google Register Card */}
            <div className="relative group">
                {/* Ambient glow behind card on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-red-400/10 to-yellow-400/20 rounded-2xl blur-lg opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500" />

                <button
                    onClick={handleGoogleRegister}
                    disabled={isGoogleLoading || !!googleData}
                    className={`relative w-full bg-white border-2 rounded-2xl p-5 transition-all duration-300 cursor-pointer group/btn disabled:cursor-not-allowed ${googleData
                        ? "border-green-200 bg-green-50/50"
                        : "border-gray-100 hover:border-gray-200 lg:hover:shadow-lg"
                        }`}
                >
                    {/* Top row: Google logo + CTA */}
                    <div className="flex items-center gap-4 mb-4">
                        {/* Google Logo — animated ring */}
                        <div className="relative flex-shrink-0">
                            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${googleData
                                ? "bg-green-50 border-green-200"
                                : "bg-gray-50 border-gray-100 lg:group-hover/btn:border-blue-200 lg:group-hover/btn:bg-blue-50/50"
                                }`}>
                                {googleData ? (
                                    <Check className="w-6 h-6 text-green-600 stroke-[3]" />
                                ) : (
                                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                )}
                            </div>
                            {/* Animated ring on hover */}
                            {!googleData && (
                                <div className="absolute inset-0 rounded-full border-2 border-transparent lg:group-hover/btn:border-blue-300/50 lg:group-hover/btn:scale-110 transition-all duration-500" />
                            )}
                        </div>

                        <div className="flex-grow text-left">
                            <div className="text-sm font-bold text-gray-900">
                                {googleData
                                    ? "Connected with Google"
                                    : isGoogleLoading
                                        ? "Redirecting..."
                                        : "Google"
                                }
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                                {googleData
                                    ? googleData.email
                                    : "One click, zero forms"
                                }
                            </div>
                        </div>

                        {!googleData && (
                            <ArrowRight className="w-5 h-5 text-gray-300 lg:group-hover/btn:text-[#0f766d] lg:group-hover/btn:translate-x-1 transition-all duration-300 flex-shrink-0" />
                        )}
                    </div>

                    {/* Trust & Speed signals */}
                    <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Instant Setup</span>
                        </div>
                        <div className="w-px h-3 bg-gray-200" />
                        <div className="flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-[#0f766d]" />
                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Encrypted</span>
                        </div>
                        <div className="w-px h-3 bg-gray-200" />
                        <div className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Auto-fill</span>
                        </div>
                    </div>
                </button>
            </div>

            {/* Subtle footer note */}
            <p className="text-center text-[10px] text-gray-400 mt-3 leading-relaxed">
                We&apos;ll use your Google name &amp; email to create your profile.
                <br />No password needed. You can update details later.
            </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 py-8">

            {/* ===== Success Popup Modal ===== */}
            {showSuccessPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setShowSuccessPopup(false)}
                    />

                    {/* Modal Card */}
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
                        {/* Close button */}
                        <button
                            onClick={() => setShowSuccessPopup(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Success icon */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0f766d] to-[#10b981] flex items-center justify-center shadow-lg shadow-[#0f766d]/30">
                                    <Check className="w-10 h-10 text-white stroke-[3]" />
                                </div>
                                <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-amber-400 animate-pulse" />
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                            Account Created Successfully!
                        </h3>

                        {/* Google user info pill */}
                        {googleData && (
                            <div className="flex items-center justify-center gap-3 mb-5">
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">{googleData.email}</span>
                                </div>
                            </div>
                        )}

                        {/* Message */}
                        <p className="text-gray-500 text-center text-sm leading-relaxed mb-6">
                            Now fill in the necessary details to get
                            <span className="font-semibold text-[#0f766d]"> more high paying jobs</span> and
                            <span className="font-semibold text-[#0f766d]"> better career opportunities</span>.
                        </p>

                        {/* CTA Button */}
                        <button
                            onClick={() => setShowSuccessPopup(false)}
                            className="w-full py-3.5 bg-gradient-to-r from-[#0f766d] to-[#10b981] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#0f766d]/25 hover:-translate-y-0.5 transition-all cursor-pointer"
                        >
                            Continue Filling Details
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Accordion (Visible only on mobile/tablet < lg) */}
            <div className="lg:hidden bg-white border-b border-gray-100 -mt-8 mb-6">
                <button
                    onClick={() => setIsWhyRegisterOpen(!isWhyRegisterOpen)}
                    className="w-full px-4 py-4 flex items-center justify-between text-left"
                >
                    <span className="font-semibold text-gray-900">Why register on TopCareerLive?</span>
                    {isWhyRegisterOpen ? <ChevronUp className="w-5 h-5 text-[#0f766d]" /> : <ChevronDown className="w-5 h-5 text-[#0f766d]" />}
                </button>

                {isWhyRegisterOpen && (
                    <div className="px-4 pb-6 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex gap-4 mb-6 justify-center py-4 bg-green-50/50 rounded-xl">
                            <Rocket className="w-12 h-12 text-[#3FA296]" />
                        </div>
                        <div className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex gap-3">
                                    <div className="mt-0.5">
                                        <Check className="w-5 h-5 text-[#0f766d]" />
                                    </div>
                                    <p className="text-sm text-gray-600">{benefit}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 3-Column Desktop Layout (matching onboarding) */}
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column - Stepper (3 cols, desktop only) */}
                <div className="hidden lg:block lg:col-span-3">
                    <OnboardingStepper activeStepOverride={activeStep} />
                </div>

                {/* Center Column - Form (responsive cols) */}
                <div className="lg:col-span-7 xl:col-span-6 flex flex-col gap-8 lg:block">
                    {/* Mobile Google Register Card (visible only < lg) */}
                    <div className="lg:hidden px-4 sm:px-0">
                        {renderGoogleCard()}
                    </div>

                    <SeekerRegisterForm
                        onSwitchToLogin={() => window.location.href = '/login'}
                        initialName={googleData?.name}
                        initialEmail={googleData?.email}
                    />
                </div>

                {/* Right Column - Google Register + Illustration (desktop only) */}
                <div className="hidden lg:block lg:col-span-2 xl:col-span-3">
                    <div className="sticky top-24 space-y-8">

                        {/* ====== Google Register Card (TOP) ====== */}
                        {renderGoogleCard()}

                        {/* Illustration (BELOW the Google card) */}
                        <RegistrationJourneyIllustration />
                    </div>
                </div>

            </div>
        </div>
    );
}
