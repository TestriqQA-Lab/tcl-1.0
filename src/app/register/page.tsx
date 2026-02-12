"use client";

import React, { useState } from "react";
import { SeekerRegisterForm } from "@/components/auth/SeekerRegisterForm";
import { Rocket, Check, ChevronDown, ChevronUp } from "lucide-react";

export default function RegisterPage() {
    const [isWhyRegisterOpen, setIsWhyRegisterOpen] = useState(false);

    const benefits = [
        "Build your profile and let recruiters find you",
        "Get job updates delivered to your email",
        "Find a job and grow your career",
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 grid grid-cols-1 lg:grid-cols-12">

            {/* Left Column - Desktop (Visible only on lg+) */}
            <div className="hidden rounded-2xl lg:flex lg:col-span-5 bg-white p-6 flex-col border-r border-gray-100 sticky top-20 mt-10 h-fit">
                <div>
                    {/* Green Card */}
                    <div className="bg-[#3FA296] rounded-2xl p-8 mb-8 text-center text-white relative overflow-hidden shadow-sm">
                        <div className="relative z-10 flex justify-center mb-4">
                            <Rocket className="w-16 h-16 text-white/90" />
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-6 px-2">On registering, you can</h2>

                    <div className="space-y-6 px-2">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
                                        <Check className="w-3.5 h-3.5 text-[#0f766d]" />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed font-medium">{benefit}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Accordion (Visible only on mobile/tablet < lg) */}
            <div className="lg:hidden col-span-1 bg-white mt-7 border-b border-gray-100">
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

            {/* Right Column - Form Area */}
            <div className="col-span-1 lg:col-span-7 bg-gray-50/50 lg:pl-10 py-8">
                <SeekerRegisterForm onSwitchToLogin={() => window.location.href = '/login'} />
            </div>

        </div>
    );
}
