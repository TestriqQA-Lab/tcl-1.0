"use client";

import React, { useState, useEffect } from 'react';
import { FormInput } from '@/components/profile/FormInput';
import { FormSelect } from '@/components/profile/FormSelect';
import { FileUpload } from '@/components/profile/FileUpload';
import { SmartSuggest, QuickAddChips } from '@/components/profile/smart/SmartSuggest';
import { WizardChildProps } from '@/components/profile/wizard/ProfileWizard';
import { User, Mail, Phone, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export const Step1Account: React.FC<WizardChildProps> = ({ profileData, updateData }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [emailDomain, setEmailDomain] = useState('');

    const data = profileData.basicAccount || {
        fullName: '',
        email: '',
        password: '',
        phone: '',
        countryCode: '+91',
        profilePhoto: null,
        visibility: 'public',
    };

    // Extract email domain for smart suggestions
    useEffect(() => {
        if (data.email.includes('@')) {
            const domain = data.email.split('@')[1];
            setEmailDomain(domain);
        }
    }, [data.email]);

    const countryCodes = [
        { value: '+1', label: '+1 (US)' },
        { value: '+44', label: '+44 (UK)' },
        { value: '+91', label: '+91 (IN)' },
    ];

    return (
        <div className="space-y-6">
            <FormInput
                label="Full Name"
                name="fullName"
                placeholder="John Doe"
                value={data.fullName}
                onChange={(e) => updateData({ basicAccount: { ...data, fullName: e.target.value } })}
                leftIcon={User}
                required
            />

            <FormInput
                label="Email Address"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                value={data.email}
                onChange={(e) => updateData({ basicAccount: { ...data, email: e.target.value } })}
                leftIcon={Mail}
                required
                helperText="Used for login and notifications"
            />

            {emailDomain && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800"
                >
                    💡 Detected domain: <strong>{emailDomain}</strong>
                </motion.div>
            )}

            <div className="relative">
                <FormInput
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={data.password}
                    onChange={(e) => updateData({ basicAccount: { ...data, password: e.target.value } })}
                    leftIcon={Eye}
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-9 text-slate-400"
                >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>

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
                            onChange={(e) => updateData({ basicAccount: { ...data, countryCode: e.target.value } })}
                        />
                    </div>
                    <FormInput
                        label=""
                        name="phone"
                        type="tel"
                        placeholder="1234567890"
                        value={data.phone}
                        onChange={(e) => updateData({ basicAccount: { ...data, phone: e.target.value } })}
                        leftIcon={Phone}
                    />
                </div>
            </div>

            <FileUpload
                label="Profile Photo"
                accept="image/*"
                maxSize={5}
                currentFile={data.profilePhoto}
                onFileSelect={(file) => updateData({ basicAccount: { ...data, profilePhoto: file } })}
                showPreview
                helperText="JPG, PNG up to 5MB"
            />
        </div>
    );
};
