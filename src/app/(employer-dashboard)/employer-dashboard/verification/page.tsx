"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ShieldCheck, UploadCloud, FileText, CheckCircle2, Loader2, AlertCircle, Building2, Briefcase, UserRound, Landmark, CreditCard, Stamp, GraduationCap, Handshake, ScrollText, BadgePercent } from "lucide-react";
import { getEmployerProfile, submitEmployerVerificationAction } from "@/actions/employer.actions";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/employer-dashboard/DashboardSidebar";
import { DashboardTopBar } from "@/components/employer-dashboard/DashboardTopBar";
import { TabletNavStrip } from "@/components/employer-dashboard/TabletNavStrip";
import { MobileBottomNav } from "@/components/employer-dashboard/MobileBottomNav";
import { EmployerFooter } from "@/components/employer/EmployerFooter";

type VerificationStatus = "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
type AccountType = "COMPANY" | "INDIVIDUAL";

export default function VerificationPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const userId = session?.user?.id;

    // Profile Data
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState<VerificationStatus>("UNVERIFIED");
    const [accountType, setAccountType] = useState<AccountType | null>(null);

    // Form State (Company)
    const [personalDocType, setPersonalDocType] = useState("");
    const [personalDocFile, setPersonalDocFile] = useState<string | null>(null);
    const [companyDocType, setCompanyDocType] = useState("");
    const [companyDocFile, setCompanyDocFile] = useState<string | null>(null);

    // Form State (Individual)
    const [tempStaffingDocType, setTempStaffingDocType] = useState("");
    const [tempStaffingDocFile, setTempStaffingDocFile] = useState<string | null>(null);

    // Submission UI State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;
        getEmployerProfile(userId).then((profile) => {
            if (profile) {
                setStatus((profile.verificationStatus as VerificationStatus) ?? "UNVERIFIED");
                setAccountType((profile.accountType as AccountType) ?? "COMPANY");
            }
            setIsLoading(false);
        });
    }, [userId]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Ensure it's less than 5MB
        if (file.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setter(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        if (!userId || !accountType) return;
        setError(null);

        // Validation
        if (accountType === "COMPANY") {
            if (!personalDocType || !personalDocFile || !companyDocType || !companyDocFile) {
                setError("Please upload all required documents and select their types.");
                return;
            }
        } else {
            if (!tempStaffingDocType || !tempStaffingDocFile) {
                setError("Please select the document type and upload the file.");
                return;
            }
        }

        setIsSubmitting(true);
        const result = await submitEmployerVerificationAction({
            userId,
            accountType,
            personalDocumentType: personalDocType,
            personalDocumentUrl: personalDocFile || undefined,
            companyDocumentType: companyDocType,
            companyDocumentUrl: companyDocFile || undefined,
            tempStaffingDocumentType: tempStaffingDocType,
            tempStaffingDocumentUrl: tempStaffingDocFile || undefined,
        });

        setIsSubmitting(false);

        if (result.error) {
            setError(result.error);
        } else {
            setStatus("PENDING");
            window.scrollTo({ top: 0, behavior: "smooth" });
            router.refresh();
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center p-8 bg-[#F8FAFB] min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-[#0f766d]" />
            </div>
        );
    }

    const FileUploadInput = ({
        label,
        value,
        setValue,
        file,
        setFile,
        options,
        requiredText = "At least 1 required"
    }: {
        label: string;
        value: string;
        setValue: (val: string) => void;
        file: string | null;
        setFile: React.Dispatch<React.SetStateAction<string | null>>;
        options: { label: string; icon: React.ReactNode }[];
        requiredText?: string;
    }) => (
        <div className="flex flex-col gap-4 p-5 md:p-6 bg-white border border-[#E2E8F0] rounded-xl shadow-sm">
            <div className="flex flex-col gap-1">
                <h3 className="text-[15px] font-semibold text-[#0e1b1a]">{label}</h3>
                <span className="text-[12px] text-[#64748B]">({requiredText})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-2">
                {options.map((opt) => (
                    <label
                        key={opt.label}
                        onClick={() => setValue(opt.label)}
                        className={`
                            relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                            ${value === opt.label
                                ? 'border-[#2563EB] bg-[#EFF6FF]'
                                : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFB]'
                            }
                        `}
                    >
                        {/* Radio Button Custom UI */}
                        <div className={`
                            w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                            ${value === opt.label ? 'border-[#2563EB]' : 'border-[#CBD5E1]'}
                        `}>
                            {value === opt.label && <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />}
                        </div>

                        {/* Content Area */}
                        <div className="flex flex-col gap-1.5 w-full mt-0.5">
                            <div className="h-6 flex items-center mb-0.5 text-[#0f766d]">
                                {opt.icon}
                            </div>
                            <span className="text-[14px] font-semibold text-[#0e1b1a] leading-tight">
                                {opt.label}
                            </span>
                        </div>
                    </label>
                ))}
            </div>

            <label className="flex flex-col items-center justify-center h-32 w-full rounded-xl border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFB] hover:bg-[#F1F5F9] cursor-pointer transition-colors relative group">
                {file ? (
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-[13px] font-medium text-[#0e1b1a]">Document Uploaded</span>
                        <span className="text-[11px] text-[#64748B] hover:text-[#2563EB] transition-colors relative z-10">Click to change</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-[#E2E8F0] group-hover:border-[#2563EB]/40 group-hover:bg-[#EFF6FF] transition-all">
                            <UploadCloud className="w-5 h-5 text-[#64748B] group-hover:text-[#2563EB]" />
                        </div>
                        <span className="text-[13px] font-medium text-[#0f766d]">Upload Document</span>
                        <span className="text-[11px] text-[#94A3B8]">Max Size 5MB (JPG, PNG, PDF)</span>
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setFile)}
                />
            </label>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen w-full bg-[#F8FAFB]">
            {/* Main Content Area */}
            <div className="flex flex-1 w-full">
                {/* Desktop Sidebar */}
                <DashboardSidebar activePage="Verification" />

                {/* Main Dashboard Section */}
                <div className="flex flex-col flex-1 min-w-0">
                    {/* Top Bar (responsive) */}
                    <DashboardTopBar />

                    {/* Tablet Nav Strip */}
                    <TabletNavStrip activePage="Verification" />

                    {/* Content */}
                    <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 pb-24 md:pb-6 bg-[#F8FAFB]">
                        <div className="max-w-[760px] w-full mx-auto flex flex-col gap-6 md:gap-8">

                            {/* Header Profile Check */}
                            <div className="flex flex-col gap-2">
                                <h1 className="text-[22px] md:text-[26px] font-bold text-[#0e1b1a] flex items-center gap-2.5">
                                    <ShieldCheck className="w-7 h-7 text-[#0f766d]" /> Complete your KYC
                                </h1>
                                <p className="text-[13px] md:text-[15px] text-[#64748B] leading-relaxed">
                                    To maintain a trusted network and speed up your hiring process, we require a quick verification.
                                </p>
                            </div>

                            {/* Status Banners */}
                            {status === "PENDING" && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 md:p-6 flex items-start gap-4 shadow-sm">
                                    <div className="w-10 h-10 rounded-full bg-yellow-100 shrink-0 flex items-center justify-center mt-0.5">
                                        <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <h3 className="text-[15px] font-bold text-[#0e1b1a]">Under Review</h3>
                                        <p className="text-[13px] text-[#64748B] leading-relaxed">
                                            We've received your documents and our trust &amp; safety team is reviewing them.
                                            This process typically takes 12-24 hours. You'll be notified once approved.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {status === "VERIFIED" && (
                                <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-5 md:p-6 flex items-start gap-4 shadow-sm">
                                    <div className="w-10 h-10 rounded-full bg-green-100 shrink-0 flex items-center justify-center mt-0.5">
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <h3 className="text-[15px] font-bold text-[#0e1b1a]">Account Verified</h3>
                                        <p className="text-[13px] text-[#64748B] leading-relaxed">
                                            Your account has been fully verified! You have unrestricted access to post jobs and search candidates.
                                        </p>
                                        <button
                                            onClick={() => router.push("/employer-dashboard/post-job")}
                                            className="mt-2 text-sm font-semibold text-[#0f766d] bg-white border border-[#D1FAE5] px-4 py-2 rounded-lg self-start hover:bg-green-50 transition-colors"
                                        >
                                            Post a Job
                                        </button>
                                    </div>
                                </div>
                            )}

                            {status === "REJECTED" && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-5 md:p-6 flex items-start gap-4 shadow-sm">
                                    <div className="w-10 h-10 rounded-full bg-red-100 shrink-0 flex items-center justify-center mt-0.5">
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <h3 className="text-[15px] font-bold text-[#0e1b1a]">Verification Rejected</h3>
                                        <p className="text-[13px] text-[#64748B] leading-relaxed">
                                            We couldn't verify your account with the provided documents. Please ensure clear visibility and valid documents, then resubmit.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Upload Section - Hidden if verified or pending */}
                            {(status === "UNVERIFIED" || status === "REJECTED") && (
                                <div className="flex flex-col gap-6 md:gap-7">

                                    {/* Company Flow */}
                                    {accountType === "COMPANY" && (
                                        <>
                                            <FileUploadInput
                                                label="Personal / HR Documents"
                                                value={personalDocType}
                                                setValue={setPersonalDocType}
                                                file={personalDocFile}
                                                setFile={setPersonalDocFile}
                                                options={[
                                                    { label: "Visiting Card", icon: <Briefcase className="w-5 h-5" /> },
                                                    { label: "Personal Aadhar", icon: <UserRound className="w-5 h-5" /> },
                                                    { label: "Personal PAN Card", icon: <CreditCard className="w-5 h-5" /> },
                                                    { label: "Employee ID Card", icon: <BadgePercent className="w-5 h-5" /> },
                                                    { label: "DigiLocker Aadhaar", icon: <ShieldCheck className="w-5 h-5" /> },
                                                    { label: "Other", icon: <FileText className="w-5 h-5" /> }
                                                ]}
                                            />
                                            <FileUploadInput
                                                label="Select company document"
                                                value={companyDocType}
                                                setValue={setCompanyDocType}
                                                file={companyDocFile}
                                                setFile={setCompanyDocFile}
                                                requiredText="Select any one"
                                                options={[
                                                    { label: "Company GST Certificate", icon: <Landmark className="w-5 h-5" /> },
                                                    { label: "Company PAN Card", icon: <CreditCard className="w-5 h-5" /> },
                                                    { label: "FSSAI", icon: <Stamp className="w-5 h-5" /> },
                                                    { label: "Certificate of Incorporation", icon: <Building2 className="w-5 h-5" /> },
                                                    { label: "Gumasta / Shop Act License", icon: <ScrollText className="w-5 h-5" /> },
                                                    { label: "Other", icon: <FileText className="w-5 h-5" /> }
                                                ]}
                                            />
                                        </>
                                    )}

                                    {/* Individual Proprietor Flow */}
                                    {accountType === "INDIVIDUAL" && (
                                        <div className="flex flex-col gap-5">
                                            <label className="flex items-start gap-3 p-4 bg-white border border-[#E2E8F0] rounded-xl cursor-default">
                                                <div className="w-[18px] h-[18px] lg:w-5 lg:h-5 rounded-[4px] bg-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[14px] font-semibold text-[#0e1b1a]">I'm hiring for another company</span>
                                                    <span className="text-[12px] text-[#64748B] mt-0.5">As an individual, submit documents detailing your client contract.</span>
                                                </div>
                                            </label>

                                            <FileUploadInput
                                                label="Temp Staffing Documents"
                                                value={tempStaffingDocType}
                                                setValue={setTempStaffingDocType}
                                                file={tempStaffingDocFile}
                                                setFile={setTempStaffingDocFile}
                                                options={[
                                                    { label: "Contractual Agreement With Client", icon: <Handshake className="w-5 h-5" /> },
                                                    { label: "Offer Letter", icon: <ScrollText className="w-5 h-5" /> },
                                                    { label: "Invoice For Hiring", icon: <CreditCard className="w-5 h-5" /> },
                                                    { label: "Other", icon: <FileText className="w-5 h-5" /> }
                                                ]}
                                            />
                                        </div>
                                    )}

                                    {error && (
                                        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                                            {error}
                                        </p>
                                    )}

                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className={`w-full h-12 rounded-xl text-[15px] font-bold transition-all flex items-center justify-center gap-2
                                ${isSubmitting
                                                ? "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"
                                                : "bg-[#0f766d] hover:bg-[#0d635c] text-white shadow-lg shadow-[#0f766d]/20 active:scale-[0.98]"
                                            }`}
                                    >
                                        {isSubmitting ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                                        ) : (
                                            "Submit Documents"
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="w-full bg-white border-t border-[#E2E8F0] pb-16 md:pb-0 z-10">
                <EmployerFooter />
            </div>

            {/* Mobile Bottom Nav */}
            <MobileBottomNav activePage="Verification" />
        </div>
    );
}
