import React from "react";
import { type Metadata } from "next";
import EmployerProfilesContent from "@/components/admin-dashboard/EmployerProfilesContent";

export const metadata: Metadata = {
    title: "Employer Profiles | Admin Dashboard",
    description: "Manage all registered companies on the platform.",
};

export default function EmployersProfilePage() {
    return <EmployerProfilesContent />;
}
