import React from "react";

interface AuthCardProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

export const AuthCard = ({ children, title, subtitle }: AuthCardProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md bg-white p-8 rounded-none shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                    {subtitle && (
                        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
                    )}
                </div>
                {children}
            </div>
        </div>
    );
};
