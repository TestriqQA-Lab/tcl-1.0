"use client";

import React, { useState } from "react";
import { loginSchema, type LoginFormData } from "@/lib/validation/auth";
import { Button } from "@/components/ui/Button";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
    onSwitchToRegister?: () => void;
}

export const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState<string | null>(null);

    const validateForm = (): boolean => {
        const result = loginSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof LoginFormData;
                if (!fieldErrors[field]) {
                    fieldErrors[field] = issue.message;
                }
            });
            setErrors(fieldErrors);
            return false;
        }
        setErrors({});
        return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof LoginFormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setIsSubmitting(true);
            console.log("Login form data:", formData);
            setTimeout(() => setIsSubmitting(false), 1000);
        }
    };

    const isFormValid = loginSchema.safeParse(formData).success;

    const isFloating = (field: string, value: string) => focused === field || value.length > 0;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="relative">
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                    <input
                        type="email"
                        id="login-email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                        className={`peer w-full pl-12 pr-4 pt-5 pb-2 border ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                            } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f766d] focus:border-transparent focus:bg-white transition-all`}
                        placeholder=" "
                    />
                    <label
                        htmlFor="login-email"
                        className={`absolute left-12 transition-all duration-200 pointer-events-none ${isFloating("email", formData.email)
                            ? "top-1.5 text-xs text-[#0f766d] font-medium"
                            : "top-1/2 -translate-y-1/2 text-sm text-gray-500"
                            }`}
                    >
                        Email Address
                    </label>
                </div>
                {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
            </div>

            {/* Password Field */}
            <div className="relative">
                <div className="flex items-center justify-end mb-1">
                    <button
                        type="button"
                        className="text-xs text-[#0f766d] hover:text-[#0d5c55] font-medium transition-colors cursor-pointer"
                        onClick={() => console.log("Forgot password clicked")}
                    >
                        Forgot password?
                    </button>
                </div>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                    <input
                        type={showPassword ? "text" : "password"}
                        id="login-password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setFocused("password")}
                        onBlur={() => setFocused(null)}
                        className={`peer w-full pl-12 pr-12 pt-5 pb-2 border ${errors.password ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                            } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f766d] focus:border-transparent focus:bg-white transition-all`}
                        placeholder=" "
                    />
                    <label
                        htmlFor="login-password"
                        className={`absolute left-12 transition-all duration-200 pointer-events-none ${isFloating("password", formData.password)
                            ? "top-1.5 text-xs text-[#0f766d] font-medium"
                            : "top-1/2 -translate-y-1/2 text-sm text-gray-500"
                            }`}
                    >
                        Password
                    </label>
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10 cursor-pointer"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                {errors.password && (
                    <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full !rounded-xl !py-3.5 !text-sm font-semibold shadow-lg shadow-[#0f766d]/20 hover:shadow-[#0f766d]/30 transition-all cursor-pointer"
                disabled={!isFormValid || isSubmitting}
            >
                {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>

            {/* Divider */}
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-gray-500">or continue with</span>
                </div>
            </div>

            {/* Google Sign In */}
            <button
                type="button"
                onClick={() => console.log("Google sign in clicked")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Continue with Google</span>
            </button>

            {/* Switch to Register */}
            <p className="text-center text-xs text-gray-600 mt-4">
                Don&apos;t have an account?{" "}
                <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="text-[#0f766d] font-semibold hover:text-[#0d5c55] transition-colors cursor-pointer"
                >
                    Create one
                </button>
            </p>
        </form>
    );
};
