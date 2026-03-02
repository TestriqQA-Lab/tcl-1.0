"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ResetPasswordFormProps {
    token: string;
}

export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const isFloating = (field: string, value: string) =>
        focusedField === field || value.length > 0;

    const passwordStrength = (() => {
        if (password.length === 0) return null;
        if (password.length < 8) return "weak";
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);
        const score = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
        if (score === 0) return "weak";
        if (score === 1) return "fair";
        if (score === 2) return "good";
        return "strong";
    })();

    const strengthConfig = {
        weak: { color: "bg-red-400", label: "Weak", width: "w-1/4" },
        fair: { color: "bg-orange-400", label: "Fair", width: "w-2/4" },
        good: { color: "bg-yellow-400", label: "Good", width: "w-3/4" },
        strong: { color: "bg-green-500", label: "Strong", width: "w-full" },
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong. Please try again.");
                return;
            }

            setSuccess(true);
            // Redirect to home after 3 seconds
            setTimeout(() => router.push("/"), 3000);
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="text-center space-y-4 py-4">
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#f0fdf9] flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-[#0f766d]" />
                    </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Password Reset Successfully!</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                    Your password has been updated. You can now log in with your new password.
                </p>
                <p className="text-xs text-gray-400">Redirecting to home page...</p>
                <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-[#0f766d] border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-sm text-gray-500 leading-relaxed">
                Choose a strong new password for your account.
            </p>

            {/* Global error */}
            {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* New Password */}
            <div>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                    <input
                        type={showPassword ? "text" : "password"}
                        id="new-password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (error) setError("");
                        }}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        className="peer w-full pl-12 pr-12 pt-5 pb-2 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f766d] focus:border-transparent focus:bg-white transition-all"
                        placeholder=" "
                        autoComplete="new-password"
                    />
                    <label
                        htmlFor="new-password"
                        className={`absolute left-12 transition-all duration-200 pointer-events-none ${isFloating("password", password)
                            ? "top-1.5 text-xs text-[#0f766d] font-medium"
                            : "top-1/2 -translate-y-1/2 text-sm text-gray-500"
                            }`}
                    >
                        New Password
                    </label>
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10 cursor-pointer"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>

                {/* Password strength bar */}
                {passwordStrength && (
                    <div className="mt-2 space-y-1">
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-300 ${strengthConfig[passwordStrength].color} ${strengthConfig[passwordStrength].width}`}
                            />
                        </div>
                        <p className="text-xs text-gray-400">
                            Password strength:{" "}
                            <span className={`font-medium ${passwordStrength === "weak" ? "text-red-500" :
                                passwordStrength === "fair" ? "text-orange-500" :
                                    passwordStrength === "good" ? "text-yellow-600" :
                                        "text-green-600"
                                }`}>
                                {strengthConfig[passwordStrength].label}
                            </span>
                        </p>
                    </div>
                )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (error) setError("");
                    }}
                    onFocus={() => setFocusedField("confirm")}
                    onBlur={() => setFocusedField(null)}
                    className={`peer w-full pl-12 pr-12 pt-5 pb-2 border ${confirmPassword.length > 0 && password !== confirmPassword
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 bg-gray-50"
                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f766d] focus:border-transparent focus:bg-white transition-all`}
                    placeholder=" "
                    autoComplete="new-password"
                />
                <label
                    htmlFor="confirm-password"
                    className={`absolute left-12 transition-all duration-200 pointer-events-none ${isFloating("confirm", confirmPassword)
                        ? "top-1.5 text-xs text-[#0f766d] font-medium"
                        : "top-1/2 -translate-y-1/2 text-sm text-gray-500"
                        }`}
                >
                    Confirm Password
                </label>
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10 cursor-pointer"
                >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>
            {confirmPassword.length > 0 && password !== confirmPassword && (
                <p className="text-xs text-red-500 -mt-3">Passwords do not match.</p>
            )}

            <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full !rounded-xl !py-3.5 !text-sm font-semibold shadow-lg shadow-[#0f766d]/20 hover:shadow-[#0f766d]/30 transition-all cursor-pointer"
                disabled={isSubmitting || password.length < 8 || password !== confirmPassword}
            >
                {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
        </form>
    );
};
