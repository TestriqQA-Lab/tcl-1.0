import { HeroSection } from "@/components/home/HeroSection";
import { TrustedCompanies } from "@/components/home/TrustedCompanies";
import { CategorySection } from "@/components/home/CategorySection";
import { JobOpeningsSection } from "@/components/home/JobOpeningsSection";
import { RecruiterCTA } from "@/components/home/RecruiterCTA";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  // If user is already logged in, redirect them to their respective dashboard
  if (session?.user) {
    if (session.user.role === "EMPLOYER") {
      redirect("/employer-dashboard");
    } else {
      redirect("/user-dashboard");
    }
  }

  return (
    <>
      <HeroSection />
      <TrustedCompanies />
      <CategorySection />
      <JobOpeningsSection />
      <RecruiterCTA />
    </>
  );
}
