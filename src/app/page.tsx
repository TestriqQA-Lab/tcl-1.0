import { HeroSection } from "@/components/home/HeroSection";
import { TrustedCompanies } from "@/components/home/TrustedCompanies";
import { CategorySection } from "@/components/home/CategorySection";
import { JobOpeningsSection } from "@/components/home/JobOpeningsSection";
import { RecruiterCTA } from "@/components/home/RecruiterCTA";

export default function Home() {
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
