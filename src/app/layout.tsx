import type { Metadata } from "next";
import { Geist, Geist_Mono, Sora, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/NavbarClient";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/auth/SessionProvider";
import { auth } from "@/auth";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TopCareerLive | Find Work That Fits Your Life",
  description: "Connect with top employers, discover opportunities, and accelerate your career journey with Top Career Live.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  // Check if this is a bare/standalone page (no Navbar/Footer)
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || headersList.get("x-next-pathname") || headersList.get("x-invoke-path") || "";
  const isBare = pathname.startsWith("/admin-login");

  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} ${inter.variable} antialiased bg-[#f8fafc] text-[#0e1b1a] flex flex-col min-h-screen font-sans overflow-x-hidden`}
      >
        <AuthProvider session={session}>
          {isBare ? (
            children
          ) : (
            <>
              <Navbar session={session} />
              <main className="flex-grow max-w-[1440px] mx-auto px-4 md:px-6 lg:px-10 w-full min-w-0">
                {children}
              </main>
              <Footer session={session} />
            </>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}
