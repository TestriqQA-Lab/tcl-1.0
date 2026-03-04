import "@/app/globals.css";

export const metadata = {
    title: "Employer Dashboard | TopCareerLive",
    description:
        "Manage your recruitment pipeline, track applications, and grow your team with TopCareerLive.",
};

export default function EmployerDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="fixed inset-0 z-[100] bg-[#F8FAFB] overflow-auto">
            {children}
        </div>
    );
}
