// Wizard configuration with step definitions
export interface WizardStep {
    id: number;
    key: string;
    title: string;
    subtitle: string;
    icon: string;
    isOptional?: boolean;
    requiredFields: string[];
}

export const WIZARD_STEPS: WizardStep[] = [
    {
        id: 1,
        key: 'account',
        title: 'Basic Account',
        subtitle: 'Create your profile foundation',
        icon: '👤',
        requiredFields: ['fullName', 'email', 'password', 'phone'],
    },
    {
        id: 2,
        key: 'personal',
        title: 'Personal Details',
        subtitle: 'Tell us about yourself',
        icon: '📝',
        requiredFields: ['dateOfBirth', 'currentLocation'],
    },
    {
        id: 3,
        key: 'professional',
        title: 'Professional Status',
        subtitle: 'Your career stage',
        icon: '💼',
        requiredFields: ['workStatus', 'lookingFor', 'employmentStatus'],
    },
    {
        id: 4,
        key: 'education',
        title: 'Education',
        subtitle: 'Academic background',
        icon: '🎓',
        requiredFields: ['highestQualification', 'degree', 'university'],
    },
    {
        id: 5,
        key: 'skills',
        title: 'Skills & Expertise',
        subtitle: 'What you bring to the table',
        icon: '⚡',
        requiredFields: ['keySkills'],
    },
    {
        id: 6,
        key: 'experience',
        title: 'Work Experience',
        subtitle: 'Your professional journey',
        icon: '🚀',
        isOptional: true,
        requiredFields: [],
    },
    {
        id: 7,
        key: 'projects',
        title: 'Projects',
        subtitle: 'Showcase your work',
        icon: '💻',
        isOptional: true,
        requiredFields: [],
    },
    {
        id: 8,
        key: 'summary',
        title: 'Profile Summary',
        subtitle: 'Introduce yourself',
        icon: '✍️',
        requiredFields: ['summary'],
    },
    {
        id: 9,
        key: 'achievements',
        title: 'Achievements',
        subtitle: 'Your accomplishments',
        icon: '🏆',
        isOptional: true,
        requiredFields: [],
    },
    {
        id: 10,
        key: 'resume',
        title: 'Resume & Links',
        subtitle: 'Professional presence',
        icon: '📄',
        requiredFields: ['resume'],
    },
    {
        id: 11,
        key: 'preferences',
        title: 'Preferences',
        subtitle: 'Job preferences',
        icon: '🎯',
        requiredFields: ['salaryRange', 'preferredIndustries'],
    },
    {
        id: 12,
        key: 'verification',
        title: 'Verification',
        subtitle: 'Final step',
        icon: '✅',
        requiredFields: ['consentToShare', 'termsAccepted'],
    },
];

export const getTotalSteps = () => WIZARD_STEPS.length;
export const getStepByKey = (key: string) => WIZARD_STEPS.find((step) => step.key === key);
export const getStepById = (id: number) => WIZARD_STEPS.find((step) => step.id === id);
