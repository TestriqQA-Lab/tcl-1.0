"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLoginAction } from "@/actions/admin-login.action";
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const isFormValid = email.length > 0 && password.length >= 6;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const result = await adminLoginAction(email, password);

            if (result.error) {
                setError(result.error);
            } else {
                window.location.href = "/admin-dashboard";
            }
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFloating = (field: string, value: string) =>
        focusedField === field || value.length > 0;

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#F3F4F6] px-4 py-8">

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-[400px]">
                {/* Header */}
                <div className="text-center mb-7">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#111827] mb-4">
                        <Shield className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-[22px] font-bold text-[#111827] tracking-tight">
                        Admin Portal
                    </h1>
                    <p className="mt-1.5 text-[13px] text-[#6B7280]">
                        Sign in to access the management console
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4">
                        {/* Error */}
                        {error && (
                            <div className="flex items-start gap-2.5 p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-lg">
                                <AlertCircle className="w-[18px] h-[18px] text-[#DC2626] shrink-0 mt-0.5" />
                                <p className="text-[13px] text-[#991B1B] leading-relaxed">{error}</p>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label htmlFor="admin-email" className="block text-[13px] font-medium text-[#374151] mb-1.5">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF] pointer-events-none" />
                                <input
                                    type="email"
                                    id="admin-email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                    onFocus={() => setFocusedField("email")}
                                    onBlur={() => setFocusedField(null)}
                                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-[#D1D5DB] rounded-lg text-[14px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#111827]/10 focus:border-[#111827] transition-all"
                                    placeholder="admin@tcl.com"
                                    autoComplete="email"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="admin-password" className="block text-[13px] font-medium text-[#374151] mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9CA3AF] pointer-events-none" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="admin-password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                                    onFocus={() => setFocusedField("password")}
                                    onBlur={() => setFocusedField(null)}
                                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#D1D5DB] rounded-lg text-[14px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#111827]/10 focus:border-[#111827] transition-all"
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors cursor-pointer"
                                    tabIndex={-1}
                                    disabled={isSubmitting}
                                >
                                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={!isFormValid || isSubmitting}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 mt-1 bg-[#111827] text-white text-[14px] font-medium rounded-lg hover:bg-[#1F2937] disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Signing in…
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="px-6 sm:px-7 py-3.5 bg-[#F9FAFB] border-t border-[#E5E7EB]">
                        <p className="text-center text-[11px] text-[#9CA3AF] tracking-wide uppercase">
                            Restricted — Authorized administrators only
                        </p>
                    </div>
                </div>

                {/* Bottom */}
                <p className="mt-6 text-center text-[11px] text-[#9CA3AF]">
                    © {new Date().getFullYear()} TopCareerLive
                </p>
            </div>
        </div>
    );
}
