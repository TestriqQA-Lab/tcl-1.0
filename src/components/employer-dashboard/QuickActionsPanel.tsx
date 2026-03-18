"use client";

import Link from "next/link";
import {
    PlusCircle,
    Search,
    Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getEmployerProfile } from "@/actions/employer.actions";
import { VerificationModal } from "./VerificationModal";

const actions = [
    {
        label: "Post New Job",
        icon: PlusCircle,
        href: "/employer-dashboard/post-job",
    },
    {
        label: "Search Candidates",
        icon: Search,
        href: "/database-search",
    },
    {
        label: "Review Applications",
        icon: Calendar,
        href: "/employer-applications",
    },
];

export function QuickActionsPanel() {
    const { data: session } = useSession();
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<string | null>(null);

    const userId = session?.user?.id;

    useEffect(() => {
        if (!userId) return;
        getEmployerProfile(userId).then((profile) => {
            if (profile) {
                setVerificationStatus(profile.verificationStatus ?? "UNVERIFIED");
            } else {
                setVerificationStatus("UNVERIFIED");
            }
        });
    }, [userId]);

    const handleActionClick = (e: React.MouseEvent, label: string) => {
        if (label === "Post New Job" && verificationStatus !== "APPROVED") {
            e.preventDefault();
            setShowVerificationModal(true);
        }
    };

    return (
        <div className="hidden lg:flex flex-col bg-white rounded-xl border border-[#E2E8F0] p-5 gap-3.5">
            <h3 className="text-[15px] font-bold text-[#0e1b1a]">Quick Actions</h3>
            {actions.map((action) => (
                <Link
                    key={action.label}
                    href={action.href}
                    onClick={(e) => handleActionClick(e, action.label)}
                    className="flex items-center gap-2.5 h-[42px] px-3.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-lg transition-colors"
                >
                    <action.icon size={18} className="text-[#0f766d]" />
                    <span className="text-[13px] font-medium text-[#0e1b1a]">
                        {action.label}
                    </span>
                </Link>
            ))}

            <VerificationModal 
                isOpen={showVerificationModal}
                onClose={() => setShowVerificationModal(false)}
                verificationStatus={verificationStatus}
            />
        </div>
    );
}
