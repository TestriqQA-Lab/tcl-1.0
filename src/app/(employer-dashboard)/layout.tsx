import { auth } from "@/auth";
import { redirect } from "next/navigation";
import "@/app/globals.css";

export const metadata = {
    title: "Employer Dashboard | TopCareerLive",
    description:
        "Manage your recruitment pipeline, track applications, and grow your team with TopCareerLive.",
};

export default async function EmployerDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Not logged in → send to employer landing page
    if (!session?.user) {
        redirect("/employers");
    }

    // Logged in but not an employer → send home
    if (session.user.role !== "EMPLOYER") {
        redirect("/");
    }

    return (
        <div className="fixed inset-0 z-[100] bg-[#F8FAFB] overflow-auto">
            {children}
        </div>
    );
}
