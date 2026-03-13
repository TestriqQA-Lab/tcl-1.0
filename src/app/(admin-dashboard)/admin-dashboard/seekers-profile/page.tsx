import React from "react";
import { type Metadata } from "next";
import SeekersProfileContent from "@/components/admin-dashboard/SeekersProfileContent";

export const metadata: Metadata = {
    title: "Seeker Profiles | Admin Dashboard",
    description: "Manage all registered job seekers on the platform.",
};

export default function SeekersProfilePage() {
    return <SeekersProfileContent />;
}
