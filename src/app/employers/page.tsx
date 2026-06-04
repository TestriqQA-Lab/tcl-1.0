import { HeroSection } from "@/components/employers/HeroSection";
import { HiringProcessSection } from "@/components/employers/HiringProcessSection";
import { BuiltForEveryEmployerSection } from "@/components/employers/BuiltForEveryEmployerSection";
import { PowerfulToolsSection } from "@/components/employers/PowerfulToolsSection";
import { FAQSection } from "@/components/employers/FAQSection";
import { CTASection } from "@/components/employers/CTASection";

export default function EmployersPage() {
    return (
        <div className="text-slate-900">
            <HeroSection />

            <HiringProcessSection />
            <BuiltForEveryEmployerSection />
            <PowerfulToolsSection />
            <FAQSection />
            <CTASection />

            {/* Footer is assumed to be handled by the layout.tsx if not we can add it here */}
        </div>
    );
}
