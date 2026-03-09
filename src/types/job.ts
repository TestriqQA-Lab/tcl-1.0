export interface CreateJobPayload {
    title: string;
    workExperienceMin: number | null;
    workExperienceMax: number | null;
    monthlySalaryMin: number | null;
    monthlySalaryMax: number | null;
    perksAndBenefits: string[];

    candidateLocationRequirement: string;
    candidateEducationLevel: string;
    requiredSkills: string[];
    preferredCandidateGender: "ANY" | "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY" | string;

    screeningExperienceMin: number | null;
    screeningEducationLevel: string;
    screeningEnglishLevel: string;

    description: string;
    aboutCompany: string;

    allowCalls: boolean;
    recruiterName: string;
    recruiterContact: string;
    callTimeFrom: string;
    callTimeTo: string;
    callDays: string;

    location: string;
}
