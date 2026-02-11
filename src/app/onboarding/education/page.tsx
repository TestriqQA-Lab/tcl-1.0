"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function EducationPage() {
    const router = useRouter();
    // const { data: session } = useSession(); // Not needed for static UI

    // Form State
    const [formData, setFormData] = useState({
        qualification: "Post Graduation",
        course: "M.S. in Computer Science",
        courseType: "Full Time",
        specialization: "Artificial Intelligence",
        university: "Stanford University",
        startYear: 2022,
        passYear: 2026,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push("/onboarding/preferences");
        setIsSubmitting(false);
    };

    return (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-bold text-gray-900">Education details</h1>
                {/* Step Indicator if needed */}
            </div>
            <p className="text-gray-500 mb-8 max-w-2xl">
                These details help recruiters identify your academic background and technical expertise.
            </p>

            <div className="space-y-6">

                {/* Highest Qualification */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Highest Qualification</label>
                    <div className="relative">
                        <div className="w-full px-4 py-4 rounded-xl border border-gray-200 flex justify-between items-center group cursor-pointer hover:border-[#0f766d] transition-all bg-white shadow-sm">
                            <span className="font-medium text-gray-900 text-lg">{formData.qualification}</span>
                            <div className="w-6 h-6 rounded-full bg-[#0f766d] flex items-center justify-center text-white">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course / Degree */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Course / Degree</label>
                    <div className="relative">
                        <div className="w-full px-4 py-4 rounded-xl border border-gray-200 flex justify-between items-center group cursor-pointer hover:border-[#0f766d] transition-all bg-white shadow-sm">
                            <span className="font-medium text-gray-900 text-lg">{formData.course}</span>
                            <div className="w-6 h-6 rounded-full bg-[#0f766d] flex items-center justify-center text-white">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Specialization */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Specialization / Major</label>
                    <div className="relative">
                        <div className="w-full px-4 py-4 rounded-xl border border-gray-200 flex justify-between items-center group cursor-pointer hover:border-[#0f766d] transition-all bg-white shadow-sm">
                            <span className="font-medium text-gray-900 text-lg">{formData.specialization}</span>
                            <div className="w-6 h-6 rounded-full bg-[#0f766d] flex items-center justify-center text-white">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* University */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">University / College</label>
                    <div className="relative">
                        <div className="w-full px-4 py-4 rounded-xl border border-gray-200 flex justify-between items-center group cursor-pointer hover:border-[#0f766d] transition-all bg-white shadow-sm">
                            <span className="font-medium text-gray-900 text-lg">{formData.university}</span>
                            <div className="w-6 h-6 rounded-full bg-[#0f766d] flex items-center justify-center text-white">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Year */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Starting year</label>
                        <div className="relative">
                            <select
                                className="w-full appearance-none bg-white border border-gray-200 text-gray-900 text-lg rounded-xl px-4 py-4 pr-8 focus:outline-none focus:border-[#0f766d] font-medium shadow-sm transition-all"
                                value={formData.startYear}
                                onChange={(e) => setFormData({ ...formData, startYear: Number(e.target.value) })}
                            >
                                <option>2022</option>
                                <option>2023</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 items-center pointer-events-none">
                                <div className="w-5 h-5 rounded-full bg-[#0f766d] flex items-center justify-center text-white">
                                    <CheckCircle2 className="w-3 h-3" />
                                </div>
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Passing year</label>
                        <div className="relative">
                            <select
                                className="w-full appearance-none bg-white border border-gray-200 text-gray-900 text-lg rounded-xl px-4 py-4 pr-8 focus:outline-none focus:border-[#0f766d] font-medium shadow-sm transition-all"
                                value={formData.passYear}
                                onChange={(e) => setFormData({ ...formData, passYear: Number(e.target.value) })}
                            >
                                <option>2026</option>
                                <option>2027</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 items-center pointer-events-none">
                                <div className="w-5 h-5 rounded-full bg-[#0f766d] flex items-center justify-center text-white">
                                    <CheckCircle2 className="w-3 h-3" />
                                </div>
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-100 mt-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 font-semibold hover:text-gray-900"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-[#0e746b] text-white font-bold rounded-lg hover:bg-[#0b5c55] transition-colors shadow-lg shadow-[#0f766d]/20 flex items-center gap-2 disabled:opacity-70"
                >
                    {isSubmitting ? "Saving..." : "Save and continue"}
                </button>
            </div>
        </div>
    );
}
