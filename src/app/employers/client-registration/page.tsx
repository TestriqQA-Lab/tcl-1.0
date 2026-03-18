"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    CheckCircle2, Check, EyeOff, Eye, UserPlus, Rocket,
    Building2, ChevronDown, PartyPopper, Loader2
} from "lucide-react";
import { registerEmployerAction } from "@/actions/employer.actions";

type Step = "otp" | "basic-details" | "company-details";

export default function ClientRegistrationPage() {
    const router = useRouter();
    // ── Shared state ──
    const [step, setStep] = useState<Step>("otp");

    // ── OTP Step state ──
    const [phone, setPhone] = useState("");
    const [whatsappConsent, setWhatsappConsent] = useState(true);
    const [termsConsent, setTermsConsent] = useState(true);

    // ── Basic Details Step state ──
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [accountType, setAccountType] = useState<"company" | "individual">("company");

    // ── Company Details Step state ──
    const [hiringFor, setHiringFor] = useState<"company" | "consultancy">("company");
    const [companyName, setCompanyName] = useState("");
    const [industry, setIndustry] = useState("");
    const [employees, setEmployees] = useState("");
    const [designation, setDesignation] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [companyAddress, setCompanyAddress] = useState("");

    // ── Success Popup state ──
    const [showSuccess, setShowSuccess] = useState(false);

    // ── Submission state ──
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const isOtpValid = phone.length >= 10 && termsConsent;
    const isWorkEmail = (email: string) => {
        const publicDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", "rediffmail.com", "protonmail.com"];
        const domain = email.split("@")[1];
        return domain && !publicDomains.includes(domain.toLowerCase());
    };

    const isBasicValid = fullName.trim().length > 0 &&
        email.trim().length > 0 &&
        password.length >= 6 &&
        (accountType === "individual" || isWorkEmail(email));
    const isCompanyValid = companyName.trim().length > 0 && designation.trim().length > 0;

    const handleSendOTP = () => {
        if (isOtpValid) {
            setStep("basic-details");
        }
    };

    const handleBasicContinue = () => {
        if (isBasicValid) {
            setStep("company-details");
        }
    };

    const handleCompanyContinue = async () => {
        if (!isCompanyValid || isLoading) return;
        setIsLoading(true);
        setSubmitError(null);
        const result = await registerEmployerAction({
            phone,
            fullName,
            email,
            password,
            accountType,
            hiringFor,
            companyName,
            companyIndustry: industry,
            companySize: employees,
            designation,
            pincode: pinCode,
            companyAddress,
        });
        setIsLoading(false);
        if (result.error) {
            setSubmitError(result.error);
        } else {
            // Auto-login the newly registered employer
            const { signIn } = await import("next-auth/react");
            await signIn("credentials", { email, password, redirect: false });
            router.refresh();
            setShowSuccess(true);
        }
    };

    // Confetti particle colors & config
    const confettiColors = ["#22c55e", "#2563EB", "#F59E0B", "#EC4899", "#8B5CF6", "#14b8a6", "#EF4444", "#F97316"];
    const confettiParticles = Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: confettiColors[i % confettiColors.length],
        delay: Math.random() * 2,
        duration: 2.5 + Math.random() * 2,
        size: 4 + Math.random() * 6,
        shape: i % 3, // 0=circle, 1=square, 2=strip
        rotation: Math.random() * 360,
        drift: (Math.random() - 0.5) * 80,
    }));

    const avatars = [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    ];

    const features = [
        "Post unlimited job listings",
        "Access 9 Cr+ verified candidates",
        "AI-powered applicant tracking",
    ];

    const isStep2 = step === "company-details";

    // ════════════════════════════════════════
    //  STEP 1: OTP
    // ════════════════════════════════════════
    if (step === "otp") {
        return (
            <section className="w-[100vw] relative left-1/2 -translate-x-1/2 bg-gradient-to-b from-[#F1F5F9] to-[#E8F0EE]">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-10 min-h-[calc(100vh-72px)]">
                    <div className="flex flex-col lg:flex-row items-center gap-10 py-10 md:py-16 lg:py-[100px]">
                        <div className="flex flex-col gap-5 md:gap-7 w-full lg:flex-1 items-center lg:items-start text-center lg:text-left">
                            <h1 className="text-[30px] md:text-[40px] lg:text-[52px] font-bold text-[#0e1b1a] leading-[1.15] tracking-tight font-inter">
                                Find &amp; hire the
                                <br className="hidden lg:block" />
                                {" "}right talent with us
                            </h1>
                            <p className="text-[13px] md:text-[15px] lg:text-base font-medium text-[#71717A] font-inter">
                                Trusted by 9 Cr+ candidates | 5 Lakh+ employers
                            </p>
                            <div className="flex items-center -space-x-2.5 md:-space-x-3">
                                {avatars.map((src, i) => (
                                    <div key={i} className="w-9 h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full border-2 md:border-[3px] border-white overflow-hidden relative">
                                        <Image src={src} alt={`User avatar ${i + 1}`} fill className="object-cover" sizes="48px" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-full max-w-[420px] lg:w-[420px] lg:flex-shrink-0">
                            <div className="bg-white rounded-2xl p-7 md:p-9 lg:p-10 shadow-[0_12px_40px_-4px_rgba(0,0,0,0.1)] flex flex-col gap-5 md:gap-6">
                                <h2 className="text-[19px] md:text-[20px] lg:text-[22px] font-bold text-[#0e1b1a] font-inter">Continue with mobile</h2>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[13px] lg:text-sm font-semibold text-[#0e1b1a] font-inter">Mobile number</label>
                                    <div className="flex items-center h-11 md:h-[46px] lg:h-12 rounded-[10px] border-[1.5px] border-[#E4E4E7] bg-[#FAFAFA] px-3 md:px-4 gap-2">
                                        <span className="text-[13px] lg:text-sm font-medium text-[#0e1b1a] font-inter whitespace-nowrap select-none">+91 ▾</span>
                                        <div className="w-px h-5 md:h-[22px] lg:h-6 bg-[#E4E4E7]" />
                                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Enter mobile number"
                                            className="flex-1 bg-transparent text-[13px] lg:text-sm text-[#0e1b1a] placeholder:text-[#A1A1AA] font-inter outline-none" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2.5 md:gap-3">
                                    <label className="flex items-start gap-2.5 cursor-pointer">
                                        <button type="button" onClick={() => setWhatsappConsent(!whatsappConsent)}
                                            className={`w-[18px] h-[18px] lg:w-5 lg:h-5 rounded flex-shrink-0 flex items-center justify-center transition-colors mt-0.5 ${whatsappConsent ? "bg-[#2563EB]" : "border-[1.5px] border-[#D4D4D8] bg-white"}`}>
                                            {whatsappConsent && <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />}
                                        </button>
                                        <span className="text-xs lg:text-[13px] text-[#3F3F46] font-inter leading-snug">
                                            I agree to receive important updates on{" "}<span className="inline-flex items-center gap-0.5">🟢 WhatsApp</span>
                                        </span>
                                    </label>
                                    <label className="flex items-start gap-2.5 cursor-pointer">
                                        <button type="button" onClick={() => setTermsConsent(!termsConsent)}
                                            className={`w-[18px] h-[18px] lg:w-5 lg:h-5 rounded flex-shrink-0 flex items-center justify-center transition-colors mt-0.5 ${termsConsent ? "bg-[#2563EB]" : "border-[1.5px] border-[#D4D4D8] bg-white"}`}>
                                            {termsConsent && <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />}
                                        </button>
                                        <span className="text-xs lg:text-[13px] text-[#3F3F46] font-inter leading-snug">
                                            I agree to the{" "}<Link href="#" className="text-[#2563EB] hover:underline font-medium">Privacy Policy</Link>{" "}and{" "}<Link href="#" className="text-[#2563EB] hover:underline font-medium">Terms &amp; Conditions</Link>
                                        </span>
                                    </label>
                                </div>
                                <button type="button" onClick={handleSendOTP} disabled={!isOtpValid}
                                    className={`w-full h-11 md:h-[46px] lg:h-12 rounded-[10px] text-sm md:text-[15px] font-semibold font-inter transition-all active:scale-[0.98] ${isOtpValid
                                        ? "bg-[#0f766d] text-white shadow-lg shadow-[#0f766d]/30 hover:bg-[#0d635c]"
                                        : "bg-[#E4E4E7] text-[#71717A] cursor-not-allowed"}`}>
                                    Send OTP
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // ════════════════════════════════════════
    //  SHARED LAYOUT: Steps 2 & 3
    //  (Dark branding panel + form card)
    // ════════════════════════════════════════

    const inputClass = "w-full h-[38px] md:h-10 lg:h-10 rounded-[10px] border-[1.5px] border-[#E2E8F0] bg-white px-3 md:px-4 text-[12px] md:text-[13px] lg:text-sm text-[#0e1b1a] placeholder:text-[#A1A1AA] font-inter outline-none focus:border-[#2563EB] transition-colors";
    const selectClass = "w-full h-[38px] md:h-10 lg:h-10 rounded-[10px] border-[1.5px] border-[#E2E8F0] bg-white px-3 md:px-4 text-[12px] md:text-[13px] lg:text-sm text-[#0e1b1a] font-inter outline-none focus:border-[#2563EB] transition-colors appearance-none cursor-pointer";
    const labelClass = "text-[11px] md:text-[12px] lg:text-[13px] font-semibold text-[#0e1b1a] font-inter";

    return (
        <section className="w-[100vw] relative left-1/2 -translate-x-1/2">
            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-72px)]">

                {/* ── LEFT: Dark Branding Panel (desktop only) ── */}
                <div className="hidden lg:flex flex-col justify-between w-[500px] xl:w-[620px] flex-shrink-0 bg-gradient-to-b from-[#0e1b1a] to-[#134e4a] py-10 pl-12 xl:pl-22 pr-16">
                    <div className="flex flex-col gap-10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-white/[0.12] flex items-center justify-center">
                                <Rocket className="w-[18px] h-[18px] text-white" />
                            </div>
                            <span className="text-white text-xl font-bold tracking-tight font-inter">TopCareerLive</span>
                        </div>
                        {/* Stepper */}
                        <div className="flex items-center gap-0">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-[#14b8a6] ring-[3px] ring-[#14b8a6]/20 flex items-center justify-center">
                                    {isStep2
                                        ? <Check className="w-4 h-4 text-white" strokeWidth={3} />
                                        : <span className="text-white text-xs font-bold font-inter">1</span>
                                    }
                                </div>
                                <span className={`text-sm font-inter ${isStep2 ? "text-white/60 font-medium" : "text-white font-semibold"}`}>Basic details</span>
                            </div>
                            <div className={`w-[60px] h-0.5 mx-1 ${isStep2 ? "bg-[#14b8a6]/50" : "bg-white/20"}`} />
                            <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isStep2
                                    ? "bg-[#14b8a6] ring-[3px] ring-[#14b8a6]/20"
                                    : "bg-white/[0.08] ring-2 ring-white/[0.12]"}`}>
                                    <span className={`text-xs font-inter ${isStep2 ? "text-white font-bold" : "text-white/40 font-semibold"}`}>2</span>
                                </div>
                                <span className={`text-sm font-inter ${isStep2 ? "text-white font-semibold" : "text-white/40 font-medium"}`}>Company details</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-5">
                        <h2 className="text-4xl font-bold text-white leading-[1.25] tracking-tight font-inter">Create your<br />employer account</h2>
                        <p className="text-white/65 text-base font-inter leading-relaxed">Set up your profile in minutes and<br />start hiring top talent today.</p>
                        <div className="flex flex-col gap-4 mt-2">
                            {features.map((f) => (
                                <div key={f} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#14b8a6]/[0.12] flex items-center justify-center flex-shrink-0">
                                        <Check className="w-4 h-4 text-[#14b8a6]" />
                                    </div>
                                    <span className="text-white/80 text-sm font-medium font-inter">{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-white/25 text-xs font-inter">© 2026 TopCareerLive. All rights reserved.</p>
                </div>

                {/* ── TOP: Dark Header (tablet & mobile only) ── */}
                <div className="lg:hidden bg-[#0e1b1a] flex flex-col items-center gap-4 px-5 md:px-10 py-5 md:py-6">
                    <div className="flex items-center gap-1.5 md:gap-2">
                        <div className="w-6 h-6 md:w-7 md:h-7 rounded-md bg-white/[0.12] flex items-center justify-center">
                            <Rocket className="w-[13px] h-[13px] md:w-[15px] md:h-[15px] text-white" />
                        </div>
                        <span className="text-white text-[15px] md:text-[17px] font-bold tracking-tight font-inter">TopCareerLive</span>
                    </div>
                    <div className="flex items-center gap-0">
                        <div className="flex items-center gap-1.5 md:gap-2">
                            <div className="w-[22px] h-[22px] md:w-[26px] md:h-[26px] rounded-full bg-[#14b8a6] ring-2 md:ring-[3px] ring-[#14b8a6]/20 flex items-center justify-center">
                                {isStep2
                                    ? <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                    : <span className="text-white text-[10px] md:text-[11px] font-bold font-inter">1</span>
                                }
                            </div>
                            <span className={`text-xs md:text-[13px] font-inter ${isStep2 ? "text-white/60 font-medium" : "text-white font-semibold"}`}>Basic details</span>
                        </div>
                        <div className={`w-9 md:w-[50px] h-0.5 mx-0.5 md:mx-1 ${isStep2 ? "bg-[#14b8a6]/50" : "bg-white/20"}`} />
                        <div className="flex items-center gap-1.5 md:gap-2">
                            <div className={`w-[22px] h-[22px] md:w-[26px] md:h-[26px] rounded-full flex items-center justify-center ${isStep2
                                ? "bg-[#14b8a6] ring-2 md:ring-[3px] ring-[#14b8a6]/20"
                                : "bg-white/[0.08] ring-2 ring-white/[0.12]"}`}>
                                <span className={`text-[10px] md:text-[11px] font-inter ${isStep2 ? "text-white font-bold" : "text-white/40 font-semibold"}`}>2</span>
                            </div>
                            <span className={`text-xs md:text-[13px] font-inter ${isStep2 ? "text-white font-semibold" : "text-white/40 font-medium"}`}>Company details</span>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT / BODY: Form Panel ── */}
                <div className={`flex-1 bg-[#F8FAFB] flex justify-center items-start lg:items-center px-5 md:px-12 lg:px-16 ${isStep2 ? "py-5 md:py-7 lg:py-5" : "py-7 md:py-10 lg:py-8"}`}>
                    <div className={`w-full max-w-[460px] bg-white rounded-2xl shadow-[0_8px_30px_-8px_rgba(0,0,0,0.05)] flex flex-col ${isStep2 ? "p-5 md:p-7 lg:p-6 gap-3 md:gap-3.5 lg:gap-3.5" : "p-7 md:p-9 lg:p-8 gap-4 md:gap-5 lg:gap-5"}`}>

                        {/* ═══ BASIC DETAILS FORM ═══ */}
                        {step === "basic-details" && (
                            <>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-xl lg:rounded-[14px] bg-gradient-to-br from-[#E0F2FE] to-[#DBEAFE] flex items-center justify-center">
                                        <UserPlus className="w-5 h-5 md:w-[22px] md:h-[22px] lg:w-[22px] lg:h-[22px] text-[#2563EB]" />
                                    </div>
                                    <p className="text-[12px] md:text-[13px] lg:text-[13px] text-[#64748B] text-center font-inter leading-snug">
                                        We need these details to identify you<br />and create your account
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[12px] md:text-[13px] lg:text-sm text-[#64748B] font-medium font-inter">Mobile:</span>
                                    <span className="text-[12px] md:text-[13px] lg:text-sm text-[#0e1b1a] font-semibold font-inter">+91 {phone || "9372801656"}</span>
                                    <div className="w-4 h-4 md:w-[18px] md:h-[18px] lg:w-5 lg:h-5 rounded-full bg-[#22c55e] flex items-center justify-center">
                                        <Check className="w-2.5 h-2.5 md:w-[11px] md:h-[11px] lg:w-3 lg:h-3 text-white" strokeWidth={3} />
                                    </div>
                                </div>
                                <div className="h-px bg-[#F1F5F9]" />
                                <div className="flex flex-col gap-2">
                                    <span className="text-[12px] md:text-[13px] lg:text-sm text-[#0e1b1a] font-semibold font-inter">You&apos;re creating account as</span>
                                    <div className="flex flex-col md:flex-row gap-3 md:gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer" onClick={() => setAccountType("company")}>
                                            <div className={`w-[18px] h-[18px] lg:w-5 lg:h-5 rounded-full border-2 flex items-center justify-center ${accountType === "company" ? "border-[#2563EB]" : "border-[#D4D4D8]"}`}>
                                                {accountType === "company" && <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-[#2563EB]" />}
                                            </div>
                                            <span className={`text-[12px] md:text-[13px] font-medium font-inter ${accountType === "company" ? "text-[#0e1b1a]" : "text-[#71717A]"}`}>Company/business</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer" onClick={() => setAccountType("individual")}>
                                            <div className={`w-[18px] h-[18px] lg:w-5 lg:h-5 rounded-full border-2 flex items-center justify-center ${accountType === "individual" ? "border-[#2563EB]" : "border-[#D4D4D8]"}`}>
                                                {accountType === "individual" && <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-[#2563EB]" />}
                                            </div>
                                            <span className={`text-[12px] md:text-[13px] font-medium font-inter ${accountType === "individual" ? "text-[#0e1b1a]" : "text-[#71717A]"}`}>Individual/proprietor</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 md:gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className={labelClass}>Full name</label>
                                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Name as per PAN" className={inputClass} />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className={labelClass}>Official email ID</label>
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={accountType === "company" ? "Enter work email ID" : "Enter email ID"} className={inputClass} />
                                        {accountType === "company" && email && !isWorkEmail(email) && (
                                            <span className="text-[11px] text-red-500 font-medium">Please enter a valid work email. Gmail, Yahoo, etc. are not allowed for companies.</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className={labelClass}>Create password</label>
                                        <div className="relative">
                                            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password"
                                                className={`${inputClass} pr-10`} />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors">
                                                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" onClick={handleBasicContinue} disabled={!isBasicValid}
                                    className={`w-full h-11 md:h-[46px] lg:h-11 rounded-xl text-sm md:text-[15px] font-semibold font-inter transition-all active:scale-[0.98] ${isBasicValid
                                        ? "bg-[#0f766d] text-white shadow-lg shadow-[#0f766d]/30 hover:bg-[#0d635c]"
                                        : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"}`}>
                                    Continue
                                </button>
                            </>
                        )}

                        {/* ═══ COMPANY DETAILS FORM ═══ */}
                        {step === "company-details" && (
                            <>
                                <div className="flex flex-col items-center gap-1.5">
                                    <div className="w-9 h-9 md:w-10 md:h-10 lg:w-10 lg:h-10 rounded-xl lg:rounded-[12px] bg-gradient-to-br from-[#E0F2FE] to-[#DBEAFE] flex items-center justify-center">
                                        <Building2 className="w-[18px] h-[18px] md:w-5 md:h-5 lg:w-5 lg:h-5 text-[#2563EB]" />
                                    </div>
                                    <p className="text-[11px] md:text-[12px] lg:text-[12px] text-[#64748B] text-center font-inter leading-snug">
                                        We use this information to know about the company<br />you&apos;re hiring for and to generate an invoice
                                    </p>
                                </div>

                                {/* Hiring for */}
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[11px] md:text-[12px] lg:text-[13px] text-[#0e1b1a] font-semibold font-inter">Hiring for</span>
                                    <div className="flex flex-col md:flex-row gap-3 md:gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer" onClick={() => setHiringFor("company")}>
                                            <div className={`w-[18px] h-[18px] lg:w-5 lg:h-5 rounded-full border-2 flex items-center justify-center ${hiringFor === "company" ? "border-[#2563EB]" : "border-[#D4D4D8]"}`}>
                                                {hiringFor === "company" && <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-[#2563EB]" />}
                                            </div>
                                            <span className={`text-[12px] md:text-[13px] font-medium font-inter ${hiringFor === "company" ? "text-[#0e1b1a]" : "text-[#71717A]"}`}>your company</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer" onClick={() => setHiringFor("individual_proprietor" as any)}>
                                            <div className={`w-[18px] h-[18px] lg:w-5 lg:h-5 rounded-full border-2 flex items-center justify-center ${hiringFor === "individual_proprietor" as any ? "border-[#2563EB]" : "border-[#D4D4D8]"}`}>
                                                {hiringFor === "individual_proprietor" as any && <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-[#2563EB]" />}
                                            </div>
                                            <span className={`text-[12px] md:text-[13px] font-medium font-inter ${hiringFor === "individual_proprietor" as any ? "text-[#0e1b1a]" : "text-[#71717A]"}`}>an individual proprietor</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="flex flex-col gap-2.5 md:gap-3">
                                    {/* Company */}
                                    <div className="flex flex-col gap-1">
                                        <label className={labelClass}>Company</label>
                                        <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Enter company name" className={inputClass} />
                                    </div>
                                    {/* Select industry */}
                                    <div className="flex flex-col gap-1">
                                        <label className={labelClass}>Select industry</label>
                                        <div className="relative">
                                            <select value={industry} onChange={(e) => setIndustry(e.target.value)} className={selectClass}>
                                                <option value="">Select industry</option>
                                                <option value="Healthcare">Healthcare</option>
                                                <option value="Manufacturing">Manufacturing</option>
                                                <option value="IT / Software">IT / Software</option>
                                                <option value="Finance / Banking">Finance / Banking</option>
                                                <option value="Education">Education</option>
                                                <option value="Retail">Retail</option>
                                                <option value="Construction">Construction</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
                                        </div>
                                    </div>
                                    {/* Number of employees */}
                                    <div className="flex flex-col gap-1">
                                        <label className={labelClass}>Number of employees</label>
                                        <div className="relative">
                                            <select value={employees} onChange={(e) => setEmployees(e.target.value)} className={selectClass}>
                                                <option value="">Select range</option>
                                                <option value="1-10">1–10</option>
                                                <option value="11-50">11–50</option>
                                                <option value="51-200">51–200</option>
                                                <option value="201-500">201–500</option>
                                                <option value="501-1000">501–1000</option>
                                                <option value="1000+">1000+</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
                                        </div>
                                    </div>
                                    {/* Your designation */}
                                    <div className="flex flex-col gap-1">
                                        <label className={labelClass}>Your designation</label>
                                        <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="Enter designation" className={inputClass} />
                                    </div>
                                    {/* Pin code */}
                                    <div className="flex flex-col gap-1">
                                        <label className={labelClass}>Pin code</label>
                                        <input type="text" value={pinCode} onChange={(e) => setPinCode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Enter company pincode" className={inputClass} />
                                    </div>
                                    {/* Company address */}
                                    <div className="flex flex-col gap-1">
                                        <label className={labelClass}>Company address</label>
                                        <textarea value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} placeholder="Enter company address" rows={2}
                                            className="w-full rounded-[10px] border-[1.5px] border-[#E2E8F0] bg-white px-3 md:px-4 py-2 text-[12px] md:text-[13px] lg:text-sm text-[#0e1b1a] placeholder:text-[#A1A1AA] font-inter outline-none focus:border-[#2563EB] transition-colors resize-none" />
                                    </div>
                                </div>

                                {/* Error message */}
                                {submitError && (
                                    <p className="text-sm text-red-500 font-inter text-center bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                        {submitError}
                                    </p>
                                )}

                                {/* Continue Button */}
                                <button type="button" onClick={handleCompanyContinue} disabled={!isCompanyValid || isLoading}
                                    className={`w-full h-10 md:h-11 lg:h-10 rounded-xl text-[13px] md:text-sm font-semibold font-inter transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${isCompanyValid && !isLoading
                                        ? "bg-[#0f766d] text-white shadow-lg shadow-[#0f766d]/30 hover:bg-[#0d635c]"
                                        : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"}`}>
                                    {isLoading ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
                                    ) : "Continue"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ═══ SUCCESS POPUP MODAL ═══ */}
            {showSuccess && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.3s_ease]" />

                    {/* Confetti */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {confettiParticles.map((p) => (
                            <div
                                key={p.id}
                                className="absolute -top-3"
                                style={{
                                    left: `${p.left}%`,
                                    width: p.shape === 2 ? 4 : p.size,
                                    height: p.shape === 2 ? p.size * 2.5 : p.size,
                                    backgroundColor: p.color,
                                    borderRadius: p.shape === 0 ? "50%" : p.shape === 2 ? 2 : 1,
                                    transform: `rotate(${p.rotation}deg)`,
                                    animation: `confettiFall ${p.duration}s ${p.delay}s ease-in both`,
                                    opacity: 0,
                                }}
                            />
                        ))}
                    </div>

                    {/* Card */}
                    <div className="relative z-10 w-[90vw] max-w-[480px] bg-white rounded-2xl md:rounded-3xl p-8 md:p-10 lg:p-12 shadow-[0_24px_60px_-10px_rgba(0,0,0,0.2)] flex flex-col items-center gap-6 md:gap-7 animate-[popIn_0.5s_cubic-bezier(0.34,1.56,0.64,1)_both]">

                        {/* Green Check Icon */}
                        <div className="relative">
                            <div className="w-20 h-20 md:w-[88px] md:h-[88px] rounded-full bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0] flex items-center justify-center shadow-[0_6px_20px_-2px_rgba(34,197,94,0.3)]">
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center">
                                    <Check className="w-7 h-7 md:w-8 md:h-8 text-white" strokeWidth={3} />
                                </div>
                            </div>
                            {/* Party Poppers */}
                            <div className="absolute -top-2 -left-4 animate-[popBounce_0.6s_0.4s_ease_both]">
                                <PartyPopper className="w-6 h-6 text-[#F59E0B] -rotate-12" />
                            </div>
                            <div className="absolute -top-2 -right-4 animate-[popBounce_0.6s_0.5s_ease_both]">
                                <PartyPopper className="w-6 h-6 text-[#EC4899] rotate-12 scale-x-[-1]" />
                            </div>
                        </div>

                        {/* Text */}
                        <div className="flex flex-col items-center gap-2.5 md:gap-3">
                            <h2 className="text-[28px] md:text-[34px] lg:text-[36px] font-extrabold text-[#0e1b1a] tracking-tight font-inter">Congratulations</h2>
                            <p className="text-[13px] md:text-[15px] lg:text-base text-[#64748B] text-center font-inter leading-relaxed">
                                Your TopCareerLive recruiter account is created!<br />
                                Go ahead &amp; explore our range of hiring plans.
                            </p>
                        </div>

                        {/* Explore Plans Button */}
                        <button
                            type="button"
                            onClick={() => window.location.href = "/employer-dashboard"}
                            className="w-full max-w-[280px] h-[50px] md:h-[52px] rounded-[14px] bg-gradient-to-b from-[#2563EB] to-[#1D4ED8] text-white text-[15px] md:text-base font-semibold font-inter shadow-[0_6px_16px_-2px_rgba(37,99,235,0.4)] hover:shadow-[0_8px_24px_-2px_rgba(37,99,235,0.5)] transition-all active:scale-[0.97] hover:brightness-110"
                        >
                            Explore plans
                        </button>
                    </div>
                </div>
            )}

            {/* Confetti & Popup Animations */}
            <style jsx>{`
                @keyframes confettiFall {
                    0% {
                        transform: translateY(0) rotate(0deg) translateX(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg) translateX(var(--drift, 40px));
                        opacity: 0;
                    }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes popIn {
                    from {
                        opacity: 0;
                        transform: scale(0.7) translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                @keyframes popBounce {
                    0% {
                        opacity: 0;
                        transform: scale(0) rotate(0deg);
                    }
                    60% {
                        opacity: 1;
                        transform: scale(1.3) rotate(-5deg);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) rotate(0deg);
                    }
                }
            `}</style>
        </section>
    );
}
