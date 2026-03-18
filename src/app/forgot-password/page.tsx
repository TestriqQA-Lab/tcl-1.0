"use client";

import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const router = useRouter();

    return (
        <AuthCard
            title="Forgot Password"
            subtitle="We'll send you a link to reset your password"
        >
            <ForgotPasswordForm onBack={() => router.push("/login")} />
        </AuthCard>
    );
}
