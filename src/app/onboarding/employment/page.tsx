"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ArrowRight, ArrowLeft } from "lucide-react";

export default function EmploymentPage() {
    const router = useRouter();
    // const { data: session } = useSession(); // Not needed for static UI

    // UI State
    const [isEmployed, setIsEmployed] = useState<boolean | null>(null); // null for initial state
    const [skillsList, setSkillsList] = useState<string[]>([]);
    const [currentSkill, setCurrentSkill] = useState("");

    // Form State (Simple object for MVP)
    const [formData, setFormData] = useState({
        totalExpYears: 2,
        totalExpMonths: 6,
        companyName: "Tata Consultancy Services",
        designation: "Full Stack Developer",
        currentCity: "Mumbai",
        joiningMonth: "Mar",
        joiningYear: "2022",
        endMonth: "Present",
        endYear: "Present",
        salary: 800000,
        noticePeriod: "15 Days or less",
        industry: "IT Services & Consulting",
        department: "Engineering - Software & QA",
        roleCategory: "Software Development",
        jobRole: "Full Stack Developer",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSkillKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && currentSkill.trim()) {
            e.preventDefault();
            if (!skillsList.includes(currentSkill.trim())) {
                setSkillsList([...skillsList, currentSkill.trim()]);
            }
            setCurrentSkill("");
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkillsList(skillsList.filter(skill => skill !== skillToRemove));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push("/onboarding/education");
        setIsSubmitting(false);
    };

    return (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Employment details</h1>
            <p className="text-gray-500 mb-8 max-w-2xl">
                These details help recruiters identify your professional experience and match you with the right opportunities.
            </p>

            {/* Current Status */}
            <div className="mb-8">
                <h3 className="text-xs font-bold text-[#0f766d] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0f766d]"></span>
                    Current Status
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Are you currently employed?</label>
                        <div className="flex bg-gray-50 p-1 rounded-xl">
                            <button
                                onClick={() => setIsEmployed(true)}
                                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${isEmployed === true ? "bg-white text-[#0f766d] shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setIsEmployed(false)}
                                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${isEmployed === false ? "bg-white text-[#0f766d] shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                            >
                                No
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Total work experience</label>
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <select
                                    className="w-full appearance-none bg-white border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 pr-8 focus:outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d]"
                                    value={formData.totalExpYears}
                                    onChange={(e) => setFormData({ ...formData, totalExpYears: Number(e.target.value) })}
                                >
                                    {[...Array(30)].map((_, i) => <option key={i} value={i}>{i} Years</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            <div className="relative flex-1">
                                <select
                                    className="w-full appearance-none bg-white border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 pr-8 focus:outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d]"
                                    value={formData.totalExpMonths}
                                    onChange={(e) => setFormData({ ...formData, totalExpMonths: Number(e.target.value) })}
                                >
                                    {[...Array(12)].map((_, i) => <option key={i} value={i}>{i} Months</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Current Employment */}
            {isEmployed && (
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-[#0f766d] uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0f766d]"></span>
                        Current Employment
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Company Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#0f766d] transition-colors"
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                placeholder="e.g. Google"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Designation / Title</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#0f766d] transition-colors"
                                value={formData.designation}
                                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                placeholder="e.g. Senior Developer"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Current City</label>
                        <div className="flex flex-wrap gap-2 items-center">
                            <div className="px-3 py-1.5 bg-[#E8F3F2] text-[#0f766d] rounded-lg text-sm font-medium flex items-center gap-2">
                                {formData.currentCity}
                                <button className="hover:text-red-500"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
                            </div>
                            <button className="px-3 py-1.5 border border-dashed border-gray-300 text-gray-500 rounded-lg text-sm font-medium hover:border-[#0f766d] hover:text-[#0f766d] transition-colors">
                                + Add City
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Duration & Compensation */}
            {isEmployed && (
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-[#0f766d] uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0f766d]"></span>
                        Duration & Compensation
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Joined</label>
                            <div className="flex gap-2">
                                <select className="w-full px-3 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#0f766d]">
                                    <option>Mar</option>
                                    <option>Apr</option>
                                </select>
                                <select className="w-full px-3 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#0f766d]">
                                    <option>2022</option>
                                    <option>2023</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">End Date</label>
                            <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm font-medium italic">
                                Present
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Annual Fixed Salary</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                                <input
                                    type="number"
                                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-[#0f766d] transition-colors"
                                    value={formData.salary}
                                    onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                                />
                            </div>
                            <p className="mt-1 text-[10px] text-gray-400 italic">Equivalent to: Eight lakh rupees per annum</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Notice Period</label>
                        <div className="flex flex-wrap gap-2">
                            {["15 Days or less", "30 Days", "60 Days", "Serving Notice"].map(period => (
                                <button
                                    key={period}
                                    onClick={() => setFormData({ ...formData, noticePeriod: period })}
                                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${formData.noticePeriod === period ? "bg-[#0f766d] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Skills */}
            <div className="mb-8">
                <h3 className="text-xs font-bold text-[#0f766d] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0f766d]"></span>
                    Skills & Classification
                </h3>

                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Key Skills</label>
                    <div className="relative">
                        {/* Chip Container */}
                        <div className={`w-full px-2 py-2 rounded-xl border border-gray-200 min-h-[50px] flex flex-wrap gap-2 focus-within:border-[#0f766d] bg-[#E8F3F2]/30`}>
                            <div className="px-3 py-1.5 bg-[#E8F3F2] text-[#0f766d] rounded-lg text-sm font-medium flex items-center gap-2">
                                Fullstack Development
                                <button className="hover:text-red-500"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
                            </div>
                            {skillsList.map(skill => (
                                <div key={skill} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-2">
                                    {skill}
                                    <button onClick={() => removeSkill(skill)} className="hover:text-red-500"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
                                </div>
                            ))}
                            <input
                                type="text"
                                className="flex-1 min-w-[120px] bg-transparent outline-none text-sm px-2 py-1.5"
                                placeholder="Type a skill..."
                                value={currentSkill}
                                onChange={(e) => setCurrentSkill(e.target.value)}
                                onKeyDown={handleSkillKeyDown}
                            />
                        </div>
                    </div>
                    <div className="mt-3 flex gap-2 flex-wrap">
                        <span className="text-xs text-gray-400">Suggested for you:</span>
                        {["React.js", "Node.js", "AWS", "MongoDB", "TypeScript"].map(s => (
                            <button key={s} onClick={() => { if (!skillsList.includes(s)) setSkillsList([...skillsList, s]) }} className="px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-600 hover:border-gray-300 hover:bg-gray-100">+ {s}</button>
                        ))}
                    </div>
                </div>

                {/* Industry / Dept */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Industry</label>
                        <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm font-medium">
                            {formData.industry}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Department</label>
                        <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm font-medium">
                            {formData.department}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Role Category</label>
                        <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm font-medium">
                            {formData.roleCategory}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Job Role</label>
                        <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm font-medium">
                            {formData.jobRole}
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-100">
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
