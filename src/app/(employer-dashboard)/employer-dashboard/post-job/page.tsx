"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronDown, Plus, Check, X, Copy, Trash2, Bold, Italic, Underline, AlignLeft, List, Lightbulb, Info } from "lucide-react";
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
    const router = useRouter();

    // Rich text editor ref
    const editorRef = useRef<HTMLDivElement>(null);
    const savedSelectionRef = useRef<Range | null>(null);

    // Save selection whenever user interacts with editor
    const saveSelection = useCallback(() => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            savedSelectionRef.current = sel.getRangeAt(0);
        }
    }, []);

    const restoreSelection = useCallback(() => {
        const sel = window.getSelection();
        if (sel && savedSelectionRef.current) {
            sel.removeAllRanges();
            sel.addRange(savedSelectionRef.current);
        }
    }, []);

    const execFormatCommand = useCallback((command: string, value?: string) => {
        restoreSelection();
        document.execCommand(command, false, value);
    }, [restoreSelection]);

    const getEditorTextLength = useCallback(() => {
        return editorRef.current?.innerText?.trim().length || 0;
    }, []);
    const [activeStepIndex, setActiveStepIndex] = useState(0);

    // Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Custom Questions State
    type QuestionType = "Single choice" | "Multiple choice" | "Short answer";
    interface CustomQuestion {
        id: string;
        text: string;
        type: QuestionType;
        mandatory: boolean;
        options: string[];
    }
    const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);

    const createEmptyQuestion = (text = ""): CustomQuestion => ({
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        text,
        type: "Single choice",
        mandatory: true,
        options: ["", ""],
    });

    const updateQuestion = (id: string, updates: Partial<CustomQuestion>) => {
        setCustomQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
    };

    const removeQuestion = (id: string) => {
        setCustomQuestions((prev) => prev.filter((q) => q.id !== id));
    };

    const duplicateQuestion = (id: string) => {
        setCustomQuestions((prev) => {
            const idx = prev.findIndex((q) => q.id === id);
            if (idx === -1) return prev;
            const copy = { ...prev[idx], id: Date.now().toString() + Math.random().toString(36).slice(2), options: [...prev[idx].options] };
            const next = [...prev];
            next.splice(idx + 1, 0, copy);
            return next;
        });
    };

    const updateOption = (qId: string, optIdx: number, value: string) => {
        setCustomQuestions((prev) => prev.map((q) => {
            if (q.id !== qId) return q;
            const opts = [...q.options];
            opts[optIdx] = value;
            return { ...q, options: opts };
        }));
    };

    const addOption = (qId: string) => {
        setCustomQuestions((prev) => prev.map((q) => (q.id === qId ? { ...q, options: [...q.options, ""] } : q)));
    };

    const removeOption = (qId: string, optIdx: number) => {
        setCustomQuestions((prev) => prev.map((q) => {
            if (q.id !== qId || q.options.length <= 2) return q;
            return { ...q, options: q.options.filter((_, i) => i !== optIdx) };
        }));
    };

    const suggestedQuestionTexts = [
        "Do you have experience of sales in IT Services & Consulting?",
        "Do you have a bike?",
        "Do you have a laptop?",
        "Are you open to a field job?",
        "What's your current salary?",
        "What's your expected salary?",
        "What's your notice period?",
        "Are you comfortable with English?",
        "What kind of job are you comfortable with?",
        "Are you willing to attend in-person interview?",
    ];

    const addSuggestedQuestion = (text: string) => {
        setCustomQuestions((prev) => [...prev, createEmptyQuestion(text)]);
    };

    const openDrawerForNew = () => {
        if (customQuestions.length === 0) {
            setCustomQuestions([createEmptyQuestion()]);
        }
        setIsDrawerOpen(true);
    };

    // Step 1 State
    const [jobTitle, setJobTitle] = useState("");
    const [minExp, setMinExp] = useState("");
    const [maxExp, setMaxExp] = useState("");
    const [minSal, setMinSal] = useState("");
    const [maxSal, setMaxSal] = useState("");
    const [perkSearch, setPerkSearch] = useState("");
    const [selectedPerks, setSelectedPerks] = useState<string[]>([]);

    // Helper: format number in Indian comma pattern (e.g. 1,00,000)
    const formatIndianCurrency = (num: number): string => {
        const s = num.toString();
        if (s.length <= 3) return s;
        const last3 = s.slice(-3);
        const rest = s.slice(0, -3);
        const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
        return formatted + "," + last3;
    };

    // Parse formatted string back to raw digits
    const parseFormattedNumber = (val: string): string => val.replace(/,/g, "");

    const handleMinSalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        if (raw === "") { setMinSal(""); return; }
        setMinSal(formatIndianCurrency(Number(raw)));
        // Reset max if it's now <= min
        const maxRaw = Number(parseFormattedNumber(maxSal));
        if (maxRaw && maxRaw <= Number(raw)) setMaxSal("");
    };

    const handleMaxSalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        if (raw === "") { setMaxSal(""); return; }
        setMaxSal(formatIndianCurrency(Number(raw)));
    };

    const minSalNum = Number(parseFormattedNumber(minSal)) || 0;
    const maxSalNum = Number(parseFormattedNumber(maxSal)) || 0;
    const isSalaryInvalid = minSal !== "" && maxSal !== "" && maxSalNum <= minSalNum;

    // Experience: compute max options based on minExp
    const minExpNum = minExp === "" ? null : Number(minExp);
    const maxExpOptions = minExpNum !== null
        ? Array.from({ length: 5 }, (_, i) => minExpNum + 1 + i)
        : [];

    const togglePerk = (perk: string) => {
        setSelectedPerks((prev) =>
            prev.includes(perk) ? prev.filter((p) => p !== perk) : [...prev, perk]
        );
    };

    const addCustomPerk = () => {
        const trimmed = perkSearch.trim();
        if (trimmed && !selectedPerks.includes(trimmed)) {
            setSelectedPerks((prev) => [...prev, trimmed]);
        }
        setPerkSearch("");
    };

    const handlePerkKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") { e.preventDefault(); addCustomPerk(); }
    };

    // Step 2 State
    const [candidateLocType, setCandidateLocType] = useState("Anywhere in India");
    const [specificCity, setSpecificCity] = useState("");
    const [relocationAllowance, setRelocationAllowance] = useState(false);
    const [education, setEducation] = useState("");
    const [skillsSearch, setSkillsSearch] = useState("");
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectedGender, setSelectedGender] = useState("Any");

    const toggleSkill = (skill: string) => {
        setSelectedSkills((prev) =>
            prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
        );
    };

    const addCustomSkill = () => {
        const trimmed = skillsSearch.trim();
        if (trimmed && !selectedSkills.includes(trimmed)) {
            setSelectedSkills((prev) => [...prev, trimmed]);
        }
        setSkillsSearch("");
    };

    const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") { e.preventDefault(); addCustomSkill(); }
    };

    const indianCities = [
        "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Pune",
        "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam",
        "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut",
        "Rajkot", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai",
        "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada",
        "Jodhpur", "Madurai", "Raipur", "Kochi", "Chandigarh", "Mysore", "Noida", "Gurgaon",
        "Dehradun", "Mangalore", "Tiruchirappalli", "Thiruvananthapuram",
    ];

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
                                                <select value={minExp} onChange={(e) => { setMinExp(e.target.value); setMaxExp(""); }} className="w-full h-11 bg-white border border-[#d1d5db] rounded-md pl-4 pr-10 text-[14px] lg:text-[15px] appearance-none outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d] transition-all cursor-pointer text-[#111827]">
                                                    <option value="" disabled hidden>Min exp.</option>
                                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((y) => (
                                                        <option key={y} value={String(y)}>{y} {y === 1 ? "year" : "years"}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
                                            </div>
                                            <span className="text-[14px] text-[#6b7280]">to</span>
                                            <div className="relative flex-1">
                                                <select value={maxExp} onChange={(e) => setMaxExp(e.target.value)} disabled={minExpNum === null} className={`w-full h-11 bg-white border border-[#d1d5db] rounded-md pl-4 pr-10 text-[14px] lg:text-[15px] appearance-none outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d] transition-all cursor-pointer text-[#111827] ${minExpNum === null ? "opacity-50 cursor-not-allowed" : ""}`}>
                                                    <option value="" disabled hidden>Max exp.</option>
                                                    {maxExpOptions.map((y) => (
                                                        <option key={y} value={String(y)}>{y} {y === 1 ? "year" : "years"}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 w-full">
                                        <label className="text-[14px] font-semibold text-[#374151]">Salary per month</label>
                                        <div className="flex items-center gap-2 lg:gap-4 w-full">
                                            <div className={`flex items-center w-full h-11 bg-white border rounded-md px-3 lg:px-4 transition-colors focus-within:border-[#0f766d] focus-within:ring-1 focus-within:ring-[#0f766d] ${isSalaryInvalid ? "border-red-400" : "border-[#d1d5db]"}`}>
                                                <span className="text-[13px] text-[#9ca3af] font-medium">₹</span>
                                                <div className="w-[1px] h-5 bg-[#e5e7eb] mx-2"></div>
                                                <input type="text" inputMode="numeric" placeholder="Min" value={minSal} onChange={handleMinSalChange} className="w-full outline-none text-[14px] text-[#111827] placeholder:text-[#9ca3af]" />
                                            </div>
                                            <span className="text-[14px] text-[#6b7280]">to</span>
                                            <div className={`flex items-center w-full h-11 bg-white border rounded-md px-3 lg:px-4 transition-colors focus-within:border-[#0f766d] focus-within:ring-1 focus-within:ring-[#0f766d] ${isSalaryInvalid ? "border-red-400" : "border-[#d1d5db]"}`}>
                                                <span className="text-[13px] text-[#9ca3af] font-medium">₹</span>
                                                <div className="w-[1px] h-5 bg-[#e5e7eb] mx-2"></div>
                                                <input type="text" inputMode="numeric" placeholder="Max" value={maxSal} onChange={handleMaxSalChange} className="w-full outline-none text-[14px] text-[#111827] placeholder:text-[#9ca3af]" />
                                            </div>
                                        </div>
                                        {isSalaryInvalid && (
                                            <p className="text-[12px] text-red-500 mt-1">Max salary must be greater than min salary</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2 w-full">
                                        <label className="text-[14px] font-semibold text-[#374151]">Perks and benefits <span className="text-[#6b7280] font-normal">(Optional)</span></label>

                                        {/* Selected perks as tags */}
                                        {selectedPerks.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {selectedPerks.map((p) => (
                                                    <span key={p} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#eff6f5] border border-[#0f766d]/20 text-[12px] font-medium text-[#0f766d]">
                                                        {p}
                                                        <button onClick={() => togglePerk(p)} className="hover:bg-[#0f766d]/10 rounded-full p-0.5 transition-colors"><X size={12} /></button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Search / add custom perk input */}
                                        <div className="flex items-center w-full h-11 bg-white border border-[#d1d5db] rounded-md px-4 focus-within:border-[#0f766d] focus-within:ring-1 focus-within:ring-[#0f766d] transition-all">
                                            <input
                                                type="text"
                                                value={perkSearch}
                                                onChange={(e) => setPerkSearch(e.target.value)}
                                                onKeyDown={handlePerkKeyDown}
                                                placeholder="Type a perk and press Enter to add"
                                                className="w-full outline-none text-[14px] text-[#111827] placeholder:text-[#9ca3af]"
                                            />
                                            {perkSearch.trim() && (
                                                <button onClick={addCustomPerk} className="text-[#0f766d] hover:bg-[#eff6f5] rounded-md px-2 py-1 text-[13px] font-semibold shrink-0 transition-colors">Add</button>
                                            )}
                                        </div>

                                        {/* Suggested perks */}
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {suggestedPerks.map((p) => {
                                                const isSelected = selectedPerks.includes(p);
                                                return (
                                                    <button
                                                        key={p}
                                                        onClick={() => togglePerk(p)}
                                                        className={`px-3 py-1.5 rounded-full border text-[12px] flex items-center gap-1.5 transition-all ${isSelected
                                                            ? "border-[#0f766d] bg-[#eff6f5] text-[#0f766d] font-medium"
                                                            : "border-[#e5e7eb] text-[#374151] hover:bg-gray-50"
                                                            }`}
                                                    >
                                                        {isSelected ? <Check size={14} className="text-[#0f766d]" /> : <Plus size={14} className="text-gray-400" />}
                                                        {p}
                                                    </button>
                                                );
                                            })}
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
                                                    {indianCities.map((city) => (
                                                        <option key={city} value={city}>{city}</option>
                                                    ))}
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
                                                <option value="12th Pass">12th Pass</option>
                                                <option value="Diploma">Diploma</option>
                                                <option value="Graduate">Graduate</option>
                                                <option value="Post Graduate">Post Graduate</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    <div className="flex flex-col gap-2 w-full">
                                        <label className="text-[14px] font-semibold text-[#374151]">
                                            Specific skills requirements
                                        </label>

                                        {/* Selected skills as tags */}
                                        {selectedSkills.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {selectedSkills.map((s) => (
                                                    <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#eff6f5] border border-[#0f766d]/20 text-[12px] font-medium text-[#0f766d]">
                                                        {s}
                                                        <button onClick={() => toggleSkill(s)} className="hover:bg-[#0f766d]/10 rounded-full p-0.5 transition-colors"><X size={12} /></button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Search / add custom skill input */}
                                        <div className="flex items-center w-full h-11 bg-white border border-[#d1d5db] rounded-md px-4 focus-within:border-[#0f766d] focus-within:ring-1 focus-within:ring-[#0f766d] transition-all">
                                            <input
                                                type="text"
                                                value={skillsSearch}
                                                onChange={(e) => setSkillsSearch(e.target.value)}
                                                onKeyDown={handleSkillKeyDown}
                                                placeholder="Type a skill and press Enter to add"
                                                className="w-full outline-none text-[14px] text-[#111827] placeholder:text-[#9ca3af]"
                                            />
                                            {skillsSearch.trim() && (
                                                <button onClick={addCustomSkill} className="text-[#0f766d] hover:bg-[#eff6f5] rounded-md px-2 py-1 text-[13px] font-semibold shrink-0 transition-colors">Add</button>
                                            )}
                                        </div>

                                        {/* Suggested skills */}
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {suggestedSkills.map((s) => {
                                                const isSelected = selectedSkills.includes(s);
                                                return (
                                                    <button
                                                        key={s}
                                                        onClick={() => toggleSkill(s)}
                                                        className={`px-3 py-1.5 rounded-full border text-[12px] flex items-center gap-1.5 transition-all ${isSelected
                                                            ? "border-[#0f766d] bg-[#eff6f5] text-[#0f766d] font-medium"
                                                            : "border-[#e5e7eb] text-[#374151] hover:bg-gray-50"
                                                            }`}
                                                    >
                                                        {isSelected ? <Check size={14} className="text-[#0f766d]" /> : <Plus size={14} className="text-gray-400" />}
                                                        {s}
                                                    </button>
                                                );
                                            })}
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

                                    {/* Custom Questions rendered in Step 3 */}
                                    {customQuestions.map((cq, cqIdx) => (
                                        <div key={cq.id} className={`p-4 lg:p-6 rounded-xl border border-[#0f766d] bg-[#eff6f5]/30 shadow-sm transition-all`}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex gap-3 lg:gap-4 flex-1">
                                                    <div className="size-5 mt-0.5 rounded bg-[#0f766d] flex items-center justify-center shrink-0">
                                                        <Check size={12} className="text-white" />
                                                    </div>
                                                    <div className="flex flex-col gap-2 flex-1">
                                                        <span className="text-[15px] font-semibold text-[#111827]">{cq.text || `Custom Question ${cqIdx + 1}`}</span>
                                                        <div className="flex items-center gap-3 flex-wrap">
                                                            <span className="text-[12px] text-[#6b7280] bg-[#f1f5f9] px-2 py-0.5 rounded">{cq.type}</span>
                                                            {cq.mandatory && <span className="text-[12px] text-[#0f766d] font-medium">Mandatory</span>}
                                                            {cq.type !== "Short answer" && cq.options.filter(o => o.trim()).length > 0 && (
                                                                <span className="text-[12px] text-[#6b7280]">{cq.options.filter(o => o.trim()).length} options</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <button onClick={() => { setIsDrawerOpen(true); }} className="text-[13px] text-[#0f766d] font-semibold hover:underline">Edit</button>
                                                    <button onClick={() => removeQuestion(cq.id)} className="text-[13px] text-[#6b7280] hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Custom Question Button */}
                                    <button
                                        onClick={openDrawerForNew}
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
                                    {/* Info Banner - Coming Soon */}
                                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#f0fdf4] to-[#f8fafc] border border-[#d1fae5] rounded-lg">
                                        <Lightbulb size={20} className="text-[#0f766d] shrink-0" />
                                        <p className="text-[14px] text-[#334155] flex items-center gap-2">
                                            Auto-generated job descriptions based on your details
                                            <span className="text-[11px] font-bold text-white bg-[#0f766d] px-2 py-0.5 rounded-full">COMING SOON</span>
                                        </p>
                                    </div>

                                    {/* Job Description Editor Card */}
                                    <div className="flex flex-col border border-[#e5e7eb] rounded-xl overflow-hidden">
                                        {/* Editor Toolbar */}
                                        <div className="flex items-center px-4 py-3 bg-[#f9fafb] border-b border-[#e5e7eb]">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 border-r border-gray-300 pr-4">
                                                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => execFormatCommand('bold')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors" title="Bold"><Bold size={16} /></button>
                                                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => execFormatCommand('italic')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors" title="Italic"><Italic size={16} /></button>
                                                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => execFormatCommand('underline')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors" title="Underline"><Underline size={16} /></button>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => execFormatCommand('justifyLeft')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors" title="Align Left"><AlignLeft size={16} /></button>
                                                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => execFormatCommand('insertUnorderedList')} className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors" title="Bullet List"><List size={16} /></button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ContentEditable Area */}
                                        <div className="relative p-4 bg-white">
                                            <div
                                                ref={editorRef}
                                                contentEditable
                                                suppressContentEditableWarning
                                                onInput={() => setJobDescription(editorRef.current?.innerHTML || "")}
                                                onMouseUp={saveSelection}
                                                onKeyUp={saveSelection}
                                                className="w-full min-h-[220px] outline-none text-[15px] leading-relaxed text-[#111827] overflow-y-auto [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-[#9ca3af]"
                                                data-placeholder="Enter job responsibilities..."
                                                style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                                            />
                                            <div className="absolute bottom-4 right-4 text-[12px] text-gray-400 font-medium">
                                                {getEditorTextLength()}/1000
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
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <div className="relative w-full md:w-44">
                                                        <select
                                                            value={callStartTime}
                                                            onChange={(e) => setCallStartTime(e.target.value)}
                                                            className="w-full h-11 border border-[#d1d5db] rounded-md px-4 text-[14px] appearance-none outline-none focus:border-[#0f766d] bg-white cursor-pointer"
                                                        >
                                                            {Array.from({ length: 17 }, (_, i) => {
                                                                const hour24 = 6 + i;
                                                                const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
                                                                const ampm = hour24 >= 12 ? "PM" : "AM";
                                                                const label = `${String(hour12).padStart(2, '0')}:00 ${ampm}`;
                                                                return <option key={label} value={label}>{label}</option>;
                                                            })}
                                                        </select>
                                                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                    </div>
                                                    <span className="text-gray-400 text-[14px]">to</span>
                                                    <div className="relative w-full md:w-44">
                                                        <select
                                                            value={callEndTime}
                                                            onChange={(e) => setCallEndTime(e.target.value)}
                                                            className="w-full h-11 border border-[#d1d5db] rounded-md px-4 text-[14px] appearance-none outline-none focus:border-[#0f766d] bg-white cursor-pointer"
                                                        >
                                                            {(() => {
                                                                // Parse start time to 24h
                                                                const startMatch = callStartTime.match(/(\d+):00\s*(AM|PM)/i);
                                                                let startH24 = 9;
                                                                if (startMatch) {
                                                                    let h = parseInt(startMatch[1]);
                                                                    const p = startMatch[2].toUpperCase();
                                                                    if (p === "PM" && h !== 12) h += 12;
                                                                    if (p === "AM" && h === 12) h = 0;
                                                                    startH24 = h;
                                                                }
                                                                return Array.from({ length: 17 }, (_, i) => {
                                                                    const hour24 = 6 + i;
                                                                    if (hour24 <= startH24) return null;
                                                                    const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
                                                                    const ampm = hour24 >= 12 ? "PM" : "AM";
                                                                    const label = `${String(hour12).padStart(2, '0')}:00 ${ampm}`;
                                                                    return <option key={label} value={label}>{label}</option>;
                                                                });
                                                            })()}
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
                        {/* Dynamic Question Blocks */}
                        {customQuestions.map((cq, cqIdx) => (
                            <div key={cq.id} className="flex flex-col gap-5 p-5 lg:p-6 border border-[#e5e7eb] rounded-xl mb-6">
                                {/* Header: Question N + Mandatory toggle */}
                                <div className="flex items-center justify-between">
                                    <span className="text-[14px] font-semibold text-[#374151]">Question {cqIdx + 1}</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuestion(cq.id, { mandatory: !cq.mandatory })}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <div className="relative inline-flex items-center">
                                                <div className={`w-9 h-5 rounded-full transition-colors relative ${cq.mandatory ? "bg-[#0f766d]" : "bg-gray-200"
                                                    }`}>
                                                    <div className={`absolute top-[2px] h-4 w-4 bg-white border border-gray-300 rounded-full transition-transform ${cq.mandatory ? "translate-x-[18px]" : "translate-x-[2px]"
                                                        }`} />
                                                </div>
                                            </div>
                                            <span className="text-[13px] text-[#6b7280]">Mandatory</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Question text input */}
                                <div className="flex items-center w-full h-11 bg-white border border-[#d1d5db] rounded-md px-4 focus-within:border-[#0f766d] focus-within:ring-1 focus-within:ring-[#0f766d] transition-all">
                                    <input
                                        type="text"
                                        value={cq.text}
                                        onChange={(e) => updateQuestion(cq.id, { text: e.target.value })}
                                        placeholder="Enter your question here"
                                        className="w-full outline-none text-[15px] text-[#111827] placeholder:text-[#9ca3af]"
                                    />
                                </div>

                                {/* Question type selector */}
                                <div className="flex flex-col gap-3">
                                    <span className="text-[13px] text-[#6b7280]">Question type:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {(["Single choice", "Multiple choice", "Short answer"] as QuestionType[]).map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => updateQuestion(cq.id, { type })}
                                                className={`px-4 py-1.5 rounded-full border text-[13px] font-medium transition-all ${cq.type === type
                                                    ? "border-[#0f766d] bg-[#eff6f5] text-[#0f766d]"
                                                    : "border-[#d1d5db] text-[#374151] hover:border-gray-400"
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Options Section (only for choice types) */}
                                {cq.type !== "Short answer" && (
                                    <div className="flex flex-col gap-3">
                                        {cq.options.map((opt, optIdx) => (
                                            <div key={optIdx} className="flex items-center gap-3 group">
                                                <div className={`size-4 shrink-0 border border-gray-300 ${cq.type === "Single choice" ? "rounded-full" : "rounded"
                                                    }`} />
                                                <div className="flex items-center flex-1 h-10 px-4 bg-white border border-[#d1d5db] rounded-md focus-within:border-[#0f766d] transition-colors">
                                                    <input
                                                        type="text"
                                                        value={opt}
                                                        onChange={(e) => updateOption(cq.id, optIdx, e.target.value)}
                                                        placeholder={`Option ${optIdx + 1}`}
                                                        className="w-full h-full bg-transparent outline-none text-[14px] text-[#111827] placeholder:text-[#9ca3af]"
                                                    />
                                                </div>
                                                {cq.options.length > 2 && (
                                                    <button
                                                        onClick={() => removeOption(cq.id, optIdx)}
                                                        className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addOption(cq.id)}
                                            className="text-[13px] font-semibold text-[#0f766d] hover:underline w-fit mt-1"
                                        >
                                            + Add another option
                                        </button>
                                    </div>
                                )}

                                {/* Duplicate/Remove Actions */}
                                <div className="flex items-center justify-end gap-5 pt-4 border-t border-gray-100 mt-1">
                                    <button
                                        onClick={() => duplicateQuestion(cq.id)}
                                        className="flex items-center gap-1.5 text-[13px] text-[#6b7280] hover:text-[#374151] transition-colors"
                                    >
                                        <Copy size={16} />
                                        <span>Duplicate</span>
                                    </button>
                                    <button
                                        onClick={() => removeQuestion(cq.id)}
                                        className="flex items-center gap-1.5 text-[13px] text-[#6b7280] hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                        <span>Remove</span>
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Add another Question Button */}
                        <button
                            onClick={() => setCustomQuestions((prev) => [...prev, createEmptyQuestion()])}
                            className="w-full py-2.5 border border-[#0f766d] border-dashed rounded-lg text-[#0f766d] font-semibold text-[14px] hover:bg-[#f0f9f8] transition-colors mb-8"
                        >
                            + Add a question
                        </button>

                        {/* Suggested Questions */}
                        <div className="flex flex-col gap-4">
                            <span className="text-[14px] font-semibold text-[#374151]">Suggested questions:</span>
                            <div className="flex flex-col gap-2.5">
                                {suggestedQuestionTexts.map((q, i) => {
                                    const alreadyAdded = customQuestions.some((cq) => cq.text === q);
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => !alreadyAdded && addSuggestedQuestion(q)}
                                            disabled={alreadyAdded}
                                            className={`flex items-center gap-2 text-left p-2.5 border rounded-lg text-[13px] transition-colors ${alreadyAdded
                                                ? "border-[#0f766d] bg-[#eff6f5]/50 text-[#0f766d] cursor-default"
                                                : "border-[#e5e7eb] text-[#374151] hover:border-[#0f766d]"
                                                }`}
                                        >
                                            {alreadyAdded ? <Check size={14} className="text-[#0f766d] shrink-0" /> : <Plus size={14} className="text-[#0f766d] shrink-0" />}
                                            <span>{q}</span>
                                        </button>
                                    );
                                })}
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
