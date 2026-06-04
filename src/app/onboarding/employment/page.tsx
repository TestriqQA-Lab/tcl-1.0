"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronDown, ArrowLeft, Plus, Trash2, X } from "lucide-react";
import { updateEmploymentAction } from "@/actions/onboarding.actions";

export default function EmploymentPage() {
    const router = useRouter();
    const { data: session } = useSession();

    // 1. Professional Status
    const [workStatus, setWorkStatus] = useState<"FRESHER" | "EXPERIENCED">("FRESHER");
    const [lookingFor, setLookingFor] = useState<"JOB" | "INTERNSHIP" | "BOTH">("JOB");

    // 2. Experience Details (if Experienced)
    const [isEmployed, setIsEmployed] = useState<boolean>(false);
    const [experience, setExperience] = useState({
        totalExpYears: 0,
        totalExpMonths: 0,
        companyName: "",
        designation: "",
        currentCity: "",
        salary: 0,
        noticePeriod: "IMMEDIATE",
        industry: "",
        department: "",
        roleCategory: "",
        jobRole: "",
    });

    // 3. Skills
    const [skillsList, setSkillsList] = useState<string[]>([]);
    const [currentSkill, setCurrentSkill] = useState("");

    // 4. Languages
    const [languages, setLanguages] = useState<{ name: string; proficiency: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" }[]>([]);
    const [newLang, setNewLang] = useState({ name: "", proficiency: "BEGINNER" as const });

    // 5. Projects
    const [projects, setProjects] = useState<{ title: string; description: string; technologies: string[]; url: string; }[]>([]);
    const [newProject, setNewProject] = useState({ title: "", description: "", technologies: [] as string[], url: "", techInput: "" });
    const [showProjectForm, setShowProjectForm] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // Fetch Data on Mount
    React.useEffect(() => {
        const fetchData = async () => {
            if (session?.user?.id) {
                try {
                    const { getEmploymentAction } = await import("@/actions/onboarding.actions");
                    const result = await getEmploymentAction(session.user.id);

                    if (result.success && result.data) {
                        const { profile, skills, languages, projects, experience: latestExp } = result.data;

                        // 1. Professional Status
                        if (profile.workStatus) setWorkStatus(profile.workStatus);
                        if (profile.lookingFor) setLookingFor(profile.lookingFor);

                        // 2. Experience
                        setIsEmployed(profile.currentEmploymentStatus === "EMPLOYED");
                        setExperience({
                            totalExpYears: profile.totalExperienceYears || 0,
                            totalExpMonths: profile.totalExperienceMonths || 0,
                            companyName: latestExp?.companyName || "",
                            designation: latestExp?.designation || "",
                            currentCity: profile.currentLocation || "",
                            salary: profile.currentSalary || 0,
                            noticePeriod: profile.noticePeriod || "IMMEDIATE",
                            industry: profile.currentIndustry || "",
                            department: profile.currentDepartment || "",
                            roleCategory: profile.currentRoleCategory || "",
                            jobRole: profile.currentJobRole || "",
                        });

                        // 3. Skills
                        if (skills) setSkillsList(skills.map(s => s.skillName));

                        // 4. Languages
                        if (languages) {
                            setLanguages(languages.map(l => ({
                                name: l.languageName,
                                proficiency: l.read || "BEGINNER" // assuming read/write/speak are same as originally saved
                            })));
                        }

                        // 5. Projects
                        if (projects) {
                            setProjects(projects.map(p => ({
                                title: p.title,
                                description: p.description,
                                technologies: p.technologies || [],
                                url: p.url || ""
                            })));
                        }
                    }
                } catch (error) {
                    console.error("Failed to load employment data", error);
                } finally {
                    setIsLoadingData(false);
                }
            }
        };

        fetchData();
    }, [session?.user?.id]);


    // Handlers
    const handleSkillKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && currentSkill.trim()) {
            e.preventDefault();
            if (!skillsList.includes(currentSkill.trim())) {
                setSkillsList([...skillsList, currentSkill.trim()]);
            }
            setCurrentSkill("");
        }
    };

    const addLanguage = () => {
        if (newLang.name.trim()) {
            setLanguages([...languages, { ...newLang, name: newLang.name.trim() }]);
            setNewLang({ name: "", proficiency: "BEGINNER" });
        }
    };

    const addProjectTech = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newProject.techInput.trim()) {
            e.preventDefault();
            setNewProject({
                ...newProject,
                technologies: [...newProject.technologies, newProject.techInput.trim()],
                techInput: ""
            });
        }
    };

    const saveProject = () => {
        if (newProject.title && newProject.description) {
            setProjects([...projects, {
                title: newProject.title,
                description: newProject.description,
                technologies: newProject.technologies,
                url: newProject.url
            }]);
            setNewProject({ title: "", description: "", technologies: [], url: "", techInput: "" });
            setShowProjectForm(false);
        }
    };

    const handleSubmit = async () => {
        console.log("Submitting Employment Details...");
        if (!session?.user?.id) {
            console.error("No active session found.");
            alert("Session expired or invalid. Please sign in again.");
            return;
        }
        setIsSubmitting(true);

        try {
            const result = await updateEmploymentAction(session.user.id, {
                workStatus,
                lookingFor,
                employmentStatus: isEmployed ? "EMPLOYED" : "UNEMPLOYED",

                // Experience
                totalExperienceYears: workStatus === "EXPERIENCED" ? experience.totalExpYears : 0,
                totalExperienceMonths: workStatus === "EXPERIENCED" ? experience.totalExpMonths : 0,
                companyName: experience.companyName,
                designation: experience.designation,
                currentCity: experience.currentCity,
                currentSalary: experience.salary,
                noticePeriod: experience.noticePeriod,
                currentIndustry: experience.industry,
                currentDepartment: experience.department,
                currentRoleCategory: experience.roleCategory,
                currentJobRole: experience.jobRole,

                // Lists
                keySkills: skillsList,
                languages: languages,
                projects: projects,
            });

            if (result.error) {
                console.error("Server Action Error:", result.error);
                alert(`Error saving details: ${result.error}`);
            } else {
                console.log("Employment details saved successfully.");
                router.push("/onboarding/education");
            }
        } catch (error) {
            console.error("Submission Error:", error);
            alert("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Employment & Professional Details</h1>
                <p className="text-gray-500 max-w-2xl">
                    Tell us about your work experience, skills, and projects to help recruiters find you.
                </p>
            </div>

            {/* 1. Professional Status */}
            <div>
                <h3 className="text-sm font-bold text-[#0f766d] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-lg bg-[#0f766d]"></span>
                    Professional Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Work Status</label>
                        <div className="flex bg-gray-50 p-1 rounded-lg">
                            {["FRESHER", "EXPERIENCED"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setWorkStatus(status as any)}
                                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${workStatus === status ? "bg-white text-[#0f766d] shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Looking For</label>
                        <div className="flex bg-gray-50 p-1 rounded-lg">
                            {["JOB", "INTERNSHIP", "BOTH"].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setLookingFor(type as any)}
                                    className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${lookingFor === type ? "bg-white text-[#0f766d] shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Experience Details (Only if Experienced) */}
            {workStatus === "EXPERIENCED" && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <h3 className="text-sm font-bold text-[#0f766d] uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-lg bg-[#0f766d]"></span>
                        Work Experience
                    </h3>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Total Experience</label>
                                <div className="flex gap-2">
                                    <select
                                        className="w-full px-3 py-3 rounded-lg border border-gray-200 text-sm focus:border-[#0f766d] focus:outline-none"
                                        value={experience.totalExpYears}
                                        onChange={(e) => setExperience({ ...experience, totalExpYears: Number(e.target.value) })}
                                    >
                                        {[...Array(30)].map((_, i) => <option key={i} value={i}>{i} Years</option>)}
                                    </select>
                                    <select
                                        className="w-full px-3 py-3 rounded-lg border border-gray-200 text-sm focus:border-[#0f766d] focus:outline-none"
                                        value={experience.totalExpMonths}
                                        onChange={(e) => setExperience({ ...experience, totalExpMonths: Number(e.target.value) })}
                                    >
                                        {[...Array(12)].map((_, i) => <option key={i} value={i}>{i} Months</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Current Salary (Annual)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                    <input
                                        type="number"
                                        className="w-full pl-7 pr-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-[#0f766d] focus:outline-none"
                                        placeholder="e.g. 800000"
                                        value={experience.salary || ""}
                                        onChange={(e) => setExperience({ ...experience, salary: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { label: "Current Company", key: "companyName", placeholder: "e.g. Google" },
                                { label: "Designation", key: "designation", placeholder: "e.g. Senior Developer" },
                                { label: "Current City", key: "currentCity", placeholder: "e.g. Mumbai" },
                            ].map((field) => (
                                <div key={field.key}>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">{field.label}</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-[#0f766d] focus:outline-none"
                                        placeholder={field.placeholder}
                                        value={(experience as any)[field.key]}
                                        onChange={(e) => setExperience({ ...experience, [field.key]: e.target.value })}
                                    />
                                </div>
                            ))}

                            {/* Industry Select */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Industry</label>
                                <select
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-[#0f766d] focus:outline-none bg-white"
                                    value={experience.industry}
                                    onChange={(e) => setExperience({ ...experience, industry: e.target.value })}
                                >
                                    <option value="">Select Industry</option>
                                    <option value="HR">HR</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="IT">IT</option>
                                    <option value="Operations">Operations</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Education">Education</option>
                                    <option value="Manufacturing">Manufacturing</option>
                                    <option value="Retail">Retail</option>
                                    <option value="Construction">Construction</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Notice Period Select */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Notice Period</label>
                                <select
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-[#0f766d] focus:outline-none bg-white"
                                    value={experience.noticePeriod}
                                    onChange={(e) => setExperience({ ...experience, noticePeriod: e.target.value })}
                                >
                                    <option value="IMMEDIATE">Immediate</option>
                                    <option value="15_DAYS">15 Days</option>
                                    <option value="30_DAYS">30 Days</option>
                                    <option value="60_DAYS">60 Days</option>
                                    <option value="90_DAYS">90 Days</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Skills */}
            <div>
                <h3 className="text-sm font-bold text-[#0f766d] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-lg bg-[#0f766d]"></span>
                    Skills
                </h3>
                <div className="relative">
                    <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-gray-200 focus-within:ring-1 focus-within:ring-[#0f766d]">
                        {skillsList.map(skill => (
                            <span key={skill} className="bg-[#E8F3F2] text-[#0f766d] px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
                                {skill}
                                <button onClick={() => setSkillsList(skillsList.filter(s => s !== skill))} className="hover:text-red-500">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                        <input
                            type="text"
                            className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
                            placeholder="Type a skill and press Enter..."
                            value={currentSkill}
                            onChange={(e) => setCurrentSkill(e.target.value)}
                            onKeyDown={handleSkillKeyDown}
                        />
                    </div>
                </div>
            </div>

            {/* 4. Projects */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-[#0f766d] uppercase tracking-wider flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-lg bg-[#0f766d]"></span>
                        Projects
                    </h3>
                    {!showProjectForm && (
                        <button onClick={() => setShowProjectForm(true)} className="text-xs font-bold text-[#0f766d] flex items-center gap-1 hover:underline">
                            <Plus className="w-3 h-3" /> Add Project
                        </button>
                    )}
                </div>

                {/* Project List */}
                <div className="space-y-4 mb-4">
                    {projects.map((proj, idx) => (
                        <div key={idx} className="p-4 rounded-lg border border-gray-100 bg-gray-50 flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">{proj.title}</h4>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{proj.description}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {proj.technologies.map(t => (
                                        <span key={t} className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-500">{t}</span>
                                    ))}
                                </div>
                            </div>
                            <button onClick={() => setProjects(projects.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-red-500">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add Project Form */}
                {showProjectForm && (
                    <div className="p-5 rounded-lg border border-[#0f766d]/20 bg-[#F8FD FC] space-y-4">
                        <input
                            type="text"
                            placeholder="Project Title"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#0f766d] focus:outline-none"
                            value={newProject.title}
                            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Description"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#0f766d] focus:outline-none resize-none h-20"
                            value={newProject.description}
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        />
                        <div className="flex flex-wrap gap-2 p-2 rounded-lg border border-gray-200 bg-white">
                            {newProject.technologies.map(t => (
                                <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                                    {t}
                                    <button onClick={() => setNewProject({ ...newProject, technologies: newProject.technologies.filter(x => x !== t) })}>
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                            <input
                                type="text"
                                placeholder="Add tech stack (Enter)..."
                                className="flex-1 outline-none text-xs min-w-[100px]"
                                value={newProject.techInput}
                                onChange={(e) => setNewProject({ ...newProject, techInput: e.target.value })}
                                onKeyDown={addProjectTech}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Project URL (Optional)"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#0f766d] focus:outline-none"
                            value={newProject.url}
                            onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                        />
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setShowProjectForm(false)} className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700">Cancel</button>
                            <button onClick={saveProject} className="px-4 py-2 text-xs font-bold bg-[#0f766d] text-white rounded-lg hover:bg-[#0b5c55]">Save Project</button>
                        </div>
                    </div>
                )}
            </div>

            {/* 5. Languages */}
            <div>
                <h3 className="text-sm font-bold text-[#0f766d] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0f766d]"></span>
                    Languages
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        {languages.map((lang, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{lang.name}</p>
                                    <p className="text-xs text-gray-500">{lang.proficiency}</p>
                                </div>
                                <button onClick={() => setLanguages(languages.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 rounded-xl border border-gray-200 space-y-3">
                        <input
                            type="text"
                            placeholder="Language Name"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#0f766d] focus:outline-none"
                            value={newLang.name}
                            onChange={(e) => setNewLang({ ...newLang, name: e.target.value })}
                        />
                        <div className="flex gap-2">
                            {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setNewLang({ ...newLang, proficiency: level as any })}
                                    className={`flex-1 py-1.5 text-[10px] font-bold rounded border ${newLang.proficiency === level ? "bg-[#0f766d] text-white border-[#0f766d]" : "border-gray-200 text-gray-500"}`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                        <button onClick={addLanguage} className="w-full py-2 text-xs font-bold bg-black text-white rounded-lg hover:bg-gray-800">
                            Add Language
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
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
                    className="px-4 md:px-8 py-3 bg-[#0e746b] text-white font-bold rounded-full hover:bg-[#0b5c55] transition-colors shadow-lg shadow-[#0f766d]/20 disabled:opacity-70"
                >
                    {isSubmitting ? "Saving..." : "Save & Continue"}
                </button>
            </div>
        </div>
    );
}
