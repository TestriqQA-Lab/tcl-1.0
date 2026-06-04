"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { getFullEmployerProfile, updateEmployerProfileAction } from "@/actions/employer.actions";
import { Camera, X, Loader2, Check, Building2, User, Globe, MapPin, ChevronDown } from "lucide-react";

export default function EmployerProfileContent() {
    const { data: session } = useSession();
    const userId = session?.user?.id;

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form fields
    const [fullName, setFullName] = useState("");
    const [designation, setDesignation] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [companyIndustry, setCompanyIndustry] = useState("");
    const [companySize, setCompanySize] = useState("");
    const [companyLocation, setCompanyLocation] = useState("");
    const [companyAddress, setCompanyAddress] = useState("");
    const [pincode, setPincode] = useState("");
    const [companyWebsite, setCompanyWebsite] = useState("");
    const [companyDescription, setCompanyDescription] = useState("");
    const [companyLogo, setCompanyLogo] = useState("");
    const [logoPreview, setLogoPreview] = useState("");

    const logoInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!userId) return;
        getFullEmployerProfile(userId).then((profile) => {
            if (profile) {
                setFullName(profile.fullName || "");
                setDesignation(profile.designation || "");
                setEmail(profile.email || "");
                setPhone(profile.phoneNumber || "");
                setCompanyName(profile.companyName || "");
                setCompanyIndustry(profile.companyIndustry || "");
                setCompanySize(profile.companySize || "");
                setCompanyLocation(profile.companyLocation || "");
                setCompanyAddress(profile.companyAddress || "");
                setPincode(profile.pincode || "");
                setCompanyWebsite(profile.companyWebsite || "");
                setCompanyDescription(profile.companyDescription || "");
                setCompanyLogo(profile.companyLogo || "");
                setLogoPreview(profile.companyLogo || "");
            }
            setIsLoading(false);
        });
    }, [userId]);

    const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert("Logo must be less than 2MB");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setLogoPreview(base64);
            setCompanyLogo(base64);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveLogo = () => {
        setLogoPreview("");
        setCompanyLogo("");
        if (logoInputRef.current) logoInputRef.current.value = "";
    };

    const handleSave = async () => {
        if (!userId || isSaving) return;
        setIsSaving(true);
        setError(null);
        setSaved(false);

        const result = await updateEmployerProfileAction(userId, {
            fullName,
            designation,
            companyName,
            companyIndustry,
            companySize,
            companyLocation,
            companyAddress,
            pincode,
            companyWebsite,
            companyDescription,
            companyLogo,
        });

        setIsSaving(false);
        if (result.error) {
            setError(result.error);
        } else {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
    };

    const inputClass = "w-full h-10 md:h-11 rounded-xl border-[1.5px] border-[#E2E8F0] bg-white px-3.5 text-[13px] md:text-sm text-[#0e1b1a] placeholder:text-[#A1A1AA] font-inter outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d]/20 transition-all";
    const selectClass = "w-full h-10 md:h-11 rounded-xl border-[1.5px] border-[#E2E8F0] bg-white px-3.5 text-[13px] md:text-sm text-[#0e1b1a] font-inter outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d]/20 transition-all appearance-none cursor-pointer";
    const labelClass = "text-[11px] md:text-xs font-semibold text-[#475569] font-inter uppercase tracking-wide";

    const initials = (companyName || fullName || "E")
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    if (isLoading) {
        return (
            <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-8">
                <Loader2 className="w-8 h-8 text-[#0f766d] animate-spin mb-3" />
                <p className="text-[#64748B] text-sm font-medium">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-full bg-[#F8FAFB] p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
            <div className="max-w-[800px] mx-auto flex flex-col gap-5 md:gap-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <h1 className="text-xl md:text-[22px] lg:text-2xl font-bold text-[#0e1b1a] font-inter">Company Profile</h1>
                        <p className="text-xs md:text-sm text-[#64748B] font-inter mt-0.5">Manage your company information and branding</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`flex items-center justify-center gap-2 h-10 md:h-11 px-6 md:px-8 rounded-xl text-sm font-semibold font-inter transition-all active:scale-[0.97] ${
                            saved
                                ? "bg-[#10b981] text-white"
                                : "bg-[#0f766d] text-white hover:bg-[#0d635c] shadow-lg shadow-[#0f766d]/20"
                        } disabled:opacity-60`}
                    >
                        {isSaving ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                        ) : saved ? (
                            <><Check className="w-4 h-4" /> Saved!</>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 font-inter">
                        {error}
                    </div>
                )}

                {/* ── Logo Section ── */}
                <section className="bg-white rounded-2xl border border-[#E8ECF0] p-5 md:p-7 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                        <div className="relative group">
                            {logoPreview ? (
                                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-2 ring-[#E2E8F0] shadow-sm bg-white">
                                    <img src={logoPreview} alt="Company logo" className="w-full h-full object-contain p-3" />
                                    <button
                                        type="button"
                                        onClick={handleRemoveLogo}
                                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5 text-white" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => logoInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/0 hover:bg-black/30 flex items-center justify-center transition-all opacity-0 hover:opacity-100"
                                    >
                                        <Camera className="w-6 h-6 text-white" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => logoInputRef.current?.click()}
                                    className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFB] flex flex-col items-center justify-center gap-1.5 hover:border-[#0f766d] hover:bg-[#f0fdf4] transition-all cursor-pointer"
                                >
                                    <Camera className="w-6 h-6 text-[#94A3B8]" />
                                    <span className="text-[10px] text-[#94A3B8] font-semibold">Upload Logo</span>
                                </button>
                            )}
                            <input
                                ref={logoInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleLogoSelect}
                                className="hidden"
                            />
                        </div>
                        <div className="flex flex-col text-center sm:text-left gap-1">
                            <h2 className="text-lg md:text-xl font-bold text-[#0e1b1a] font-inter">{companyName || "Your Company"}</h2>
                            <p className="text-xs md:text-sm text-[#64748B] font-inter">{companyIndustry || "Industry not set"}</p>
                            <p className="text-[10px] text-[#94A3B8] font-inter mt-1">PNG, JPG or WEBP. Max 2MB.</p>
                        </div>
                    </div>
                </section>

                {/* ── Personal Details ── */}
                <section className="bg-white rounded-2xl border border-[#E8ECF0] p-5 md:p-7 shadow-sm flex flex-col gap-4 md:gap-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                            <User className="w-4 h-4 text-[#2563EB]" />
                        </div>
                        <h3 className="text-[15px] md:text-base font-bold text-[#0e1b1a] font-inter">Personal Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className={labelClass}>Full Name</label>
                            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" className={inputClass} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className={labelClass}>Designation</label>
                            <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="e.g. HR Manager" className={inputClass} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className={labelClass}>Email</label>
                            <input type="email" value={email} readOnly className={`${inputClass} bg-[#F8FAFB] text-[#64748B] cursor-not-allowed`} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className={labelClass}>Phone</label>
                            <input type="tel" value={phone} readOnly className={`${inputClass} bg-[#F8FAFB] text-[#64748B] cursor-not-allowed`} />
                        </div>
                    </div>
                </section>

                {/* ── Company Details ── */}
                <section className="bg-white rounded-2xl border border-[#E8ECF0] p-5 md:p-7 shadow-sm flex flex-col gap-4 md:gap-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-[#059669]" />
                        </div>
                        <h3 className="text-[15px] md:text-base font-bold text-[#0e1b1a] font-inter">Company Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className={labelClass}>Company Name</label>
                            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Enter company name" className={inputClass} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className={labelClass}>Industry</label>
                            <div className="relative">
                                <select value={companyIndustry} onChange={(e) => setCompanyIndustry(e.target.value)} className={selectClass}>
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
                        <div className="flex flex-col gap-1.5">
                            <label className={labelClass}>Company Size</label>
                            <div className="relative">
                                <select value={companySize} onChange={(e) => setCompanySize(e.target.value)} className={selectClass}>
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
                        <div className="flex flex-col gap-1.5">
                            <label className={labelClass}>Website</label>
                            <input type="url" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} placeholder="https://example.com" className={inputClass} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className={labelClass}>Company Description</label>
                        <textarea
                            value={companyDescription}
                            onChange={(e) => setCompanyDescription(e.target.value)}
                            placeholder="Tell candidates about your company, culture, and mission..."
                            rows={4}
                            className="w-full rounded-xl border-[1.5px] border-[#E2E8F0] bg-white px-3.5 py-2.5 text-[13px] md:text-sm text-[#0e1b1a] placeholder:text-[#A1A1AA] font-inter outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d]/20 transition-all resize-none"
                        />
                    </div>
                </section>

                {/* ── Location ── */}
                <section className="bg-white rounded-2xl border border-[#E8ECF0] p-5 md:p-7 shadow-sm flex flex-col gap-4 md:gap-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#FFF7ED] flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-[#EA580C]" />
                        </div>
                        <h3 className="text-[15px] md:text-base font-bold text-[#0e1b1a] font-inter">Location</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className={labelClass}>City / Location</label>
                            <input type="text" value={companyLocation} onChange={(e) => setCompanyLocation(e.target.value)} placeholder="e.g. Mumbai" className={inputClass} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className={labelClass}>Pin Code</label>
                            <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Enter pincode" className={inputClass} />
                        </div>
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className={labelClass}>Full Address</label>
                            <textarea
                                value={companyAddress}
                                onChange={(e) => setCompanyAddress(e.target.value)}
                                placeholder="Company street address"
                                rows={2}
                                className="w-full rounded-xl border-[1.5px] border-[#E2E8F0] bg-white px-3.5 py-2.5 text-[13px] md:text-sm text-[#0e1b1a] placeholder:text-[#A1A1AA] font-inter outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d]/20 transition-all resize-none"
                            />
                        </div>
                    </div>
                </section>

                {/* Bottom Save Button (mobile) */}
                <div className="md:hidden">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`w-full flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold font-inter transition-all active:scale-[0.97] ${
                            saved
                                ? "bg-[#10b981] text-white"
                                : "bg-[#0f766d] text-white hover:bg-[#0d635c] shadow-lg shadow-[#0f766d]/20"
                        } disabled:opacity-60`}
                    >
                        {isSaving ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                        ) : saved ? (
                            <><Check className="w-4 h-4" /> Saved!</>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
