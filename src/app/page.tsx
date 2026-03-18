import { HeroSection } from "@/components/home/HeroSection";
import { TrustedCompanies } from "@/components/home/TrustedCompanies";
import { IndustrySection } from "@/components/home/IndustrySection";
import { JobOpeningsSection } from "@/components/home/JobOpeningsSection";
import { RecruiterCTA } from "@/components/home/RecruiterCTA";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home({ searchParams }: { searchParams: Promise<{ nav?: string }> }) {
  const { nav } = await searchParams;
  const session = await auth();

  // If user is already logged in, redirect them to their respective dashboard
  if (session?.user) {
    if (session.user.role === "EMPLOYER") {
      redirect("/employer/dashboard");
    }

    // For SEEKERs: check if their profile is incomplete (new Google user who hasn't filled the form)
    if (session.user.role === "SEEKER") {
      const { db } = await import("@/lib/db/db");
      const { users: usersTable } = await import("@/lib/db/schema");
      const { eq } = await import("drizzle-orm");

      // Fetch the user row to check phoneNumber and provider
      const dbUser = await db
        .select({ phoneNumber: usersTable.phoneNumber, provider: usersTable.provider })
        .from(usersTable)
        .where(eq(usersTable.id, session.user.id))
        .limit(1);

      if (dbUser.length > 0) {
        const { phoneNumber, provider } = dbUser[0];

        // Only intercept Google users who haven't completed the registration form yet
        if (provider === "google" && !phoneNumber) {
          redirect("/register?google=success");
        }
      }

      // Only redirect to dashboard if not coming from nav Home button
      if (nav !== "true") {
        redirect("/seeker/dashboard");
      }
    }
  }

  return (
    <>
      <HeroSection />
      <TrustedCompanies />
      <IndustrySection />
      <JobOpeningsSection />
      <RecruiterCTA />
    </>
  );
}
