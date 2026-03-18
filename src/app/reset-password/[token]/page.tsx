import { AuthCard } from "@/components/auth/AuthCard";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

interface ResetPasswordPageProps {
    params: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
    const { token } = await params;

    return (
        <AuthCard
            title="Set New Password"
            subtitle="Enter your new password below"
        >
            <ResetPasswordForm token={token} />
        </AuthCard>
    );
}
