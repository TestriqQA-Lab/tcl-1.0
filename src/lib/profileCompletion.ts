/**
 * Calculates profile completion percentage based on 12 key sections:
 *  - Career preferences     (8%)
 *  - Education             (9%)
 *  - Key skills            (9%)
 *  - Languages             (8%)
 *  - Internships           (8%)
 *  - Projects              (8%)
 *  - Profile Summary       (9%)
 *  - Accomplishments       (8%)  (Certifications, Awards, Club & committees)
 *  - Competitive Exams     (8%)
 *  - Employment            (9%)
 *  - Academic Achievements (8%)
 *  - Resume                (8%)
 */

interface ProfileCompletionInput {
    profile: {
        bio?: string | null;                     // Profile Summary
        resumeUrl?: string | null;               // Resume
        expectedSalaryMin?: number | null;       // Career Preferences
        preferredWorkLocation?: string[] | null; // Career Preferences
    } | null;
    educationCount: number;
    skillsCount: number;
    languagesCount: number;
    internshipsCount: number;
    projectsCount: number;
    accomplishmentsCount: number;
    competitiveExamsCount: number;
    employmentCount: number;
    academicAchievementsCount: number;
}

interface ProfileCompletionResult {
    percentage: number;
    nextTip: string;
    sections: { label: string; done: boolean; weight: number }[];
}

export function calculateProfileCompletion(
    input: ProfileCompletionInput
): ProfileCompletionResult {
    const {
        profile,
        educationCount,
        skillsCount,
        languagesCount,
        internshipsCount,
        projectsCount,
        accomplishmentsCount,
        competitiveExamsCount,
        employmentCount,
        academicAchievementsCount
    } = input;

    const sections = [
        {
            label: "Career Preferences",
            done: !!(profile?.expectedSalaryMin || (profile?.preferredWorkLocation && profile.preferredWorkLocation.length > 0)),
            weight: 8,
        },
        {
            label: "Education",
            done: educationCount >= 1,
            weight: 9,
        },
        {
            label: "Key Skills",
            done: skillsCount >= 3,
            weight: 9,
        },
        {
            label: "Languages",
            done: languagesCount >= 1,
            weight: 8,
        },
        {
            label: "Internships",
            done: internshipsCount >= 1,
            weight: 8,
        },
        {
            label: "Projects",
            done: projectsCount >= 1,
            weight: 8,
        },
        {
            label: "Profile Summary",
            done: !!(profile?.bio && profile.bio.trim().length > 0),
            weight: 9,
        },
        {
            label: "Accomplishments",
            done: accomplishmentsCount >= 1,
            weight: 8,
        },
        {
            label: "Competitive Exams",
            done: competitiveExamsCount >= 1,
            weight: 8,
        },
        {
            label: "Employment",
            done: employmentCount >= 1,
            weight: 9,
        },
        {
            label: "Academic Achievements",
            done: academicAchievementsCount >= 1,
            weight: 8,
        },
        {
            label: "Resume",
            done: !!(profile?.resumeUrl && profile.resumeUrl.length > 0),
            weight: 8,
        },
    ];

    // Calculate total percentage (Max 100)
    const percentage = Math.min(100, sections.reduce((sum, s) => (s.done ? sum + s.weight : sum), 0));

    // Find the first incomplete section for the tip
    const firstIncomplete = sections.find((s) => !s.done);
    const nextTip = firstIncomplete
        ? `Add your ${firstIncomplete.label.toLowerCase()} to reach ${Math.min(100, percentage + firstIncomplete.weight)}%`
        : "Your profile is 100% complete! 🎉";

    return { percentage, nextTip, sections };
}
