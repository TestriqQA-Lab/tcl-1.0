import React from "react";
import { type Metadata } from "next";
import DetailedEmployerProfileContent from "@/components/admin-dashboard/DetailedEmployerProfileContent";

export const metadata: Metadata = {
    title: "Employer Profile Details | Admin Dashboard",
    description: "View detailed employer profile and verification information.",
};

export default function DetailedEmployerProfilePage() {
    return <DetailedEmployerProfileContent />;
}
