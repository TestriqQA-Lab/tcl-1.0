"use client";

import React from 'react';
import { SectionCard } from '../SectionCard';
import { VerificationData } from '@/lib/profileTypes';
import { Mail, Phone, ShieldCheck, FileCheck, CheckCircle2, XCircle } from 'lucide-react';

interface VerificationSectionProps {
    data: VerificationData;
    onChange: (data: VerificationData) => void;
    isComplete?: boolean;
}

export const VerificationSection: React.FC<VerificationSectionProps> = ({
    data,
    onChange,
    isComplete = false,
}) => {
    return (
        <SectionCard
            title="Verification & Consent"
            subtitle="Secure and compliant profile activation"
            isComplete={isComplete}
        >
            <div className="space-y-6">
                {/* Email Verification */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-full ${data.emailVerified ? 'bg-green-100' : 'bg-orange-100'}`}>
                                <Mail className={`w-5 h-5 ${data.emailVerified ? 'text-green-600' : 'text-orange-600'}`} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Email Verification</h3>
                                <p className="text-sm text-slate-600">
                                    {data.emailVerified ? 'Your email is verified' : 'Verify your email address'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {data.emailVerified ? (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="text-xs font-semibold">Verified</span>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                                >
                                    Send Code
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Phone Verification */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-full ${data.phoneVerified ? 'bg-green-100' : 'bg-orange-100'}`}>
                                <Phone className={`w-5 h-5 ${data.phoneVerified ? 'text-green-600' : 'text-orange-600'}`} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Phone Verification</h3>
                                <p className="text-sm text-slate-600">
                                    {data.phoneVerified ? 'Your phone is verified' : 'Verify your phone number'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {data.phoneVerified ? (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="text-xs font-semibold">Verified</span>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                                >
                                    Send OTP
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Consent to Share */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-slate-900">Profile Sharing Consent</h3>
                        <span className="text-primary text-xs font-semibold">*Required</span>
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={data.consentToShare}
                            onChange={(e) => onChange({ ...data, consentToShare: e.target.checked })}
                            className="mt-1 w-5 h-5 text-primary rounded focus:ring-primary"
                        />
                        <div>
                            <p className="text-sm font-medium text-slate-900 group-hover:text-primary transition-colors">
                                I consent to share my profile with potential employers
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                                Your profile will be visible to recruiters and hiring managers. You can change this anytime from settings.
                            </p>
                        </div>
                    </label>
                </div>

                {/* Terms & Privacy */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-2xl border border-purple-200">
                    <div className="flex items-center gap-2 mb-3">
                        <FileCheck className="w-5 h-5 text-purple-600" />
                        <h3 className="font-bold text-slate-900">Terms & Privacy</h3>
                        <span className="text-primary text-xs font-semibold">*Required</span>
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={data.termsAccepted}
                            onChange={(e) => onChange({ ...data, termsAccepted: e.target.checked })}
                            className="mt-1 w-5 h-5 text-primary rounded focus:ring-primary"
                        />
                        <div>
                            <p className="text-sm font-medium text-slate-900 group-hover:text-primary transition-colors">
                                I accept the Terms of Service and Privacy Policy
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                                By checking this, you agree to our{' '}
                                <a href="/terms" className="text-primary hover:underline">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="/privacy" className="text-primary hover:underline">
                                    Privacy Policy
                                </a>
                            </p>
                        </div>
                    </label>
                </div>

                {/* Trust Message */}
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-2xl">
                    <p className="text-sm text-green-800 flex items-start gap-2">
                        <span className="text-lg">🔐</span>
                        <span>
                            <strong>Your data is secure.</strong> We use industry-standard encryption and never sell your information to third parties.
                        </span>
                    </p>
                </div>
            </div>
        </SectionCard>
    );
};
