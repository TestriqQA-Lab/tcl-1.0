"use client";

import React from 'react';
import { SectionCard } from '../SectionCard';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { FileUpload } from '../FileUpload';
import { User, Mail, Lock, Phone, Eye, EyeOff, HelpCircle } from 'lucide-react';
import { BasicAccountData } from '@/lib/profileTypes';

interface BasicAccountSectionProps {
    data: BasicAccountData;
    onChange: (data: BasicAccountData) => void;
    isComplete?: boolean;
}

const countryCodes = [
    { value: '+1', label: '+1 (US)' },
    { value: '+44', label: '+44 (UK)' },
    { value: '+91', label: '+91 (IN)' },
    { value: '+61', label: '+61 (AU)' },
];

export const BasicAccountSection: React.FC<BasicAccountSectionProps> = ({
    data,
    onChange,
    isComplete = false,
}) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <SectionCard
            title="Basic Account Information"
            subtitle="Essential details for your account setup"
            isComplete={isComplete}
        >
            <div className="space-y-5">
                {/* Full Name */}
                <FormInput
                    label="Full Name"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={data.fullName}
                    onChange={(e) => onChange({ ...data, fullName: e.target.value })}
                    leftIcon={User}
                    required
                />

                {/* Email */}
                <FormInput
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={data.email}
                    onChange={(e) => onChange({ ...data, email: e.target.value })}
                    leftIcon={Mail}
                    required
                    helperText="Your email will be used for login and notifications"
                />

                {/* Password */}
                <div className="relative">
                    <FormInput
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        value={data.password}
                        onChange={(e) => onChange({ ...data, password: e.target.value })}
                        leftIcon={Lock}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-9 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>

                {/* Phone Number with Country Code */}
                <div>
                    <label className="block text-sm font-semibold mb-1.5 text-slate-700">
                        Phone Number <span className="text-primary">*</span>
                    </label>
                    <div className="flex gap-3">
                        <div className="w-32">
                            <FormSelect
                                label=""
                                name="countryCode"
                                options={countryCodes}
                                value={data.countryCode}
                                onChange={(e) => onChange({ ...data, countryCode: e.target.value })}
                            />
                        </div>
                        <div className="flex-1">
                            <FormInput
                                label=""
                                name="phone"
                                type="tel"
                                placeholder="1234567890"
                                value={data.phone}
                                onChange={(e) => onChange({ ...data, phone: e.target.value })}
                                leftIcon={Phone}
                            />
                        </div>
                    </div>
                </div>

                {/* Profile Photo */}
                <FileUpload
                    label="Profile Photo"
                    accept="image/*"
                    maxSize={5}
                    currentFile={data.profilePhoto}
                    onFileSelect={(file) => onChange({ ...data, profilePhoto: file })}
                    showPreview
                    helperText="JPG, PNG up to 5MB"
                />

                {/* Account Visibility */}
                <div>
                    <label className="block text-sm font-semibold mb-1.5 text-slate-700 flex items-center gap-2">
                        Profile Visibility <span className="text-primary">*</span>
                        <div className="group relative">
                            <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
                            <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                <strong>Public:</strong> Your profile is visible to all recruiters
                                <br />
                                <strong>Private:</strong> Only you can see your profile
                            </div>
                        </div>
                    </label>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => onChange({ ...data, visibility: 'public' })}
                            className={`flex-1 py-3 px-4 rounded-2xl border-2 font-semibold text-sm transition-all ${data.visibility === 'public'
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-primary/30'
                                }`}
                        >
                            🌐 Public
                        </button>
                        <button
                            type="button"
                            onClick={() => onChange({ ...data, visibility: 'private' })}
                            className={`flex-1 py-3 px-4 rounded-2xl border-2 font-semibold text-sm transition-all ${data.visibility === 'private'
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-primary/30'
                                }`}
                        >
                            🔒 Private
                        </button>
                    </div>
                </div>

                {/* Security Message */}
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-2xl">
                    <p className="text-sm text-green-800 flex items-start gap-2">
                        <span className="text-lg">🔐</span>
                        <span>Your information is encrypted and secure. We never share your data without your consent.</span>
                    </p>
                </div>
            </div>
        </SectionCard>
    );
};
