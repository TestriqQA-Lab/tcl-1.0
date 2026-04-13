import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
    title: "Admin Login | TopCareerLive",
    description: "Secure login portal for TopCareerLive administrators.",
};

export default function AdminLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
