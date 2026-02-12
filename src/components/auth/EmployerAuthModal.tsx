"use client";

import { useState } from "react";
import { AuthModal } from "./AuthModal";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface EmployerAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const EmployerAuthModal = ({ isOpen, onClose }: EmployerAuthModalProps) => {
    const [activeTab, setActiveTab] = useState<"login" | "register">("login");

    return (
        <AuthModal
            isOpen={isOpen}
            onClose={onClose}
            title={activeTab === "login" ? "Employer Login" : "Employer Registration"}
            subtitle={activeTab === "login" ? "Access your dashboard" : "Find the best talent"}
        >
            <div className="flex mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("login")}
                    className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === "login"
                        ? "text-[#0f766d] border-[#0f766d]"
                        : "text-gray-500 border-transparent hover:text-gray-700"
                        }`}
                >
                    Login
                </button>
                <button
                    onClick={() => setActiveTab("register")}
                    className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === "register"
                        ? "text-[#0f766d] border-[#0f766d]"
                        : "text-gray-500 border-transparent hover:text-gray-700"
                        }`}
                >
                    Sign Up
                </button>
            </div>

            {activeTab === "login" ? (
                <LoginForm
                    onSwitchToRegister={() => setActiveTab("register")}
                    onClose={onClose}
                    role="EMPLOYER"
                />
            ) : (
                <RegisterForm
                    onSwitchToLogin={() => setActiveTab("login")}
                    role="EMPLOYER"
                />
            )}
        </AuthModal>
    );
};
