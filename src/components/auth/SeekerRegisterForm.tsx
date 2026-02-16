"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerSchema, type RegisterFormData } from "@/lib/validation/auth";
import { registerAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/Button";
import { signIn } from "next-auth/react";
import { CheckCircle2, Eye, EyeOff, Briefcase, GraduationCap, X, FileText, Trash2 } from "lucide-react";
import Image from "next/image";

interface SeekerRegisterFormProps {
    onSwitchToLogin?: () => void;
    initialName?: string;
    initialEmail?: string;
}

export const SeekerRegisterForm = ({ onSwitchToLogin, initialName, initialEmail }: SeekerRegisterFormProps) => {
    const router = useRouter();
    const [formData, setFormData] = useState<RegisterFormData>({
        name: "",
        email: "",
        password: "",
        mobileNumber: "",
        workStatus: "EXPERIENCED",
        whatsappUpdates: true,
        resumeUrl: "",
    });
    const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    // Track valid fields for green checkmark
    const [touched, setTouched] = useState<Partial<Record<keyof RegisterFormData, boolean>>>({});

    const validateField = (name: keyof RegisterFormData, value: any) => {
        try {
            (registerSchema.shape as any)[name].parse(value);
            return true;
        } catch (error) {
            return false;
        }
    };

    // Pre-fill form fields from Google OAuth data
    useEffect(() => {
        if (initialName || initialEmail) {
            setFormData(prev => ({
                ...prev,
                ...(initialName ? { name: initialName } : {}),
                ...(initialEmail ? { email: initialEmail } : {}),
            }));
            setTouched(prev => ({
                ...prev,
                ...(initialName ? { name: true } : {}),
                ...(initialEmail ? { email: true } : {}),
            }));
        }
    }, [initialName, initialEmail]);

    const isValid = (name: keyof RegisterFormData) => touched[name] && validateField(name, formData[name]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const val = type === "checkbox" ? checked : value;

        setFormData((prev) => ({ ...prev, [name]: val }));
        setTouched((prev) => ({ ...prev, [name]: true }));

        if (errors[name as keyof RegisterFormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleWorkStatusChange = (status: "EXPERIENCED" | "FRESHER") => {
        setFormData((prev) => ({ ...prev, workStatus: status }));
    };

    const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setResumeFile(file);
            // In a real app, upload here and get URL. For now, just set a placeholder name.
            setFormData(prev => ({ ...prev, resumeUrl: file.name }));
        }
    };

    const removeResume = () => {
        setResumeFile(null);
        setFormData(prev => ({ ...prev, resumeUrl: "" }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = registerSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof RegisterFormData;
                fieldErrors[field] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const result = await registerAction(
                formData.name,
                formData.email,
                formData.password,
                "SEEKER",
                formData.mobileNumber,
                formData.workStatus,
                formData.resumeUrl
            );

            if (result.error) {
                setErrors({ email: result.error }); // Generic error
            } else {
                // Success
                const loginResult = await signIn("credentials", {
                    email: formData.email,
                    password: formData.password,
                    redirect: false,
                });

                if (loginResult?.ok) {
                    // Registration & Login Successful -> Go to Onboarding
                    router.refresh();
                    router.push("/onboarding/employment");
                } else {
                    setErrors({ email: "Registration successful but login failed. Please login manually." });
                }
            }
        } catch (error) {
            setErrors({ email: "An unexpected error occurred" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full p-4 md:p-8 rounded-2xl shadow-xl bg-white mt-1">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">Step 1 of 4 — Basic Details</h2>
                    <span className="text-sm font-bold text-[#0f766d]">25%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0f766d] w-1/4 rounded-full"></div>
                </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Create your TopCareerLive profile</h1>
            <p className="text-gray-500 mb-8">Search & apply to jobs with a stronger profile</p>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Full Name */}
                <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-900">Full Name</label>
                    <div className="relative">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-0 transition-all ${isValid("name") ? "border-[#0f766d]/50 bg-white" : "border-gray-200 focus:border-[#0f766d]"
                                }`}
                            placeholder="Type your name"
                        />
                        {isValid("name") && (
                            <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0f766d] fill-green-50" />
                        )}
                    </div>
                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                {/* Email ID */}
                <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-900">Email ID</label>
                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-0 transition-all ${isValid("email") ? "border-[#0f766d]/50 bg-white" : "border-gray-200 focus:border-[#0f766d]"
                                }`}
                            placeholder="Type your email"
                        />
                        {isValid("email") && (
                            <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0f766d] fill-green-50" />
                        )}
                    </div>
                    {/* Helper text */}
                    <p className="text-[10px] text-gray-500">We'll send job updates to this email</p>
                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-900">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-0 transition-all ${isValid("password") ? "border-[#0f766d]/50 bg-white" : "border-gray-200 focus:border-[#0f766d]"
                                }`}
                            placeholder="Type your password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                </div>

                {/* Mobile Number */}
                <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-900">Mobile Number</label>
                    <div className="flex gap-3">
                        <div className="flex-shrink-0 flex items-center justify-center px-4 border-2 border-gray-200 rounded-lg bg-gray-50 font-medium text-gray-700 min-w-[80px]">
                            <span className="mr-2">🇮🇳</span> +91
                        </div>
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                maxLength={10}
                                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-0 transition-all ${isValid("mobileNumber") ? "border-[#0f766d]/50 bg-white" : "border-gray-200 focus:border-[#0f766d]"
                                    }`}
                                placeholder="State your mobile no"
                            />
                            {isValid("mobileNumber") && (
                                <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0f766d] fill-green-50" />
                            )}
                        </div>
                    </div>
                    {errors.mobileNumber && <p className="text-xs text-red-500">{errors.mobileNumber}</p>}
                </div>

                {/* Work Status */}
                <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-900">Work Status</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className={`relative flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${formData.workStatus === "EXPERIENCED"
                            ? "border-[#0f766d] border-2 bg-[#F0FDFA]"
                            : "border-gray-200 bg-white hover:border-gray-300"
                            }`}>
                            <input
                                type="radio"
                                name="workStatus"
                                value="EXPERIENCED"
                                checked={formData.workStatus === "EXPERIENCED"}
                                onChange={() => handleWorkStatusChange("EXPERIENCED")}
                                className="peer sr-only"
                            />
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0 transition-colors ${formData.workStatus === "EXPERIENCED" ? "bg-[#0f766d] text-white" : "bg-gray-100 text-gray-600"
                                }`}>
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="block font-bold text-gray-900 text-base">I&apos;m experienced</span>
                                <span className="block text-xs text-gray-500 mt-0.5 font-medium leading-tight">I have work experience</span>
                            </div>
                        </label>

                        <label className={`relative flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${formData.workStatus === "FRESHER"
                            ? "border-[#0f766d] border-2 bg-[#F0FDFA]"
                            : "border-gray-200 bg-white hover:border-gray-300"
                            }`}>
                            <input
                                type="radio"
                                name="workStatus"
                                value="FRESHER"
                                checked={formData.workStatus === "FRESHER"}
                                onChange={() => handleWorkStatusChange("FRESHER")}
                                className="peer sr-only"
                            />
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0 transition-colors ${formData.workStatus === "FRESHER" ? "bg-[#0f766d] text-white" : "bg-gray-100 text-gray-600"
                                }`}>
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="block font-bold text-gray-900 text-base">I&apos;m a fresher</span>
                                <span className="block text-xs text-gray-500 mt-0.5 font-medium leading-tight">I am a student/graduated</span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Resume Upload */}
                <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-900">Resume</label>
                    <div className="border-2 border-dashed border-[#0f766d]/30 bg-emerald-50/20 rounded-lg p-4 text-center">
                        {!resumeFile ? (
                            <label className="flex items-center gap-4 cursor-pointer">
                                <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                                    <FileText className="w-6 h-6 text-[#0f766d]" />
                                </div>
                                <div className="flex-grow text-left">
                                    <div className="text-sm font-medium text-gray-900">Upload Resume</div>
                                    <div className="text-xs text-gray-500">DOC, DOCX, PDF, RTF (Max 2MB)</div>
                                </div>
                                <div className="px-4 py-2 bg-[#0f766d] text-white text-sm font-medium rounded-lg hover:bg-[#0d5c55] transition-colors">
                                    Upload
                                </div>
                                <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                            </label>
                        ) : (
                            <div className="flex items-center justify-between p-1">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                                        <FileText className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-semibold text-gray-900">{resumeFile.name}</div>
                                        <div className="text-xs text-green-600 font-medium">Successfully uploaded</div>
                                    </div>
                                </div>
                                <button type="button" onClick={removeResume} className="text-gray-400 hover:text-red-500">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* WhatsApp Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            name="whatsappUpdates"
                            checked={formData.whatsappUpdates}
                            onChange={handleChange}
                            className="peer h-5 w-5 rounded border-gray-300 text-[#0f766d] focus:ring-[#0f766d]"
                        />
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                        Send me important updates & job alerts on WhatsApp and Email. You can unsubscribe anytime.
                    </span>
                </label>

                {/* Register Button */}
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full !rounded-lg !py-4 font-bold text-base shadow-lg shadow-[#0f766d]/20 hover:shadow-[#0f766d]/30 hover:-translate-y-0.5 transition-all mt-4"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Registering..." : "Register now"}
                </Button>

                {/* Footer Login Link */}
                <p className="text-center text-sm text-gray-500">
                    Already registered?{" "}
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="text-[#0f766d] font-bold hover:text-[#0d5c55] hover:underline"
                    >
                        Login
                    </button>
                </p>

            </form>

            {/* Trusted Companies Section (Mobile Only/Footer style) */}
            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                <p className="text-xs font-bold text-[#0f766d]/60 tracking-widest uppercase mb-4">Trusted by 10k+ Recruiters</p>
                <div className="flex justify-center gap-6 opacity-40">
                    <Briefcase className="w-6 h-6" />
                    <Briefcase className="w-6 h-6" />
                    <Briefcase className="w-6 h-6" />
                    <Briefcase className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
};
