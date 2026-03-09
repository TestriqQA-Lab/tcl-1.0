import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, Plus, Check, X, Copy, Trash2, Bold, Italic, Underline, AlignLeft, List, Lightbulb, Info, Loader2 } from "lucide-react";
import { updateJobAction, getJobByIdForEmployer } from "@/actions/job.actions";

interface EditJobModalProps {
    jobId: string;
    onClose: () => void;
}

const steps = [
    "Job details",
    "Candidate preferences",
    "Screening questions",
    "Job description",
    "Communication preferences",
];

export default function EditJobModal({ jobId, onClose }: EditJobModalProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [activeStepIndex, setActiveStepIndex] = useState(0);

    // Rich text editor ref
    const editorRef = useRef<HTMLDivElement>(null);
    const savedSelectionRef = useRef<Range | null>(null);

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

    // Form states
    const [jobTitle, setJobTitle] = useState("");
    const [minExp, setMinExp] = useState("");
    const [maxExp, setMaxExp] = useState("");
    const [minSal, setMinSal] = useState("");
    const [maxSal, setMaxSal] = useState("");
    const [perkSearch, setPerkSearch] = useState("");
    const [selectedPerks, setSelectedPerks] = useState<string[]>([]);
    const [candidateLocType, setCandidateLocType] = useState("Anywhere in India");
    const [specificCity, setSpecificCity] = useState("");
    const [relocationAllowance, setRelocationAllowance] = useState(false);
    const [education, setEducation] = useState("");
    const [skillsSearch, setSkillsSearch] = useState("");
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectedGender, setSelectedGender] = useState("Any");
    const [selectedQuestions, setSelectedQuestions] = useState<string[]>(["experience", "education", "english"]);
    const [minExpYears, setMinExpYears] = useState("1");
    const [minEducationLevel, setMinEducationLevel] = useState("Graduate");
    const [englishLevel, setEnglishLevel] = useState("Good English");
    const [jobDescription, setJobDescription] = useState("");
    const [companyDescription, setCompanyDescription] = useState("");
    const [allowCalls, setAllowCalls] = useState(true);
    const [recruiterName, setRecruiterName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [callStartTime, setCallStartTime] = useState("09:00 AM");
    const [callEndTime, setCallEndTime] = useState("06:00 PM");
    const [callDays, setCallDays] = useState("Mon-Sat");
    const [isDaysDropdownOpen, setIsDaysDropdownOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Helpers
    const formatIndianCurrency = (num: number): string => {
        const s = num.toString();
        if (s.length <= 3) return s;
        const last3 = s.slice(-3);
        const rest = s.slice(0, -3);
        const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
        return formatted + "," + last3;
    };
    const parseFormattedNumber = (val: string): string => val.replace(/,/g, "");

    const handleMinSalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        if (raw === "") { setMinSal(""); return; }
        setMinSal(formatIndianCurrency(Number(raw)));
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

    const minExpNum = minExp === "" ? null : Number(minExp);
    const maxExpOptions = minExpNum !== null ? Array.from({ length: 5 }, (_, i) => minExpNum + 1 + i) : [];

    const togglePerk = (perk: string) => {
        setSelectedPerks((prev) => prev.includes(perk) ? prev.filter((p) => p !== perk) : [...prev, perk]);
    };

    const addCustomPerk = () => {
        const trimmed = perkSearch.trim();
        if (trimmed && !selectedPerks.includes(trimmed)) { setSelectedPerks((prev) => [...prev, trimmed]); }
        setPerkSearch("");
    };

    const toggleSkill = (skill: string) => {
        setSelectedSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]);
    };

    const addCustomSkill = () => {
        const trimmed = skillsSearch.trim();
        if (trimmed && !selectedSkills.includes(trimmed)) { setSelectedSkills((prev) => [...prev, trimmed]); }
        setSkillsSearch("");
    };

    const toggleQuestion = (id: string) => {
        if (selectedQuestions.includes(id)) { setSelectedQuestions(selectedQuestions.filter(q => q !== id)); }
        else { setSelectedQuestions([...selectedQuestions, id]); }
    };

    useEffect(() => {
        async function loadJob() {
            try {
                const res = await getJobByIdForEmployer(jobId);
                if ('error' in res) {
                    alert("Job not found or unauthorized");
                    onClose();
                    return;
                }
                const j = res.job;
                setJobTitle(j.title || "");
                if (j.workExperienceMin != null) setMinExp(String(j.workExperienceMin));
                if (j.workExperienceMax != null) setMaxExp(String(j.workExperienceMax));
                if (j.monthlySalaryMin != null) setMinSal(formatIndianCurrency(j.monthlySalaryMin));
                if (j.monthlySalaryMax != null) setMaxSal(formatIndianCurrency(j.monthlySalaryMax));
                setSelectedPerks(j.perksAndBenefits || []);
                setCandidateLocType(j.candidateLocationRequirement || "Anywhere in India");
                if (j.candidateLocationRequirement === "In a specific city") setSpecificCity(j.location || "");
                setEducation(j.candidateEducationLevel || "");
                setSelectedSkills(j.requiredSkills || []);
                setSelectedGender(j.preferredCandidateGender || "Any");

                const sq: string[] = [];
                if (j.screeningExperienceMin != null) { sq.push("experience"); setMinExpYears(String(j.screeningExperienceMin)); }
                if (j.screeningEducationLevel) { sq.push("education"); setMinEducationLevel(j.screeningEducationLevel); }
                if (j.screeningEnglishLevel) { sq.push("english"); setEnglishLevel(j.screeningEnglishLevel); }
                setSelectedQuestions(sq);

                setJobDescription(j.description || "");
                setCompanyDescription(j.aboutCompany || "");
                setAllowCalls(j.allowCalls ?? true);
                setRecruiterName(j.recruiterName || "");
                setMobileNumber(j.recruiterContact || "");
                setCallStartTime(j.callTimeFrom || "09:00 AM");
                setCallEndTime(j.callTimeTo || "06:00 PM");
                setCallDays(j.callDays || "Mon-Sat");
            } catch (err) {
                console.error("Failed to load job:", err);
            } finally {
                setIsLoading(false);
            }
        }
        loadJob();
    }, [jobId, onClose]);

    useEffect(() => {
        if (isSuccess) {
            router.refresh();
            const timer = setTimeout(() => {
                onClose();
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, onClose, router]);

    const handleSave = async () => {
        if (activeStepIndex < steps.length - 1) {
            setActiveStepIndex(activeStepIndex + 1);
            return;
        }

        setIsSubmitting(true);
        try {
            const parseNumber = (val: string): number | null => {
                if (!val) return null;
                const raw = val.replace(/,/g, "");
                return raw ? Number(raw) : null;
            };

            const payload = {
                title: jobTitle,
                description: jobDescription,
                location: candidateLocType === "In a specific city" ? specificCity : "India",
                workExperienceMin: minExp ? Number(minExp) : null,
                workExperienceMax: maxExp ? Number(maxExp) : null,
                monthlySalaryMin: parseNumber(minSal),
                monthlySalaryMax: parseNumber(maxSal),
                perksAndBenefits: selectedPerks,
                candidateLocationRequirement: candidateLocType,
                candidateEducationLevel: education,
                requiredSkills: selectedSkills,
                preferredCandidateGender: selectedGender,
                screeningExperienceMin: selectedQuestions.includes("experience") ? Number(minExpYears) : null,
                screeningEducationLevel: selectedQuestions.includes("education") ? minEducationLevel : "",
                screeningEnglishLevel: selectedQuestions.includes("english") ? englishLevel : "",
                aboutCompany: companyDescription,
                allowCalls,
                recruiterName,
                recruiterContact: mobileNumber,
                callTimeFrom: callStartTime,
                callTimeTo: callEndTime,
                callDays: callDays,
            };

            const result = await updateJobAction(jobId, payload);
            if (result.error) throw new Error(result.error);
            setIsSuccess(true);
        } catch (err: any) {
            console.error("Failed to update job:", err);
            alert("Failed to update job. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-[1000] bg-white/80 backdrop-blur-sm flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#0f766d] animate-spin" />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[1000] flex animate-in fade-in duration-300">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative ml-auto w-full md:w-[90%] lg:w-[1000px] h-full bg-white shadow-2xl overflow-y-auto flex flex-col transform animate-in slide-in-from-right duration-500">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0 bg-white sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                            <ArrowLeft size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-900">Edit job: {jobTitle}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Stepper Sidebar */}
                    <div className="hidden lg:flex w-[280px] border-r border-gray-100 p-8 flex-col gap-4">
                        {steps.map((step, idx) => (
                            <div
                                key={idx}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${activeStepIndex === idx ? 'bg-[#f0f9f8] text-[#0f766d]' : 'text-gray-500 hover:bg-gray-50'}`}
                                onClick={() => setActiveStepIndex(idx)}
                            >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${activeStepIndex >= idx ? 'bg-[#0f766d] text-white border-[#0f766d]' : 'border-gray-200'}`}>
                                    {activeStepIndex > idx ? <Check size={14} /> : idx + 1}
                                </div>
                                <span className={`text-sm font-semibold ${activeStepIndex === idx ? 'text-[#0f766d]' : 'text-gray-600'}`}>{step}</span>
                            </div>
                        ))}
                    </div>

                    {/* Main Form Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50/30">
                        {/* Step 1: Job Details */}
                        {activeStepIndex === 0 && (
                            <div className="max-w-2xl flex flex-col gap-8">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-700">Job title</label>
                                    <input
                                        type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                                        className="w-full h-11 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-[#0f766d]/20 focus:border-[#0f766d] outline-none"
                                        placeholder="Ex. Sales Manager"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-700">Work experience</label>
                                    <div className="flex items-center gap-4">
                                        <select value={minExp} onChange={(e) => setMinExp(e.target.value)} className="flex-1 h-11 border border-gray-300 rounded-lg px-3 outline-none focus:border-[#0f766d]">
                                            <option value="">Min exp.</option>
                                            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(y => <option key={y} value={y}>{y} {y === 1 ? 'Year' : 'Years'}</option>)}
                                        </select>
                                        <span className="text-gray-400">to</span>
                                        <select value={maxExp} onChange={(e) => setMaxExp(e.target.value)} className="flex-1 h-11 border border-gray-300 rounded-lg px-3 outline-none focus:border-[#0f766d]">
                                            <option value="">Max exp.</option>
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(y => <option key={y} value={y}>{y} {y === 1 ? 'Year' : 'Years'}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-700">Monthly salary (INR)</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                            <input type="text" value={minSal} onChange={handleMinSalChange} className="w-full h-11 border border-gray-300 rounded-lg pl-8 pr-4 outline-none focus:border-[#0f766d]" placeholder="Min" />
                                        </div>
                                        <span className="text-gray-400">to</span>
                                        <div className="flex-1 relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                            <input type="text" value={maxSal} onChange={handleMaxSalChange} className="w-full h-11 border border-gray-300 rounded-lg pl-8 pr-4 outline-none focus:border-[#0f766d]" placeholder="Max" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <label className="text-sm font-bold text-gray-700">Perks and benefits</label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedPerks.map(p => (
                                            <span key={p} className="flex items-center gap-2 px-3 py-1.5 bg-[#eff6f5] text-[#0f766d] rounded-full text-xs font-bold">
                                                {p} <X size={14} className="cursor-pointer" onClick={() => togglePerk(p)} />
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input type="text" value={perkSearch} onChange={e => setPerkSearch(e.target.value)} className="flex-1 h-11 border border-gray-300 rounded-lg px-4 outline-none focus:border-[#0f766d]" placeholder="Add perks (e.g. Health Insurance)" onKeyDown={e => e.key === 'Enter' && addCustomPerk()} />
                                        <button onClick={addCustomPerk} className="px-6 bg-[#0f766d] text-white rounded-lg font-bold">Add</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Candidate Preferences */}
                        {activeStepIndex === 1 && (
                            <div className="max-w-2xl flex flex-col gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm font-bold text-gray-700">Candidate requirement</label>
                                    <div className="flex gap-4">
                                        {["Anywhere in India", "In a specific city"].map(type => (
                                            <button key={type} onClick={() => setCandidateLocType(type)} className={`px-5 py-2 rounded-full border text-sm font-bold transition-all ${candidateLocType === type ? 'bg-[#0f766d] text-white border-[#0f766d]' : 'bg-white text-gray-600 border-gray-300'}`}>{type}</button>
                                        ))}
                                    </div>
                                    {candidateLocType === "In a specific city" && (
                                        <input type="text" value={specificCity} onChange={e => setSpecificCity(e.target.value)} className="w-full h-11 border border-gray-300 rounded-lg px-4" placeholder="Enter city name" />
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-700">Education</label>
                                    <select value={education} onChange={e => setEducation(e.target.value)} className="w-full h-11 border border-gray-300 rounded-lg px-3">
                                        <option value="">Select Education</option>
                                        <option value="12th Pass">12th Pass</option>
                                        <option value="Graduate">Graduate</option>
                                        <option value="Post Graduate">Post Graduate</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <label className="text-sm font-bold text-gray-700">Skills</label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedSkills.map(s => (
                                            <span key={s} className="flex items-center gap-2 px-3 py-1.5 bg-[#eff6f5] text-[#0f766d] rounded-full text-xs font-bold">
                                                {s} <X size={14} className="cursor-pointer" onClick={() => toggleSkill(s)} />
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input type="text" value={skillsSearch} onChange={e => setSkillsSearch(e.target.value)} className="flex-1 h-11 border border-gray-300 rounded-lg px-4 outline-none focus:border-[#0f766d]" placeholder="Add skills" onKeyDown={e => e.key === 'Enter' && addCustomSkill()} />
                                        <button onClick={addCustomSkill} className="px-6 bg-[#0f766d] text-white rounded-lg font-bold">Add</button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-700">Gender</label>
                                    <div className="flex gap-4">
                                        {["Any", "Male", "Female"].map(g => (
                                            <button key={g} onClick={() => setSelectedGender(g)} className={`px-5 py-2 rounded-full border text-sm font-bold ${selectedGender === g ? 'bg-[#0f766d] text-white border-[#0f766d]' : 'bg-white border-gray-300 text-gray-600'}`}>{g}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Screening Questions */}
                        {activeStepIndex === 2 && (
                            <div className="max-w-2xl flex flex-col gap-6">
                                <div className={`p-5 rounded-xl border transition-all ${selectedQuestions.includes("experience") ? 'bg-[#f0f9f8] border-[#0f766d]' : 'bg-white border-gray-200'}`}>
                                    <div className="flex items-start gap-4">
                                        <input type="checkbox" checked={selectedQuestions.includes("experience")} onChange={() => toggleQuestion("experience")} className="mt-1 size-4 accent-[#0f766d]" />
                                        <div className="flex-1 flex flex-col gap-4">
                                            <span className="text-sm font-bold text-gray-800">Experience requirement</span>
                                            {selectedQuestions.includes("experience") && (
                                                <select value={minExpYears} onChange={e => setMinExpYears(e.target.value)} className="w-full h-11 bg-white border border-gray-300 rounded-lg px-3">
                                                    {[0, 1, 2, 3, 4, 5].map(y => <option key={y} value={y}>{y}+ Years</option>)}
                                                </select>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-5 rounded-xl border transition-all ${selectedQuestions.includes("education") ? 'bg-[#f0f9f8] border-[#0f766d]' : 'bg-white border-gray-200'}`}>
                                    <div className="flex items-start gap-4">
                                        <input type="checkbox" checked={selectedQuestions.includes("education")} onChange={() => toggleQuestion("education")} className="mt-1 size-4 accent-[#0f766d]" />
                                        <div className="flex-1 flex flex-col gap-4">
                                            <span className="text-sm font-bold text-gray-800">Minimum education level</span>
                                            {selectedQuestions.includes("education") && (
                                                <select value={minEducationLevel} onChange={e => setMinEducationLevel(e.target.value)} className="w-full h-11 bg-white border border-gray-300 rounded-lg px-3">
                                                    <option value="12th Pass">12th Pass</option>
                                                    <option value="Graduate">Graduate</option>
                                                </select>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-5 rounded-xl border transition-all ${selectedQuestions.includes("english") ? 'bg-[#f0f9f8] border-[#0f766d]' : 'bg-white border-gray-200'}`}>
                                    <div className="flex items-start gap-4">
                                        <input type="checkbox" checked={selectedQuestions.includes("english")} onChange={() => toggleQuestion("english")} className="mt-1 size-4 accent-[#0f766d]" />
                                        <div className="flex-1 flex flex-col gap-4">
                                            <span className="text-sm font-bold text-gray-800">English proficiency</span>
                                            {selectedQuestions.includes("english") && (
                                                <select value={englishLevel} onChange={e => setEnglishLevel(e.target.value)} className="w-full h-11 bg-white border border-gray-300 rounded-lg px-3">
                                                    <option value="Basic English">Basic English</option>
                                                    <option value="Good English">Good English</option>
                                                </select>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Job Description */}
                        {activeStepIndex === 3 && (
                            <div className="max-w-3xl flex flex-col gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm font-bold text-gray-700">Job description</label>
                                    <div className="border border-gray-300 rounded-xl overflow-hidden shadow-sm bg-white">
                                        <div className="flex items-center gap-2 p-3 bg-gray-50 border-b border-gray-200">
                                            <button onClick={() => execFormatCommand('bold')} className="p-2 hover:bg-gray-200 rounded"><Bold size={16} /></button>
                                            <button onClick={() => execFormatCommand('italic')} className="p-2 hover:bg-gray-200 rounded"><Italic size={16} /></button>
                                            <button onClick={() => execFormatCommand('insertUnorderedList')} className="p-2 hover:bg-gray-200 rounded"><List size={16} /></button>
                                        </div>
                                        <div
                                            ref={editorRef} contentEditable suppressContentEditableWarning
                                            onInput={() => setJobDescription(editorRef.current?.innerHTML || "")}
                                            className="p-5 min-h-[300px] outline-none text-sm leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: jobDescription }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 5: Communication */}
                        {activeStepIndex === 4 && (
                            <div className="max-w-2xl flex flex-col gap-8">
                                <div className="flex flex-col gap-4">
                                    <p className="text-sm font-bold text-gray-700">Allow candidates to call you?</p>
                                    <div className="flex gap-4">
                                        <button onClick={() => setAllowCalls(true)} className={`px-8 py-2 rounded-full border text-sm font-bold ${allowCalls ? 'bg-[#0f766d] text-white border-[#0f766d]' : 'bg-white border-gray-300 text-gray-600'}`}>Yes</button>
                                        <button onClick={() => setAllowCalls(false)} className={`px-8 py-2 rounded-full border text-sm font-bold ${!allowCalls ? 'bg-[#0f766d] text-white border-[#0f766d]' : 'bg-white border-gray-300 text-gray-600'}`}>No</button>
                                    </div>
                                </div>

                                {allowCalls && (
                                    <div className="flex flex-col gap-6 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold text-gray-500">Recruiter name</label>
                                                <input type="text" value={recruiterName} onChange={e => setRecruiterName(e.target.value)} className="h-11 border border-gray-300 rounded-lg px-4" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold text-gray-500">Mobile number</label>
                                                <input type="text" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} className="h-11 border border-gray-300 rounded-lg px-4" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between px-8 py-6 border-t border-gray-100 bg-white sticky bottom-0 z-20">
                    <button onClick={() => activeStepIndex > 0 && setActiveStepIndex(activeStepIndex - 1)} className={`px-8 py-3 rounded-xl border border-gray-300 text-sm font-bold text-gray-700 ${activeStepIndex === 0 ? 'opacity-0 pointer-events-none' : 'hover:bg-gray-50'}`}>Back</button>
                    <button
                        onClick={handleSave} disabled={isSubmitting}
                        className="px-10 py-3 bg-[#0f766d] hover:bg-[#0c5e57] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#0f766d]/20 transition-all flex items-center gap-2"
                    >
                        {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : activeStepIndex === steps.length - 1 ? 'Save changes' : 'Next'}
                    </button>
                </div>

                {/* Success Message */}
                {isSuccess && (
                    <div className="fixed inset-0 z-[1100] bg-white flex flex-col items-center justify-center p-10 animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-[#f0f9f8] text-[#0f766d] rounded-full flex items-center justify-center mb-6">
                            <Check size={40} strokeWidth={3} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Changes saved!</h2>
                        <p className="text-gray-500 mb-10">Your job posting has been successfully updated.</p>
                        <button onClick={onClose} className="px-10 py-3 bg-[#0f766d] text-white rounded-xl font-bold shadow-lg">Back to Job Postings</button>
                    </div>
                )}
            </div>
        </div>
    );
}
