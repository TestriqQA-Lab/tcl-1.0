"use client";

import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
    return (
        <AuthCard
            title="Create Account"
            subtitle="Join us and start your journey"
        >
            <RegisterForm />
        </AuthCard>
    );
}
