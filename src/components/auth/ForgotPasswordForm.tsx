"use client";

import React, { useState } from "react";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ForgotPasswordFormProps {
    onBack: () => void;
}

export const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [focused, setFocused] = useState(false);

    const isFloating = focused || email.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            // Always show success to avoid user enumeration
            setSuccess(true);
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
                <h3 className="text-lg font-semibold text-gray-900">Check your inbox</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                    If an account exists for <span className="font-medium text-gray-700">{email}</span>,
                    we've sent a password reset link. Check your inbox (and spam folder).
                </p>
                <p className="text-xs text-gray-400">The link expires in 1 hour.</p>
                <button
                    type="button"
                    onClick={onBack}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm text-[#0f766d] font-medium hover:text-[#0d5c55] transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Back link */}
            <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0f766d] transition-colors cursor-pointer"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
            </button>

            <div>
                <p className="text-sm text-gray-500 leading-relaxed">
                    Enter the email address associated with your account and we'll send you a link to reset your password.
                </p>
            </div>

            {/* Email field */}
            <div className="relative">
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                    <input
                        type="email"
                        id="forgot-email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (error) setError("");
                        }}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        className={`peer w-full pl-12 pr-4 pt-5 pb-2 border ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                            } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f766d] focus:border-transparent focus:bg-white transition-all`}
                        placeholder=" "
                        autoComplete="email"
                    />
                    <label
                        htmlFor="forgot-email"
                        className={`absolute left-12 transition-all duration-200 pointer-events-none ${isFloating
                                ? "top-1.5 text-xs text-[#0f766d] font-medium"
                                : "top-1/2 -translate-y-1/2 text-sm text-gray-500"
                            }`}
                    >
                        Email Address
                    </label>
                </div>
                {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
            </div>

            <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full !rounded-xl !py-3.5 !text-sm font-semibold shadow-lg shadow-[#0f766d]/20 hover:shadow-[#0f766d]/30 transition-all cursor-pointer"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>
        </form>
    );
};
