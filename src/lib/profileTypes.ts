// Profile Data Types

export interface Tag {
    id: string;
    label: string;
    level?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface BasicAccountData {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    countryCode: string;
    profilePhoto: File | null;
    visibility: 'public' | 'private';
}

export interface PersonalDetailsData {
    gender?: string;
    dateOfBirth: string;
    age?: number;
    currentLocation: string;
    preferredLocations: string[];
    nationality?: string;
    willingToRelocate: boolean;
}

export interface ProfessionalStatusData {
    workStatus: 'fresher' | 'experienced';
    lookingFor: string[];
    employmentStatus: string;
    availability: string;
    preferredWorkTypes: string[];
    preferredModes: string[];
}

export interface EducationData {
    highestQualification: string;
    degree: string;
    course: string;
    specialization: string;
    university: string;
    startYear: string;
    endYear: string;
    classX: {
        board: string;
        school: string;
        year: string;
        score: string;
    };
    classXII: {
        board: string;
        stream: string;
        school: string;
        year: string;
        score: string;
    };
}

export interface SkillsData {
    keySkills: Tag[];
    technicalSkills: Tag[];
    tools: Tag[];
    languages: {
        language: string;
        read: boolean;
        write: boolean;
        speak: boolean;
    }[];
}

export interface WorkExperience {
    id: string;
    organization: string;
    jobTitle: string;
    employmentType: string;
    startDate: string;
    endDate?: string;
    currentlyWorking: boolean;
    responsibilities: string[];
    industry?: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    role: string;
    githubUrl?: string;
    liveUrl?: string;
    duration: string;
}

export interface ProfileSummaryData {
    summary: string;
}

export interface Achievement {
    id: string;
    type: 'certification' | 'award' | 'academic' | 'hackathon';
    title: string;
    organization?: string;
    date?: string;
    description?: string;
}

export interface ResumeLinksData {
    resume: File | null;
    portfolioUrl?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    otherLinks: { id: string; label: string; url: string }[];
}

export interface PreferencesData {
    salaryRange: [number, number];
    preferredIndustries: string[];
    companyTypes: string[];
    shiftPreference: string;
}

export interface VerificationData {
    emailVerified: boolean;
    phoneVerified: boolean;
    consentToShare: boolean;
    termsAccepted: boolean;
}

export interface ProfileData {
    basicAccount: BasicAccountData;
    personalDetails: PersonalDetailsData;
    professionalStatus: ProfessionalStatusData;
    education: EducationData;
    skills: SkillsData;
    workExperience: WorkExperience[];
    projects: Project[];
    profileSummary: ProfileSummaryData;
    achievements: Achievement[];
    resumeLinks: ResumeLinksData;
    preferences: PreferencesData;
    verification: VerificationData;
}

export interface SectionStatus {
    basicAccount: boolean;
    personalDetails: boolean;
    professionalStatus: boolean;
    education: boolean;
    skills: boolean;
    workExperience: boolean;
    projects: boolean;
    profileSummary: boolean;
    achievements: boolean;
    resumeLinks: boolean;
    preferences: boolean;
    verification: boolean;
}
