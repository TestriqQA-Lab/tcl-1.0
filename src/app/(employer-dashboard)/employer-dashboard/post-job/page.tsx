"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronDown, Plus, Check, X, Copy, Trash2, RotateCw, Bold, Italic, Underline, AlignLeft, List, Lightbulb, Info } from "lucide-react";
import { DashboardTopBar } from "@/components/employer-dashboard/DashboardTopBar";
import { TabletNavStrip } from "@/components/employer-dashboard/TabletNavStrip";

const steps = [
    "Job details",
    "Candidate preferences",
    "Screening questions",
    "Job description",
    "Communication preferences",
];

export default function PostJobPage() {
    const [activeStepIndex, setActiveStepIndex] = useState(0);

    // Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Step 1 State
    const [jobTitle, setJobTitle] = useState("");
    const [minExp, setMinExp] = useState("");
    const [maxExp, setMaxExp] = useState("");
    const [minSal, setMinSal] = useState("");
    const [maxSal, setMaxSal] = useState("");
    const [perkSearch, setPerkSearch] = useState("");

    // Step 2 State
    const [candidateLocType, setCandidateLocType] = useState("Anywhere in India");
    const [specificCity, setSpecificCity] = useState("");
    const [relocationAllowance, setRelocationAllowance] = useState(false);
    const [education, setEducation] = useState("");
    const [skillsSearch, setSkillsSearch] = useState("");
    const [selectedGender, setSelectedGender] = useState("Any");

    // Step 3 State
    const [selectedQuestions, setSelectedQuestions] = useState(["experience", "education", "english"]);
    const [minExpYears, setMinExpYears] = useState("1");
    const [minEducationLevel, setMinEducationLevel] = useState("Graduate");
    const [englishLevel, setEnglishLevel] = useState("Good English");

    // Step 4 State
    const [jobDescription, setJobDescription] = useState("Responsibilities:\n* Close deals through persuasive selling techniques\n* Generate leads through cold calling, networking & social media\n* Collaborate with marketing team on campaigns & promotions");
    const [companyDescription, setCompanyDescription] = useState("");

    // Step 5 State
    const [allowCalls, setAllowCalls] = useState(true);
    const [recruiterName, setRecruiterName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [callStartTime, setCallStartTime] = useState("09:00 AM");
    const [callEndTime, setCallEndTime] = useState("06:00 PM");
    const [callDays, setCallDays] = useState("Mon-Sat");
    const [isDaysDropdownOpen, setIsDaysDropdownOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                router.push("/job-postings");
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, router]);

    const toggleQuestion = (id: string) => {
        if (selectedQuestions.includes(id)) {
            setSelectedQuestions(selectedQuestions.filter(q => q !== id));
        } else {
            setSelectedQuestions([...selectedQuestions, id]);
        }
    };

    const suggestedPerks = [
        "Office cab/shuttle",
        "Food allowance",
        "Health insurance",
        "Annual bonus",
        "Provident fund",
    ];

    const suggestedSkills = [
        "English communication",
        "Basic computer",
        "Sales",
        "Digital marketing",
    ];

    const handleNext = () => {
        if (activeStepIndex < steps.length - 1) {
            setActiveStepIndex(activeStepIndex + 1);
            window.scrollTo(0, 0);
        } else {
            setIsSuccess(true);
        }
    };

    const handleBack = () => {
        if (activeStepIndex > 0) {
            setActiveStepIndex(activeStepIndex - 1);
            window.scrollTo(0, 0);
        }
    };

    return (
        <div className="flex flex-col min-h-screen w-full bg-white font-inter">
            {/* Dashboard Navigation Area (Visible on Desktop/Tablet) */}
            <div className="flex flex-col w-full">
                {/* Top Bar (responsive) */}
                <DashboardTopBar hideDesktopBar={true} />

                {/* Tablet Nav Strip (Standard for Dashboard/Applications) */}
                <TabletNavStrip activePage="Jobs" />
            </div>

            {/* Mobile-Only Flow Header (Back button for focused task) */}
            <div className="md:hidden flex items-center h-[56px] px-4 border-b border-[#e5e7eb] shrink-0 bg-white">
                {activeStepIndex === 0 ? (
                    <Link
                        href="/employer-dashboard"
                        className="flex items-center gap-2 text-[#374151] hover:text-[#111827] transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span className="text-[15px] font-medium">Back</span>
                    </Link>
                ) : (
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-[#374151] hover:text-[#111827] transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span className="text-[15px] font-medium">Back</span>
                    </button>
                )}
            </div>

            {/* Main Content Layout */}
            <div className="flex flex-col lg:flex-row flex-1 w-full relative">

                {/* Scrollable Container */}
                <div className="flex flex-col lg:flex-row w-full max-w-[1440px] mx-auto flex-1">

                    {/* Left Stepper Sidebar - Hidden on Tablet & Mobile */}
                    <div className="hidden lg:flex flex-col lg:w-[320px] lg:pl-[100px] lg:pr-10 lg:py-[60px] shrink-0 border-r border-[#e5e7eb] lg:border-none">

                        <div className="flex flex-col lg:items-center lg:flex-row gap-2 lg:gap-3 mb-6 lg:mb-10">
                            <h1 className="text-[18px] md:text-[20px] lg:text-[24px] font-semibold text-[#111827]">
                                Post a job
                            </h1>
                            <div className="bg-[#eaf5e9] px-3 py-1 rounded-md w-fit">
                                <span className="text-[#2e7d32] text-[13px] lg:text-[14px] font-medium">
                                    Free
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 lg:gap-4">
                            {steps.map((step, index) => {
                                const isActive = index === activeStepIndex;
                                const isCompleted = index < activeStepIndex;
                                return (
                                    <div
                                        key={index}
                                        className={`flex items-center gap-3 lg:gap-4 w-full rounded-lg transition-colors ${isActive
                                                ? "bg-[#f3f4f6] px-3 py-2.5 lg:px-4 lg:py-3"
                                                : "px-3 py-2.5 lg:px-4 lg:py-3 hover:bg-gray-50 cursor-pointer"
                                            }`}
                                        onClick={() => index <= activeStepIndex && setActiveStepIndex(index)}
                                    >
                                        <div
                                            className={`flex items-center justify-center rounded-full border transition-all ${isCompleted
                                                    ? "size-[16px] lg:size-[20px] border-[#0f766d] bg-[#0f766d]"
                                                    : isActive
                                                        ? "size-[16px] lg:size-[20px] border-[#0f766d] bg-white ring-2 ring-[#0f766d]/10"
                                                        : "size-[16px] lg:size-[20px] border-[#e5e7eb] bg-white"
                                                }`}
                                        >
                                            {isCompleted ? (
                                                <Check size={12} className="text-white" />
                                            ) : isActive && (
                                                <div className="size-[6px] lg:size-[8px] bg-[#0f766d] rounded-full"></div>
                                            )}
                                        </div>
                                        <span
                                            className={`text-[14px] lg:text-[15px] ${isActive
                                                    ? "font-semibold text-[#1f2937]"
                                                    : isCompleted
                                                        ? "font-medium text-[#374151]"
                                                        : "font-normal text-[#6b7280]"
                                                }`}
                                        >
                                            {step}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Form Area */}
                    <div className="flex flex-col flex-1 px-4 pb-20 pt-2 md:px-6 md:pb-24 lg:px-10 lg:pl-10 lg:py-[60px] lg:max-w-[800px] w-full mx-auto lg:mx-0">

                        {activeStepIndex === 0 && (
                            <>
                                {/* Step 1: Job Details */}
                                <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-2 mb-6 lg:mb-8">
                                    <span className="text-[14px] lg:text-[15px] text-[#6b7280]">
                                        Begin from scratch or
                                    </span>
                                    <button className="text-[14px] lg:text-[15px] font-semibold text-[#0f766d] hover:underline flex items-center w-fit">
                                        Prefill from previous jobs
                                    </button>
                                </div>

                                <div className="flex flex-col gap-6 lg:gap-8 w-full">
                                    <div className="flex flex-col gap-2 w-full">
                                        <label className="text-[14px] font-semibold text-[#374151]">Job title</label>
                                        <div className="flex items-center w-full h-11 bg-white border border-[#d1d5db] rounded-md px-4 focus-within:border-[#0f766d] focus-within:ring-1 focus-within:ring-[#0f766d] transition-all">
                                            <input
                                                type="text"
                                                value={jobTitle}
                                                onChange={(e) => setJobTitle(e.target.value)}
                                                placeholder="Ex. Sales manager"
                                                className="w-full bg-transparent outline-none text-[14px] lg:text-[15px] text-[#111827] placeholder:text-[#9ca3af]"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 w-full">
                                        <label className="text-[14px] font-semibold text-[#374151]">Work experience</label>
                                        <div className="flex items-center gap-3 w-full">
                                            <div className="relative flex-1">
                                                <select value={minExp} onChange={(e) => setMinExp(e.target.value)} className="w-full h-11 bg-white border border-[#d1d5db] rounded-md pl-4 pr-10 text-[14px] lg:text-[15px] appearance-none outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d] transition-all cursor-pointer text-[#111827]"><option value="" disabled hidden>Min exp.</option><option value="0">0 years</option><option value="1">1 year</option></select><ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
                                            </div>
                                            <span className="text-[14px] text-[#6b7280]">to</span>
                                            <div className="relative flex-1">
                                                <select value={maxExp} onChange={(e) => setMaxExp(e.target.value)} className="w-full h-11 bg-white border border-[#d1d5db] rounded-md pl-4 pr-10 text-[14px] lg:text-[15px] appearance-none outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d] transition-all cursor-pointer text-[#111827]"><option value="" disabled hidden>Max exp.</option><option value="5">5+ years</option></select><ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 w-full">
                                        <label className="text-[14px] font-semibold text-[#374151]">Salary per month</label>
                                        <div className="flex items-center gap-2 lg:gap-4 w-full">
                                            <div className="flex items-center w-full h-11 bg-white border border-[#d1d5db] rounded-md px-3 lg:px-4 active:border-[#0f766d]">
                                                <span className="text-[13px] text-[#9ca3af] font-medium">₹</span>
                                                <div className="w-[1px] h-5 bg-[#e5e7eb] mx-2"></div>
                                                <input type="number" placeholder="Min" className="w-full outline-none text-[14px]" />
                                            </div>
                                            <span className="text-[14px] text-[#6b7280]">to</span>
                                            <div className="flex items-center w-full h-11 bg-white border border-[#d1d5db] rounded-md px-3 lg:px-4">
                                                <span className="text-[13px] text-[#9ca3af] font-medium">₹</span>
                                                <div className="w-[1px] h-5 bg-[#e5e7eb] mx-2"></div>
                                                <input type="number" placeholder="Max" className="w-full outline-none text-[14px]" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 w-full">
                                        <label className="text-[14px] font-semibold text-[#374151]">Perks and benefits <span className="text-[#6b7280] font-normal">(Optional)</span></label>
                                        <div className="flex items-center w-full h-11 bg-white border border-[#d1d5db] rounded-md px-4"><input type="text" placeholder="Search for perks" className="w-full outline-none text-[14px]" /></div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {suggestedPerks.map((p, i) => <button key={i} className="px-3 py-1.5 rounded-full border border-[#e5e7eb] text-[12px] flex items-center gap-1.5 hover:bg-gray-50"><Plus size={14} className="text-gray-400" />{p}</button>)}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeStepIndex === 1 && (
                            <>
                                {/* Step 2: Candidate Preferences */}
                                <h2 className="text-[18px] lg:text-[20px] font-semibold text-[#111827] mb-6 lg:mb-8">
                                    Candidate preferences
                                </h2>

                                <div className="flex flex-col gap-6 lg:gap-8 w-full">
                                    {/* Candidate Requirement */}
                                    <div className="flex flex-col gap-3 w-full">
                                        <label className="text-[14px] font-semibold text-[#374151]">
                                            Candidate requirement <span className="text-[#6b7280] font-normal">(Where should the candidate currently reside?)</span>
                                        </label>
                                        <div className="flex gap-3">
                                            {["Anywhere in India", "In a specific city"].map((type) => {
                                                const isSel = candidateLocType === type;
                                                return (
                                                    <button
                                                        key={type}
                                                        onClick={() => setCandidateLocType(type)}
                                                        className={`px-6 py-2 rounded-full border text-[14px] font-medium transition-all ${isSel
                                                                ? "border-[#0f766d] bg-[#eff6f5] text-[#0f766d]"
                                                                : "border-[#d1d5db] bg-white text-[#374151] hover:border-gray-400"
                                                            }`}
                                                    >
                                                        {type}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {candidateLocType === "In a specific city" && (
                                        <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg animate-in fade-in slide-in-from-top-2">
                                            <div className="relative w-full lg:w-1/2">
                                                <select
                                                    value={specificCity}
                                                    onChange={(e) => setSpecificCity(e.target.value)}
                                                    className="w-full h-11 bg-white border border-[#d1d5db] rounded-md pl-4 pr-10 text-[14px] appearance-none outline-none focus:border-[#0f766d]"
                                                >
                                                    <option value="">Select City</option>
                                                    <option value="Mumbai">Mumbai</option>
                                                    <option value="Delhi">Delhi</option>
                                                    <option value="Bangalore">Bangalore</option>
                                                </select>
                                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
                                            </div>
                                            <label className="flex items-center gap-2 cursor-pointer mt-1">
                                                <input
                                                    type="checkbox"
                                                    checked={relocationAllowance}
                                                    onChange={(e) => setRelocationAllowance(e.target.checked)}
                                                    className="size-4 accent-[#0f766d]"
                                                />
                                                <span className="text-[14px] text-[#374151]">Provide relocation allowance</span>
                                            </label>
                                        </div>
                                    )}

                                    {/* Educational Qualification */}
                                    <div className="flex flex-col gap-2 w-full">
                                        <label className="text-[14px] font-semibold text-[#374151]">
                                            Educational qualification
                                        </label>
                                        <div className="relative w-full lg:w-1/2">
                                            <select
                                                value={education}
                                                onChange={(e) => setEducation(e.target.value)}
                                                className="w-full h-11 bg-white border border-[#d1d5db] rounded-md pl-4 pr-10 text-[14px] appearance-none outline-none focus:border-[#0f766d]"
                                            >
                                                <option value="">Select qualification</option>
                                                <option value="Graduate">Graduate</option>
                                                <option value="Postgraduate">Postgraduate</option>
                                                <option value="Doctorate">Doctorate</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    <div className="flex flex-col gap-2 w-full">
                                        <label className="text-[14px] font-semibold text-[#374151]">
                                            Specific skills requirements
                                        </label>
                                        <div className="flex items-center w-full h-11 bg-white border border-[#d1d5db] rounded-md px-4 focus-within:border-[#0f766d]">
                                            <input
                                                type="text"
                                                value={skillsSearch}
                                                onChange={(e) => setSkillsSearch(e.target.value)}
                                                placeholder="Search for skills"
                                                className="w-full outline-none text-[14px]"
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {suggestedSkills.map((s, i) => (
                                                <button key={i} className="px-3 py-1.5 rounded-full border border-[#e5e7eb] text-[12px] flex items-center gap-1.5 hover:bg-gray-50">
                                                    <Plus size={14} className="text-gray-400" />
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Gender */}
                                    <div className="flex flex-col gap-3 w-full">
                                        <label className="text-[14px] font-semibold text-[#374151]">
                                            Preferred candidate gender
                                        </label>
                                        <div className="flex gap-3">
                                            {["Any", "Male", "Female"].map((g) => {
                                                const isSel = selectedGender === g;
                                                return (
                                                    <button
                                                        key={g}
                                                        onClick={() => setSelectedGender(g)}
                                                        className={`px-8 py-2 rounded-full border text-[14px] font-medium transition-all ${isSel
                                                                ? "border-[#0f766d] bg-[#eff6f5] text-[#0f766d]"
                                                                : "border-[#d1d5db] bg-white text-[#374151] hover:border-gray-400"
                                                            }`}
                                                    >
                                                        {g}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeStepIndex === 2 && (
                            <>
                                {/* Step 3: Screening questions */}
                                <div className="flex flex-col mb-6 lg:mb-8">
                                    <h2 className="text-[18px] lg:text-[20px] font-semibold text-[#111827]">
                                        Screening questions
                                    </h2>
                                    <p className="text-[14px] text-[#6b7280] mt-1">
                                        Add screening questions to filter out the most qualified candidates.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-4 w-full">
                                    {/* Question Card: Experience */}
                                    <div className={`p-4 lg:p-6 rounded-xl border transition-all ${selectedQuestions.includes("experience") ? "border-[#0f766d] bg-[#eff6f5]/30 shadow-sm" : "border-[#e5e7eb] bg-white"}`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-3 lg:gap-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedQuestions.includes("experience")}
                                                    onChange={() => toggleQuestion("experience")}
                                                    className="size-5 mt-0.5 accent-[#0f766d] cursor-pointer"
                                                />
                                                <div className="flex flex-col gap-3 lg:gap-4">
                                                    <span className="text-[15px] font-semibold text-[#111827]">What is the total years of experience you are looking for in a candidate?</span>
                                                    {selectedQuestions.includes("experience") && (
                                                        <div className="flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
                                                            <span className="text-[14px] text-[#374151]">Minimum</span>
                                                            <div className="relative w-24">
                                                                <select
                                                                    value={minExpYears}
                                                                    onChange={(e) => setMinExpYears(e.target.value)}
                                                                    className="w-full h-10 bg-white border border-[#d1d5db] rounded-md px-3 text-[14px] appearance-none outline-none focus:border-[#0f766d]"
                                                                >
                                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(y => <option key={y} value={y}>{y} {y === 1 ? 'year' : 'years'}</option>)}
                                                                </select>
                                                                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Question Card: Education */}
                                    <div className={`p-4 lg:p-6 rounded-xl border transition-all ${selectedQuestions.includes("education") ? "border-[#0f766d] bg-[#eff6f5]/30 shadow-sm" : "border-[#e5e7eb] bg-white"}`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-3 lg:gap-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedQuestions.includes("education")}
                                                    onChange={() => toggleQuestion("education")}
                                                    className="size-5 mt-0.5 accent-[#0f766d] cursor-pointer"
                                                />
                                                <div className="flex flex-col gap-3 lg:gap-4">
                                                    <span className="text-[15px] font-semibold text-[#111827]">What is the minimum education level required for this role?</span>
                                                    {selectedQuestions.includes("education") && (
                                                        <div className="relative w-full md:w-64 animate-in fade-in zoom-in-95 duration-200">
                                                            <select
                                                                value={minEducationLevel}
                                                                onChange={(e) => setMinEducationLevel(e.target.value)}
                                                                className="w-full h-10 bg-white border border-[#d1d5db] rounded-md px-3 text-[14px] appearance-none outline-none focus:border-[#0f766d]"
                                                            >
                                                                <option value="12th Pass">12th Pass</option>
                                                                <option value="Graduate">Graduate</option>
                                                                <option value="Postgraduate">Postgraduate</option>
                                                            </select>
                                                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Question Card: English */}
                                    <div className={`p-4 lg:p-6 rounded-xl border transition-all ${selectedQuestions.includes("english") ? "border-[#0f766d] bg-[#eff6f5]/30 shadow-sm" : "border-[#e5e7eb] bg-white"}`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-3 lg:gap-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedQuestions.includes("english")}
                                                    onChange={() => toggleQuestion("english")}
                                                    className="size-5 mt-0.5 accent-[#0f766d] cursor-pointer"
                                                />
                                                <div className="flex flex-col gap-3 lg:gap-4">
                                                    <span className="text-[15px] font-semibold text-[#111827]">What level of English speaking skills do you expect?</span>
                                                    {selectedQuestions.includes("english") && (
                                                        <div className="relative w-full md:w-64 animate-in fade-in zoom-in-95 duration-200">
                                                            <select
                                                                value={englishLevel}
                                                                onChange={(e) => setEnglishLevel(e.target.value)}
                                                                className="w-full h-10 bg-white border border-[#d1d5db] rounded-md px-3 text-[14px] appearance-none outline-none focus:border-[#0f766d]"
                                                            >
                                                                <option value="No English">No English</option>
                                                                <option value="Basic English">Basic English</option>
                                                                <option value="Good English">Good English</option>
                                                                <option value="Fluent English">Fluent English</option>
                                                            </select>
                                                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Add Custom Question Button */}
                                    <button
                                        onClick={() => setIsDrawerOpen(true)}
                                        className="flex items-center gap-2 mt-2 px-1 text-[#0f766d] hover:text-[#0d635c] transition-colors w-fit group"
                                    >
                                        <div className="size-6 rounded-full border border-[#0f766d] flex items-center justify-center group-hover:bg-[#f0f9f8]">
                                            <Plus size={14} />
                                        </div>
                                        <span className="text-[14px] font-semibold">Add a custom question</span>
                                    </button>
                                </div>
                            </>
                        )}

                        {activeStepIndex === 3 && (
                            <>
                                <h1 className="text-[20px] lg:text-[24px] font-bold text-[#111827] mb-2">Job description</h1>

                                <div className="flex flex-col gap-6">
                                    {/* Info Banner */}
                                    <div className="flex items-center gap-3 p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg">
                                        <Lightbulb size={20} className="text-[#334155] shrink-0 fill-current opacity-20" />
                                        <p className="text-[14px] text-[#334155]">
                                            Auto-generated based on your details. You can edit it as well.
                                        </p>
                                    </div>

                                    {/* Job Description Editor Card */}
                                    <div className="flex flex-col border border-[#e5e7eb] rounded-xl overflow-hidden">
                                        {/* Editor Toolbar */}
                                        <div className="flex items-center justify-between px-4 py-3 bg-[#f9fafb] border-b border-[#e5e7eb]">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 border-r border-gray-300 pr-4">
                                                    <button className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors"><Bold size={16} /></button>
                                                    <button className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors"><Italic size={16} /></button>
                                                    <button className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors"><Underline size={16} /></button>
                                                </div>
                                                <div className="flex items-center gap-1.5 border-r border-gray-300 pr-4">
                                                    <button className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors"><AlignLeft size={16} /></button>
                                                    <button className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors"><List size={16} /></button>
                                                </div>
                                            </div>
                                            <button className="flex items-center gap-2 px-3 py-1.5 border border-[#0f766d] rounded text-[#0f766d] text-[13px] font-semibold hover:bg-[#f0f9f8] transition-colors">
                                                <RotateCw size={14} />
                                                Regenerate
                                            </button>
                                        </div>

                                        {/* Textarea Area */}
                                        <div className="relative p-4 bg-white">
                                            <textarea
                                                value={jobDescription}
                                                onChange={(e) => setJobDescription(e.target.value)}
                                                className="w-full min-h-[220px] outline-none text-[15px] leading-relaxed text-[#111827] resize-none overflow-y-auto"
                                                placeholder="Enter job responsibilities..."
                                            />
                                            <div className="absolute bottom-4 right-4 text-[12px] text-gray-400 font-medium">
                                                {jobDescription.length}/1000
                                            </div>
                                        </div>
                                    </div>

                                    {/* About Company Section */}
                                    <div className="flex flex-col gap-4 mt-2">
                                        <h3 className="text-[16px] font-semibold text-[#111827]">About company <span className="text-gray-400 font-normal ml-1">(Optional)</span></h3>
                                        <div className="relative border border-[#e5e7eb] rounded-xl overflow-hidden focus-within:border-[#0f766d] transition-colors">
                                            <textarea
                                                value={companyDescription}
                                                onChange={(e) => setCompanyDescription(e.target.value)}
                                                className="w-full min-h-[140px] px-5 py-4 outline-none text-[15px] leading-relaxed text-[#111827] resize-none"
                                                placeholder="Add your company details, address, website."
                                            />
                                            <div className="absolute bottom-4 right-5 text-[12px] text-gray-400 font-medium">
                                                {companyDescription.length}/500
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeStepIndex === 4 && (
                            <>
                                <h1 className="text-[20px] lg:text-[24px] font-bold text-[#111827] mb-2">Communication preferences</h1>

                                <div className="flex flex-col gap-6">
                                    {/* Question 1: Allow calls */}
                                    <div className="flex flex-col gap-4">
                                        <p className="text-[15px] font-semibold text-[#111827]">Allow candidates to call you directly for this job?</p>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setAllowCalls(true)}
                                                className={`px-8 py-2 rounded-full border text-[14px] font-semibold transition-all ${allowCalls ? "border-[#0f766d] bg-[#eff6f5] text-[#0f766d]" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                                            >
                                                Yes
                                            </button>
                                            <button
                                                onClick={() => setAllowCalls(false)}
                                                className={`px-8 py-2 rounded-full border text-[14px] font-semibold transition-all ${!allowCalls ? "border-[#0f766d] bg-[#eff6f5] text-[#0f766d]" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                                            >
                                                No
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 text-[#6b7280]">
                                            <Info size={14} className="shrink-0" />
                                            <span className="text-[13px]">Complete KYC after posting job to get candidate calls</span>
                                        </div>
                                    </div>

                                    {allowCalls && (
                                        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                            {/* Candidate will be calling Section */}
                                            <div className="flex flex-col gap-4">
                                                <h3 className="text-[16px] font-semibold text-[#111827]">Candidate will be calling</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center h-11 border border-[#d1d5db] rounded-md px-4 focus-within:border-[#0f766d] transition-colors bg-white">
                                                            <input
                                                                type="text"
                                                                value={recruiterName}
                                                                onChange={(e) => setRecruiterName(e.target.value)}
                                                                placeholder="Recruiter name"
                                                                className="w-full outline-none text-[14px] text-[#111827]"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center h-11 border border-[#d1d5db] rounded-md overflow-hidden focus-within:border-[#0f766d] transition-colors bg-white">
                                                        <div className="h-full px-3 border-r border-[#d1d5db] bg-gray-100 flex items-center justify-center text-[14px] text-[#374151] font-medium">
                                                            +91
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={mobileNumber}
                                                            onChange={(e) => setMobileNumber(e.target.value)}
                                                            placeholder="Mobile Number"
                                                            className="w-full h-full px-4 outline-none text-[14px] text-[#111827]"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-[#6b7280]">
                                                    <Info size={14} className="shrink-0" />
                                                    <span className="text-[13px]">You can stop receiving calls by editing the job later</span>
                                                </div>
                                            </div>

                                            {/* Receive calls between Section */}
                                            <div className="flex flex-col gap-4">
                                                <h3 className="text-[16px] font-semibold text-[#111827]">Receive calls between</h3>
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-full md:w-44">
                                                        <select
                                                            value={callStartTime}
                                                            onChange={(e) => setCallStartTime(e.target.value)}
                                                            className="w-full h-11 border border-[#d1d5db] rounded-md px-4 text-[14px] appearance-none outline-none focus:border-[#0f766d] bg-white"
                                                        >
                                                            <option>09:00 AM</option>
                                                            <option>10:00 AM</option>
                                                            <option>11:00 AM</option>
                                                        </select>
                                                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                    </div>
                                                    <span className="text-gray-400 text-[14px]">to</span>
                                                    <div className="relative w-full md:w-44">
                                                        <select
                                                            value={callEndTime}
                                                            onChange={(e) => setCallEndTime(e.target.value)}
                                                            className="w-full h-11 border border-[#d1d5db] rounded-md px-4 text-[14px] appearance-none outline-none focus:border-[#0f766d] bg-white"
                                                        >
                                                            <option>06:00 PM</option>
                                                            <option>07:00 PM</option>
                                                            <option>08:00 PM</option>
                                                        </select>
                                                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Days Selection */}
                                            <div className="flex flex-col gap-2 relative">
                                                <div
                                                    onClick={() => setIsDaysDropdownOpen(!isDaysDropdownOpen)}
                                                    className="flex items-center gap-2 group cursor-pointer w-fit"
                                                >
                                                    <span className="text-[14px] font-semibold text-[#374151]">Days:</span>
                                                    <div className="flex items-center gap-1 text-[#0f766d] font-semibold text-[14px]">
                                                        <span>{callDays}</span>
                                                        <ChevronDown size={14} className={`transition-transform duration-200 ${isDaysDropdownOpen ? "rotate-180" : ""}`} />
                                                    </div>
                                                </div>

                                                {/* Days Dropdown Menu */}
                                                {isDaysDropdownOpen && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-[110]"
                                                            onClick={() => setIsDaysDropdownOpen(false)}
                                                        />
                                                        <div className="absolute top-8 left-10 w-40 bg-white border border-[#e5e7eb] rounded-lg shadow-lg py-1 z-[120] animate-in fade-in zoom-in-95 duration-150">
                                                            {["Everyday", "Mon-Fri", "Mon-Sat"].map((day) => (
                                                                <button
                                                                    key={day}
                                                                    onClick={() => {
                                                                        setCallDays(day);
                                                                        setIsDaysDropdownOpen(false);
                                                                    }}
                                                                    className={`w-full text-left px-4 py-2.5 text-[14px] hover:bg-[#eff6f5] hover:text-[#0f766d] transition-colors ${callDays === day ? "text-[#0f766d] font-medium bg-[#eff6f5]" : "text-[#374151]"}`}
                                                                >
                                                                    {day}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {/* Availability Banner */}
                                            <div className="flex items-center gap-3 p-4 bg-[#334155] rounded-xl text-white">
                                                <div className="size-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                                    <Lightbulb size={18} className="text-[#facc15] fill-[#facc15]" />
                                                </div>
                                                <p className="text-[13px] leading-relaxed">
                                                    Candidates will be able to call you only during your specified availability, but they will not have your number
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Spacing for mobile scroll to ensure content isn't hidden behind the fixed bottom bar */}
                        <div className="h-32 lg:h-10"></div>
                    </div>
                </div>

                {/* Drawer Overlay */}
                {isDrawerOpen && (
                    <div
                        className="fixed inset-0 bg-black/40 z-[90] transition-opacity animate-in fade-in duration-300"
                        onClick={() => setIsDrawerOpen(false)}
                    />
                )}

                {/* Custom Question Drawer */}
                <div className={`fixed top-0 right-0 h-full w-full md:w-[600px] bg-white z-[100] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}>
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-[#e5e7eb] shrink-0">
                        <h2 className="text-[18px] lg:text-[20px] font-semibold text-[#111827]">Add questions</h2>
                        <button
                            onClick={() => setIsDrawerOpen(false)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={22} className="text-[#6b7280]" />
                        </button>
                    </div>

                    {/* Drawer Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar pb-32">
                        {/* Question Block 1 */}
                        <div className="flex flex-col gap-6 p-5 lg:p-6 border border-[#e5e7eb] rounded-xl mb-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[14px] font-semibold text-[#374151]">Question 1</span>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <div className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" checked />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0f766d]"></div>
                                        </div>
                                        <span className="text-[13px] text-[#6b7280]">Mandatory</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center w-full h-11 bg-white border border-[#d1d5db] rounded-md px-4 focus-within:border-[#0f766d]">
                                    <input
                                        type="text"
                                        placeholder="Enter your question here"
                                        className="w-full outline-none text-[15px] text-[#111827]"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <span className="text-[13px] text-[#6b7280]">Question type:</span>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { label: "Single choice", selected: true },
                                        { label: "Multiple choice", selected: false },
                                        { label: "Short answer", selected: false }
                                    ].map((type, i) => (
                                        <button
                                            key={i}
                                            className={`px-4 py-1.5 rounded-full border text-[13px] font-medium transition-all ${type.selected
                                                    ? "border-[#0f766d] bg-[#eff6f5] text-[#0f766d]"
                                                    : "border-[#d1d5db] text-[#374151] hover:border-gray-400"
                                                }`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Options Section */}
                            <div className="flex flex-col gap-3">
                                {[1, 2].map((opt) => (
                                    <div key={opt} className="flex items-center gap-3">
                                        <div className="size-4 rounded-full border border-gray-300"></div>
                                        <div className="flex items-center flex-1 h-10 px-4 bg-white border border-[#d1d5db] rounded-md focus-within:border-[#0f766d]">
                                            <input
                                                type="text"
                                                placeholder={`Option ${opt}`}
                                                className="w-full h-full bg-transparent outline-none text-[14px]"
                                            />
                                        </div>
                                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 opacity-0 group-hover:opacity-100">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                <button className="text-[13px] font-semibold text-[#0f766d] hover:underline w-fit mt-1">
                                    + Add another option
                                </button>
                            </div>

                            {/* Duplicate/Remove Actions */}
                            <div className="flex items-center justify-end gap-5 pt-4 border-t border-gray-100 mt-2">
                                <button className="flex items-center gap-1.5 text-[13px] text-[#6b7280] hover:text-[#374151]">
                                    <Copy size={16} />
                                    <span>Duplicate</span>
                                </button>
                                <button className="flex items-center gap-1.5 text-[13px] text-[#6b7280] hover:text-red-500">
                                    <Trash2 size={16} />
                                    <span>Remove</span>
                                </button>
                            </div>
                        </div>

                        {/* Add another Question Button */}
                        <button className="w-full py-2.5 border border-[#0f766d] border-dashed rounded-lg text-[#0f766d] font-semibold text-[14px] hover:bg-[#f0f9f8] transition-colors mb-8">
                            + Add a question
                        </button>

                        {/* Suggested Questions */}
                        <div className="flex flex-col gap-4">
                            <span className="text-[14px] font-semibold text-[#374151]">Suggested questions:</span>
                            <div className="flex flex-col gap-2.5">
                                {[
                                    "Do you have experience of sales in IT Services & Consulting?",
                                    "Do you have a bike?",
                                    "Do you have a laptop?",
                                    "Are you open to a field job?",
                                    "What's your current salary?",
                                    "What's your expected salary?",
                                    "What's your notice period?",
                                    "Are you comfortable with English?",
                                    "What kind of job are you comfortable with?",
                                    "Are you willing to attend in-person interview?"
                                ].map((q, i) => (
                                    <button key={i} className="flex items-center gap-2 text-left p-2.5 border border-[#e5e7eb] rounded-lg text-[13px] text-[#374151] hover:border-[#0f766d] transition-colors">
                                        <Plus size={14} className="text-[#0f766d] shrink-0" />
                                        <span>{q}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Drawer Footer */}
                    <div className="px-6 py-5 border-t border-[#e5e7eb] bg-white shrink-0">
                        <button
                            onClick={() => setIsDrawerOpen(false)}
                            className="w-full h-11 bg-[#0f766d] hover:bg-[#0d635c] text-white font-semibold rounded-md transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="fixed bottom-0 left-0 right-0 w-full h-[72px] lg:h-[80px] bg-white border-t border-[#e5e7eb] flex items-center justify-end px-4 md:px-6 lg:px-10 z-[60]">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {activeStepIndex > 0 && (
                            <button
                                onClick={handleBack}
                                className="hidden md:flex h-[44px] lg:h-[46px] px-6 items-center justify-center border border-[#d1d5db] rounded-md font-medium text-[#374151] hover:bg-gray-50 transition-colors"
                            >
                                Back
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className="w-full md:w-auto md:min-w-[140px] h-[44px] lg:h-[46px] bg-[#0f766d] hover:bg-[#0d635c] text-white rounded-md font-medium text-[15px] transition-colors flex items-center justify-center"
                        >
                            {activeStepIndex === steps.length - 1 ? "Post job" : "Next"}
                        </button>
                    </div>
                </div>

                {/* Success Overlay */}
                {isSuccess && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-[#0e1b1a]/80 backdrop-blur-sm animate-in fade-in duration-500" />

                        {/* Modal Content */}
                        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 lg:p-10 flex flex-col items-center text-center animate-in zoom-in-95 fade-in duration-500 delay-150 fill-mode-both">
                            {/* Animated Checkmark Circle */}
                            <div className="size-20 rounded-full bg-[#eff6f5] flex items-center justify-center mb-6 relative">
                                <div className="absolute inset-0 rounded-full border-4 border-[#0f766d] border-t-transparent animate-spin duration-[1000ms]" />
                                <div className="size-16 rounded-full bg-[#0f766d] flex items-center justify-center text-white animate-in zoom-in-50 duration-300 delay-500 fill-mode-both">
                                    <Check size={32} strokeWidth={3} />
                                </div>
                            </div>

                            {/* Text Content */}
                            <h2 className="text-[24px] lg:text-[28px] font-bold text-[#111827] mb-3">Congratulations!</h2>
                            <p className="text-[16px] lg:text-[18px] font-semibold text-[#0f766d] mb-4">Your job post is live now</p>
                            <p className="text-[14px] text-[#6b7280] leading-relaxed mb-8">
                                We've successfully published your job posting. Candidates can now view and apply for the position.
                            </p>

                            {/* CTA Button */}
                            <button
                                onClick={() => router.push("/job-postings")}
                                className="w-full h-12 bg-[#0f766d] hover:bg-[#0d635c] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#0f766d]/20 active:scale-[0.98]"
                            >
                                View Job Postings
                            </button>

                            <p className="text-[12px] text-gray-400 mt-6 animate-pulse">
                                Redirecting you automatically in a few seconds...
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
