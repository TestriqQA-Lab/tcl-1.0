"use client";

import { AuthModal } from "./AuthModal";
import { LoginForm } from "./LoginForm";

interface EmployerAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const EmployerAuthModal = ({ isOpen, onClose }: EmployerAuthModalProps) => {
    return (
        <AuthModal
            isOpen={isOpen}
            onClose={onClose}
            title="Employer Login"
            subtitle="Access your employer dashboard"
        >
            <LoginForm
                onClose={onClose}
                role="EMPLOYER"
                hideGoogleLogin={true}
                registerHref="/employers/client-registration"
            />
        </AuthModal>
    );
};
