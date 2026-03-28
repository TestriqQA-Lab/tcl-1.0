export type QuestionType = "Single choice" | "Multiple choice" | "Short answer";

export interface CustomQuestion {
    id: string;
    text: string;
    type: QuestionType;
    mandatory: boolean;
    options: string[];
}

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

    customScreeningQuestions?: CustomQuestion[];

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
