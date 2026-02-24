"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronDown, ArrowLeft, CheckCircle2 } from "lucide-react";
import { updateEducationAction } from "@/actions/onboarding.actions";

export default function EducationPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial Date setup
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 40 }, (_, i) => currentYear - i); // Past 40 years
    const futureYears = Array.from({ length: 10 }, (_, i) => currentYear + i + 1); // Next 10 years (for passing)

    // Degree State
    const [degree, setDegree] = useState({
        degreeName: "",
        specialization: "",
        collegeName: "",
        startYear: currentYear - 4,
        endYear: currentYear,
        isPursuing: false,
        cgpa: "",
    });

    // Class 12 State
    const [class12, setClass12] = useState({
        schoolName: "",
        specialization: "",
        startYear: currentYear - 6,
        endYear: currentYear - 4,
        isPursuing: false,
    });

    // Fetch Data on Mount
    React.useEffect(() => {
        const fetchData = async () => {
            if (session?.user?.id) {
                try {
                    const { getEducationAction } = await import("@/actions/onboarding.actions");
                    const result = await getEducationAction(session.user.id);

                    if (result.success && result.data) {
                        const { degree: degreeData, class12: class12Data } = result.data;

                        if (degreeData) {
                            setDegree({
                                degreeName: degreeData.degree || degreeData.type || "",
                                specialization: degreeData.stream || "",
                                collegeName: degreeData.institute || "",
                                startYear: degreeData.passingYear ? parseInt(degreeData.passingYear) - 4 : currentYear - 4,
                                endYear: degreeData.passingYear ? parseInt(degreeData.passingYear) : currentYear,
                                isPursuing: degreeData.isPursuing || false,
                                cgpa: degreeData.percentage || "",
                            });
                        }

                        if (class12Data) {
                            setClass12({
                                schoolName: class12Data.institute || "",
                                specialization: class12Data.stream || "",
                                startYear: class12Data.passingYear ? parseInt(class12Data.passingYear) - 2 : currentYear - 6,
                                endYear: class12Data.passingYear ? parseInt(class12Data.passingYear) : currentYear - 4,
                                isPursuing: class12Data.isPursuing || false,
                            });
                        }
                    }
                } catch (error) {
                    console.error("Failed to load education data", error);
                }
            }
        };

        fetchData();
    }, [session?.user?.id]);

    const handleSubmit = async () => {
        console.log("Submitting Education Details...");
        if (!session?.user?.id) {
            console.error("No active session found.");
            alert("Session expired or invalid. Please sign in again.");
            return;
        }
        setIsSubmitting(true);

        try {
            const result = await updateEducationAction(session.user.id, {
                degree: {
                    degreeName: degree.degreeName,
                    specialization: degree.specialization,
                    collegeName: degree.collegeName,
                    startDate: new Date(degree.startYear, 0, 1),
                    endDate: degree.isPursuing ? undefined : new Date(degree.endYear, 0, 1),
                    isPursuing: degree.isPursuing,
                    cgpa: degree.cgpa,
                },
                class12: {
                    schoolName: class12.schoolName,
                    specialization: class12.specialization,
                    startDate: new Date(class12.startYear, 0, 1),
                    endDate: class12.isPursuing ? undefined : new Date(class12.endYear, 0, 1),
                    isPursuing: class12.isPursuing,
                },
            });

            if (result.error) {
                console.error("Server Action Error:", result.error);
                alert(`Error saving details: ${result.error}`);
            } else {
                console.log("Education details saved successfully.");
                router.push("/onboarding/preferences");
            }
        } catch (error) {
            console.error("Submission Error:", error);
            alert("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-5 md:p-8 border border-gray-100 shadow-sm space-y-10">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Education Details</h1>
                <p className="text-gray-500 max-w-2xl">
                    Provide your educational background to help us verify your qualifications.
                </p>
            </div>

            {/* 1. First Degree Information */}
            <div className="space-y-6">
                <h3 className="text-sm font-bold text-[#0f766d] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0f766d]"></span>
                    First Degree Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Degree Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg ring-2 ring-gray-200 text-sm focus:ring-[#0f766d] focus:outline-none"
                            placeholder="e.g. B.Tech, B.Sc"
                            value={degree.degreeName}
                            onChange={(e) => setDegree({ ...degree, degreeName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Specialization</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg ring-2 ring-gray-200 text-sm focus:ring-[#0f766d] focus:outline-none"
                            placeholder="e.g. Computer Science"
                            value={degree.specialization}
                            onChange={(e) => setDegree({ ...degree, specialization: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">College Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg ring-2 ring-gray-200 text-sm focus:ring-[#0f766d] focus:outline-none"
                            placeholder="e.g. IIT Bombay"
                            value={degree.collegeName}
                            onChange={(e) => setDegree({ ...degree, collegeName: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Starting Year</label>
                        <div className="relative">
                            <select
                                className="w-full appearance-none bg-white ring-2 ring-gray-200 text-sm rounded-lg px-4 py-3 pr-8 focus:ring-[#0f766d] focus:outline-none"
                                value={degree.startYear}
                                onChange={(e) => setDegree({ ...degree, startYear: Number(e.target.value) })}
                            >
                                {years.map((y) => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Ending Year</label>
                        <div className="relative">
                            <select
                                className="w-full appearance-none bg-white ring-2 ring-gray-200 text-sm rounded-lg px-4 py-3 pr-8 focus:ring-[#0f766d] focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
                                value={degree.endYear}
                                onChange={(e) => setDegree({ ...degree, endYear: Number(e.target.value) })}
                                disabled={degree.isPursuing}
                            >
                                {[...years, ...futureYears].sort().map((y) => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="degreePursuing"
                                checked={degree.isPursuing}
                                onChange={(e) => setDegree({ ...degree, isPursuing: e.target.checked })}
                                className="w-4 h-4 text-[#0f766d] rounded border-gray-300 focus:ring-[#0f766d]"
                            />
                            <label htmlFor="degreePursuing" className="text-xs font-medium text-gray-600 cursor-pointer">Currently Pursuing</label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">CGPA / Percentage</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg ring-2 ring-gray-200 text-sm focus:ring-[#0f766d] focus:outline-none"
                            placeholder="e.g. 8.5"
                            value={degree.cgpa}
                            onChange={(e) => setDegree({ ...degree, cgpa: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <hr className="border border-[#0f766d]" />

            {/* 2. Class 12 Information */}
            <div className="space-y-6">
                <h3 className="text-sm font-bold text-[#0f766d] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0f766d]"></span>
                    Class 12 Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">School / College Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg ring-2 ring-gray-200 text-sm focus:ring-[#0f766d] focus:outline-none"
                            placeholder="e.g. Delhi Public School"
                            value={class12.schoolName}
                            onChange={(e) => setClass12({ ...class12, schoolName: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Specialization / Stream</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg ring-2 ring-gray-200 text-sm focus:ring-[#0f766d] focus:outline-none"
                            placeholder="e.g. Science (PCM)"
                            value={class12.specialization}
                            onChange={(e) => setClass12({ ...class12, specialization: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Starting Year</label>
                        <div className="relative">
                            <select
                                className="w-full appearance-none bg-white ring-2 ring-gray-200 text-sm rounded-lg px-4 py-3 pr-8 focus:ring-[#0f766d] focus:outline-none"
                                value={class12.startYear}
                                onChange={(e) => setClass12({ ...class12, startYear: Number(e.target.value) })}
                            >
                                {years.map((y) => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Ending Year</label>
                        <div className="relative">
                            <select
                                className="w-full appearance-none bg-white ring-2 ring-gray-200 text-sm rounded-lg px-4 py-3 pr-8 focus:ring-[#0f766d] focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
                                value={class12.endYear}
                                onChange={(e) => setClass12({ ...class12, endYear: Number(e.target.value) })}
                                disabled={class12.isPursuing}
                            >
                                {years.map((y) => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="class12Pursuing"
                                checked={class12.isPursuing}
                                onChange={(e) => setClass12({ ...class12, isPursuing: e.target.checked })}
                                className="w-4 h-4 text-[#0f766d] rounded focus:ring-[#0f766d]"
                            />
                            <label htmlFor="class12Pursuing" className="text-xs font-medium text-gray-600 cursor-pointer">Currently Pursuing</label>
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
                    className="px-4 md:px-8 py-3 bg-[#0e746b] text-white font-bold rounded-full hover:bg-[#0b5c55] transition-colors shadow-lg shadow-[#0f766d]/20 flex items-center gap-2 disabled:opacity-70"
                >
                    {isSubmitting ? "Saving..." : "Save and continue"}
                </button>
            </div>
        </div>
    );
}
