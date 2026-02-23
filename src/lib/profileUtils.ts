import { ProfileData, SectionStatus } from './profileTypes';

/**
 * Calculate profile completion percentage based on filled fields
 */
export const calculateProfileCompletion = (data: Partial<ProfileData>): number => {
    let totalFields = 0;
    let filledFields = 0;

    // Basic Account (weight: 15%)
    const basicAccount = data.basicAccount;
    if (basicAccount) {
        totalFields += 6;
        if (basicAccount.fullName) filledFields++;
        if (basicAccount.email) filledFields++;
        if (basicAccount.password) filledFields++;
        if (basicAccount.phone) filledFields++;
        if (basicAccount.profilePhoto) filledFields++;
        if (basicAccount.visibility) filledFields++;
    } else {
        totalFields += 6;
    }

    // Personal Details (weight: 10%)
    const personal = data.personalDetails;
    if (personal) {
        totalFields += 4;
        if (personal.dateOfBirth) filledFields++;
        if (personal.currentLocation) filledFields++;
        if (personal.preferredLocations && personal.preferredLocations.length > 0) filledFields++;
        filledFields++; // willingToRelocate is boolean
    } else {
        totalFields += 4;
    }

    // Professional Status (weight: 15%)
    const professional = data.professionalStatus;
    if (professional) {
        totalFields += 6;
        if (professional.workStatus) filledFields++;
        if (professional.lookingFor && professional.lookingFor.length > 0) filledFields++;
        if (professional.employmentStatus) filledFields++;
        if (professional.availability) filledFields++;
        if (professional.preferredWorkTypes && professional.preferredWorkTypes.length > 0) filledFields++;
        if (professional.preferredModes && professional.preferredModes.length > 0) filledFields++;
    } else {
        totalFields += 6;
    }

    // Education (weight: 10%)
    const education = data.education;
    if (education) {
        totalFields += 5;
        if (education.degree) filledFields++;
        if (education.course) filledFields++;
        if (education.university) filledFields++;
        if (education.startYear) filledFields++;
        if (education.endYear) filledFields++;
    } else {
        totalFields += 5;
    }

    // Skills (weight: 15%)
    const skills = data.skills;
    if (skills) {
        totalFields += 3;
        if (skills.keySkills && skills.keySkills.length > 0) filledFields++;
        if (skills.technicalSkills && skills.technicalSkills.length > 0) filledFields++;
        if (skills.languages && skills.languages.length > 0) filledFields++;
    } else {
        totalFields += 3;
    }

    // Work Experience (weight: 10% - only if experienced)
    if (data.professionalStatus?.workStatus === 'experienced') {
        totalFields += 2;
        if (data.workExperience && data.workExperience.length > 0) filledFields += 2;
    }

    // Projects (weight: 10%)
    totalFields += 2;
    if (data.projects && data.projects.length > 0) filledFields += 2;

    // Profile Summary (weight: 5%)
    totalFields += 1;
    if (data.profileSummary?.summary) filledFields++;

    // Resume Links (weight: 10%)
    const resume = data.resumeLinks;
    if (resume) {
        totalFields += 2;
        if (resume.resume) filledFields++;
        if (resume.linkedinUrl || resume.githubUrl) filledFields++;
    } else {
        totalFields += 2;
    }

    // Preferences (weight: 5%)
    const preferences = data.preferences;
    if (preferences) {
        totalFields += 2;
        if (preferences.salaryRange) filledFields++;
        if (preferences.preferredIndustries && preferences.preferredIndustries.length > 0) filledFields++;
    } else {
        totalFields += 2;
    }

    // Verification (weight: 5%)
    const verification = data.verification;
    if (verification) {
        totalFields += 2;
        if (verification.termsAccepted) filledFields++;
        if (verification.consentToShare) filledFields++;
    } else {
        totalFields += 2;
    }

    return Math.round((filledFields / totalFields) * 100);
};

/**
 * Get section completion status
 */
export const getSectionStatus = (data: Partial<ProfileData>): SectionStatus => {
    return {
        basicAccount: !!(
            data.basicAccount?.fullName &&
            data.basicAccount?.email &&
            data.basicAccount?.phone
        ),
        personalDetails: !!(
            data.personalDetails?.currentLocation &&
            data.personalDetails?.dateOfBirth
        ),
        professionalStatus: !!(
            data.professionalStatus?.workStatus &&
            data.professionalStatus?.lookingFor &&
            data.professionalStatus?.employmentStatus
        ),
        education: !!(
            data.education?.degree &&
            data.education?.university
        ),
        skills: !!(
            data.skills?.keySkills &&
            data.skills.keySkills.length > 0
        ),
        workExperience: data.professionalStatus?.workStatus === 'experienced'
            ? !!(data.workExperience && data.workExperience.length > 0)
            : true,
        projects: !!(data.projects && data.projects.length > 0),
        profileSummary: !!(data.profileSummary?.summary),
        achievements: !!(data.achievements && data.achievements.length > 0),
        resumeLinks: !!(data.resumeLinks?.resume),
        preferences: !!(
            data.preferences?.salaryRange &&
            data.preferences.preferredIndustries &&
            data.preferences.preferredIndustries.length > 0
        ),
        verification: !!(
            data.verification?.termsAccepted &&
            data.verification?.consentToShare
        ),
    };
};

/**
 * Format salary with currency
 */
export const formatSalary = (amount: number, currency: string = '₹'): string => {
    if (amount >= 10000000) {
        return `${currency}${(amount / 10000000).toFixed(1)}Cr`;
    }
    if (amount >= 100000) {
        return `${currency}${(amount / 100000).toFixed(1)}L`;
    }
    if (amount >= 1000) {
        return `${currency}${(amount / 1000).toFixed(0)}K`;
    }
    return `${currency}${amount}`;
};

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};

/**
 * Validate field
 */
export const validateField = (
    fieldName: string,
    value: any,
    required: boolean = false
): string | undefined => {
    if (required && !value) {
        return 'This field is required';
    }

    switch (fieldName) {
        case 'email':
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return 'Please enter a valid email address';
            }
            break;
        case 'phone':
            if (value && !/^\d{10}$/.test(value.replace(/\D/g, ''))) {
                return 'Please enter a valid phone number';
            }
            break;
        case 'url':
            if (value && !/^https?:\/\/.+/.test(value)) {
                return 'Please enter a valid URL starting with http:// or https://';
            }
            break;
    }

    return undefined;
};
