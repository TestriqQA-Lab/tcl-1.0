"use client";

import React from 'react';
import { ProfileWizard, WizardChildProps } from '@/components/profile/wizard/ProfileWizard';
import { Step1Account } from '@/components/profile/wizard/steps/Step1Account';
import { Step2Personal } from '@/components/profile/wizard/steps/Step2Personal';
import { Step3Professional } from '@/components/profile/wizard/steps/Step3Professional';
import { Step5Skills } from '@/components/profile/wizard/steps/Step5Skills';
import { EducationSection } from '@/components/profile/sections/EducationSection';
import { WorkExperienceSection } from '@/components/profile/sections/WorkExperienceSection';
import { ProjectsSection } from '@/components/profile/sections/ProjectsSection';
import { ProfileSummarySection } from '@/components/profile/sections/ProfileSummarySection';
import { AchievementsSection } from '@/components/profile/sections/AchievementsSection';
import { ResumeLinksSection } from '@/components/profile/sections/ResumeLinksSection';
import { PreferencesSection } from '@/components/profile/sections/PreferencesSection';
import { VerificationSection } from '@/components/profile/sections/VerificationSection';

export default function DetailedSeekerProfilePage() {
    const handleComplete = (profileData: any) => {
        console.log('Profile completed:', profileData);
        // TODO: Submit to backend
        alert('🎉 Profile submitted successfully!');
    };

    return (
        <ProfileWizard onComplete={handleComplete}>
            {({ currentStep, profileData, updateData }: WizardChildProps) => {
                switch (currentStep) {
                    case 1:
                        return <Step1Account currentStep={currentStep} profileData={profileData} updateData={updateData} />;

                    case 2:
                        return <Step2Personal currentStep={currentStep} profileData={profileData} updateData={updateData} />;

                    case 3:
                        return <Step3Professional currentStep={currentStep} profileData={profileData} updateData={updateData} />;

                    case 4:
                        return (
                            <EducationSection
                                data={profileData.education || {
                                    highestQualification: '',
                                    degree: '',
                                    course: '',
                                    specialization: '',
                                    university: '',
                                    startYear: '',
                                    endYear: '',
                                    classX: { board: '', school: '', year: '', score: '' },
                                    classXII: { board: '', stream: '', school: '', year: '', score: '' },
                                }}
                                onChange={(data) => updateData({ education: data })}
                            />
                        );

                    case 5:
                        return <Step5Skills currentStep={currentStep} profileData={profileData} updateData={updateData} />;

                    case 6:
                        return (
                            <WorkExperienceSection
                                data={profileData.workExperience || []}
                                onChange={(data) => updateData({ workExperience: data })}
                            />
                        );

                    case 7:
                        return (
                            <ProjectsSection
                                data={profileData.projects || []}
                                onChange={(data) => updateData({ projects: data })}
                            />
                        );

                    case 8:
                        return (
                            <ProfileSummarySection
                                data={profileData.profileSummary || { summary: '' }}
                                onChange={(data) => updateData({ profileSummary: data })}
                            />
                        );

                    case 9:
                        return (
                            <AchievementsSection
                                data={profileData.achievements || []}
                                onChange={(data) => updateData({ achievements: data })}
                            />
                        );

                    case 10:
                        return (
                            <ResumeLinksSection
                                data={profileData.resumeLinks || {
                                    resume: null,
                                    portfolioUrl: '',
                                    githubUrl: '',
                                    linkedinUrl: '',
                                    otherLinks: [],
                                }}
                                onChange={(data) => updateData({ resumeLinks: data })}
                            />
                        );

                    case 11:
                        return (
                            <PreferencesSection
                                data={profileData.preferences || {
                                    salaryRange: [300000, 1000000],
                                    preferredIndustries: [],
                                    companyTypes: [],
                                    shiftPreference: 'Day Shift',
                                }}
                                onChange={(data) => updateData({ preferences: data })}
                            />
                        );

                    case 12:
                        return (
                            <VerificationSection
                                data={profileData.verification || {
                                    emailVerified: false,
                                    phoneVerified: false,
                                    consentToShare: false,
                                    termsAccepted: false,
                                }}
                                onChange={(data) => updateData({ verification: data })}
                            />
                        );

                    default:
                        return <div>Unknown step</div>;
                }
            }}
        </ProfileWizard>
    );
}
