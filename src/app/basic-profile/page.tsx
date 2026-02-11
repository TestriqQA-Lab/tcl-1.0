"use client";

import React, { useState } from "react";
import {
    ChevronDown,
    MapPin,
    ArrowRight,
    Check,
    Lock,
    ShieldCheck,
    CircleHelp,
    Briefcase,
    GraduationCap,
    Search
} from "lucide-react";
import Link from "next/link";

export default function BasicProfilePage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        phone: '',
        location: '',
        workStatus: '',
        jobTitle: '',
        resume: null as File | null
    });

    const handleNext = () => {
        if (step === 1) setStep(2);
    };

    const handleBack = () => {
        if (step === 2) setStep(1);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background-light)] text-[var(--foreground)] font-sans">
            <div className="max-w-2xl w-full">
                {/* Main Card */}
                <div className="bg-white rounded-[1.5rem] shadow-xl overflow-hidden flex flex-col">
                    {/* Form Content */}
                    <div className="flex-1 p-8 relative">
                        {/* Stepper */}
                        <div className="mb-8">
                            <div className="flex items-center justify-center space-x-4 mb-4">
                                <div className="flex items-center cursor-pointer" onClick={() => step > 1 && setStep(1)}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 1 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        1
                                    </div>
                                    <span className={`ml-3 font-semibold transition-colors ${step >= 1 ? 'text-primary' : 'text-slate-400'}`}>
                                        Basic Profile
                                    </span>
                                </div>
                                <div className={`h-px w-12 transition-colors ${step >= 2 ? 'bg-primary' : 'bg-slate-200'}`}></div>
                                <div className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 2 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        2
                                    </div>
                                    <span className={`ml-3 font-semibold transition-colors ${step >= 2 ? 'text-primary' : 'text-slate-400'}`}>
                                        Resume Upload
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Header */}
                        <header className="mb-6 text-center">
                            <h1 className="text-3xl font-bold text-slate-900 mb-2 font-[family-name:var(--font-sora)]">
                                Let's complete your basic profile
                            </h1>
                            <p className="text-slate-500 text-base">
                                Tell us a bit about yourself to get better job matches.
                            </p>
                        </header>

                        {/* Form Steps */}
                        <div className="space-y-5 min-h-[250px]">
                            {step === 1 ? (
                                <>
                                    {/* Phone Number */}
                                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                        <label className="block text-sm font-semibold mb-1.5 text-slate-700">
                                            Phone Number
                                        </label>
                                        <div className="flex">
                                            <div className="relative">
                                                <select className="appearance-none bg-slate-50 border border-slate-200 rounded-l-2xl py-2.5 pl-4 pr-10 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-full cursor-pointer text-sm">
                                                    <option>+1 (US)</option>
                                                    <option>+44 (UK)</option>
                                                    <option>+91 (IN)</option>
                                                    <option>+61 (AU)</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                                    <ChevronDown className="text-slate-400 w-4 h-4" />
                                                </div>
                                            </div>
                                            <input
                                                className="w-full bg-slate-50 border border-l-0 border-slate-200 rounded-r-2xl py-2.5 px-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                                placeholder="555-0123"
                                                type="tel"
                                                defaultValue={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="animate-in fade-in slide-in-from-right-4 duration-300 delay-75">
                                        <label className="block text-sm font-semibold mb-1.5 text-slate-700">
                                            Location
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <input
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-12 pr-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                                placeholder="Search your city"
                                                type="text"
                                                defaultValue={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Work Status */}
                                    <div className="animate-in fade-in slide-in-from-right-4 duration-300 delay-150">
                                        <label className="block text-sm font-semibold mb-1.5 text-slate-700">
                                            Work Status
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {[
                                                { id: 'employed', label: 'Employed', icon: Briefcase },
                                                { id: 'unemployed', label: 'Unemployed', icon: Search },
                                                { id: 'student', label: 'Student', icon: GraduationCap },
                                            ].map((status) => (
                                                <div
                                                    key={status.id}
                                                    onClick={() => setFormData({ ...formData, workStatus: status.id })}
                                                    className={`cursor-pointer rounded-2xl p-3 flex flex-col items-center justify-center border-2 transition-all duration-200 hover:shadow-md ${formData.workStatus === status.id
                                                        ? 'border-primary bg-primary/5 text-primary'
                                                        : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-primary/30 hover:bg-white'
                                                        }`}
                                                >
                                                    <status.icon className={`w-6 h-6 mb-2 ${formData.workStatus === status.id ? 'text-primary' : 'text-slate-400'}`} />
                                                    <span className="font-semibold text-xs">{status.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Job Title */}
                                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                        <label className="block text-sm font-semibold mb-1.5 text-slate-700">
                                            What job are you looking for?
                                        </label>
                                        <input
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                            placeholder="e.g. Software Engineer, Designer..."
                                            type="text"
                                            defaultValue={formData.jobTitle}
                                            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                        />
                                    </div>

                                    {/* Resume Upload */}
                                    <div className="animate-in fade-in slide-in-from-right-4 duration-300 delay-75">
                                        <label className="block text-sm font-semibold mb-1.5 text-slate-700">
                                            Resume/CV
                                        </label>
                                        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
                                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-white transition-colors">
                                                <Check className="text-slate-400 w-5 h-5 group-hover:text-primary" />
                                            </div>
                                            <p className="text-sm font-medium text-slate-700 mb-0.5">
                                                Cloud upload or drag & drop
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                PDF, DOCX up to 10MB
                                            </p>
                                            <input type="file" className="hidden" />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="mt-8 flex items-center justify-between w-full gap-4">
                            {step === 1 ? (
                                <Link
                                    className="text-slate-500 hover:text-slate-700 font-medium transition-colors cursor-pointer text-sm"
                                    href="#"
                                >
                                    Skip for now
                                </Link>
                            ) : (
                                <button
                                    onClick={handleBack}
                                    className="text-slate-500 hover:text-slate-700 font-medium transition-colors cursor-pointer flex items-center text-sm"
                                >
                                    Back
                                </button>
                            )}

                            <button
                                onClick={handleNext}
                                className="bg-primary hover:opacity-90 text-white font-bold py-2.5 md:px-8 px-4 rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center group cursor-pointer text-sm"
                            >
                                {step === 1 ? 'Next Step' : 'Save & continue'}
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Support Info */}
                <div className="mt-6 flex justify-center items-center space-x-6 text-slate-400 text-xs">
                    <div className="flex items-center hover:text-primary transition-colors cursor-pointer">
                        <ShieldCheck className="w-4 h-4 mr-1.5" />
                        Secure & Confidential
                    </div>
                    <div className="flex items-center hover:text-primary transition-colors cursor-pointer">
                        <CircleHelp className="w-4 h-4 mr-1.5" />
                        Need help? Contact support
                    </div>
                </div>
            </div>
        </div>
    );
}
