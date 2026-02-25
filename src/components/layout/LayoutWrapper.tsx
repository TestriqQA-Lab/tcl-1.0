"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { EmployerNavbar } from "../employer/EmployerNavbar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isEmployerPage = pathname?.startsWith("/employers");

    return (
        <>
            {isEmployerPage ? <EmployerNavbar /> : <Navbar />}
            <main className={isEmployerPage ? "" : "flex-grow max-w-7xl mx-auto px-6 lg:px-10 w-full"}>
                {children}
            </main>
            <Footer />
        </>
    );
}
