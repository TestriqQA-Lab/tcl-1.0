import { auth } from "@/auth";
import { redirect } from "next/navigation";
import "@/app/globals.css";
import AdminLayoutWrapper from "@/components/admin-dashboard/AdminLayoutWrapper";

export const metadata = {
    title: "Admin Dashboard | TopCareerLive",
    description: "Manage system activity and user profiles on the platform.",
};

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Not logged in → send to login
    /*
    if (!session?.user) {
        redirect("/login");
    }

    // Logged in but not an admin → send home
    if (session.user.role !== "ADMIN") {
        redirect("/");
    }
    */

    return (
        <div className="fixed inset-0 z-[100] bg-[#F9FAFB] flex md:flex-row flex-col overflow-hidden">
            <AdminLayoutWrapper user={{ name: session?.user?.name, email: session?.user?.email }}>
                {children}
            </AdminLayoutWrapper>
        </div>
    );
}
