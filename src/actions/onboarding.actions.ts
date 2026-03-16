"use server";

import { auth } from "@/auth";

export async function updateEmploymentAction(
    userId: string,
    data: {
        // Professional Status
        workStatus: "FRESHER" | "EXPERIENCED";
        lookingFor: "JOB" | "INTERNSHIP" | "BOTH";
        employmentStatus?: "UNEMPLOYED" | "EMPLOYED" | "STUDENT";

        // Experience (if Experienced)
        totalExperienceYears?: number;
        totalExperienceMonths?: number;
        companyName?: string;
        designation?: string;
        currentCity?: string;
        joiningDate?: Date;
        endDate?: Date;
        currentSalary?: number;
        noticePeriod?: string;
        currentIndustry?: string;
        currentDepartment?: string;
        currentRoleCategory?: string;
        currentJobRole?: string;

        // Skills & Languages
        keySkills: string[];
        languages: { name: string; proficiency: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" }[];

        // Projects
        projects: {
            title: string;
            description: string;
            technologies: string[];
            url?: string;
        }[];
    }
) {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.id !== userId) {
            return { error: "Unauthorized" };
        }

        const { db } = await import("@/lib/db/db");
        const { seekerProfiles, experience, skills, projects, languages } = await import("@/lib/db/schema");
        const { eq } = await import("drizzle-orm");

        // 1. Check if Seeker Profile exists
        const [existingProfile] = await db
            .select()
            .from(seekerProfiles)
            .where(eq(seekerProfiles.userId, userId))
            .limit(1);

        const profileData = {
            workStatus: data.workStatus,
            lookingFor: data.lookingFor,
            currentEmploymentStatus: data.employmentStatus,
            totalExperienceYears: data.totalExperienceYears,
            totalExperienceMonths: data.totalExperienceMonths,
            currentIndustry: data.currentIndustry,
            currentDepartment: data.currentDepartment,
            currentRoleCategory: data.currentRoleCategory,
            currentJobRole: data.currentJobRole,
            currentSalary: data.currentSalary,
            noticePeriod: data.noticePeriod as any,
            updatedAt: new Date(),
        };

        if (existingProfile) {
            await db.update(seekerProfiles)
                .set(profileData)
                .where(eq(seekerProfiles.userId, userId));
        } else {
            await db.insert(seekerProfiles).values({
                ...profileData,
                userId,
                fullName: session.user.name || "Anonymous User", // Fallback name
            });
        }

        // 2. Insert/Update Experience (if Employed/Experienced)
        if (data.workStatus === "EXPERIENCED" && data.companyName && data.designation) {
            const jDate = data.joiningDate ? new Date(data.joiningDate) : new Date();
            const eDate = data.endDate ? new Date(data.endDate) : null;

            await db.insert(experience).values({
                userId: userId,
                companyName: data.companyName,
                designation: data.designation,
                startDate: jDate,
                endDate: eDate,
                isCurrent: !data.endDate,
                employmentType: "FULL_TIME",
            });
        }

        // 3. Update Skills
        await db.delete(skills).where(eq(skills.userId, userId));
        if (data.keySkills && data.keySkills.length > 0) {
            await db.insert(skills).values(
                data.keySkills.map(skill => ({
                    userId: userId,
                    skillName: skill,
                    proficiency: "INTERMEDIATE" as const,
                }))
            );
        }

        // 4. Update Languages
        await db.delete(languages).where(eq(languages.userId, userId));
        if (data.languages && data.languages.length > 0) {
            await db.insert(languages).values(
                data.languages.map(lang => ({
                    userId: userId,
                    languageName: lang.name,
                    read: lang.proficiency,
                    write: lang.proficiency,
                    speak: lang.proficiency,
                }))
            );
        }

        // 5. Update Projects
        await db.delete(projects).where(eq(projects.userId, userId));
        if (data.projects && data.projects.length > 0) {
            await db.insert(projects).values(
                data.projects.map(proj => ({
                    userId: userId,
                    title: proj.title,
                    description: proj.description,
                    technologies: proj.technologies,
                    url: proj.url,
                }))
            );
        }

        return { success: true };

    } catch (error) {
        console.error("Update Employment Error:", error);
        return { error: "Failed to update employment details" };
    }
}

export async function updateEducationAction(
    userId: string,
    data: {
        degree: {
            degreeName: string;
            specialization: string;
            collegeName: string;
            startDate: Date;
            endDate?: Date;
            isPursuing: boolean;
            cgpa: string;
        };
        class12: {
            schoolName: string;
            specialization: string;
            startDate: Date;
            endDate?: Date;
            isPursuing: boolean;
        };
    }
) {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.id !== userId) {
            return { error: "Unauthorized" };
        }

        const { db } = await import("@/lib/db/db");
        const { education } = await import("@/lib/db/schema");
        const { eq } = await import("drizzle-orm");

        // Clear existing education (for simplicity in onboarding)
        await db.delete(education).where(eq(education.userId, userId));

        // 1. Insert Degree
        await db.insert(education).values({
            userId: userId,
            type: "Degree",
            institute: data.degree.collegeName,
            degree: data.degree.degreeName,
            stream: data.degree.specialization,
            isPursuing: data.degree.isPursuing,
            percentage: data.degree.cgpa,
            startDate: data.degree.startDate,
            endDate: data.degree.endDate || null,
        });

        // 2. Insert Class 12
        await db.insert(education).values({
            userId: userId,
            type: "Class XII",
            institute: data.class12.schoolName,
            degree: "Class XII",
            stream: data.class12.specialization,
            isPursuing: data.class12.isPursuing,
            startDate: data.class12.startDate,
            endDate: data.class12.endDate || null,
        });

        return { success: true };

    } catch (error) {
        console.error("Update Education Error:", error);
        return { error: "Failed to update education details" };
    }
}

export async function updatePreferencesAction(
    userId: string,
    data: {
        headline: string;
        locations: string[];
        salary: number;
        gender?: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY" | "ANY" | null;
        position?: string;
    }
) {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.id !== userId) {
            return { error: "Unauthorized" };
        }

        const { db } = await import("@/lib/db/db");
        const { seekerProfiles } = await import("@/lib/db/schema");
        const { eq } = await import("drizzle-orm");

        // Check if Seeker Profile exists
        const [existingProfile] = await db
            .select()
            .from(seekerProfiles)
            .where(eq(seekerProfiles.userId, userId))
            .limit(1);

        const profileData = {
            bio: data.headline,
            preferredWorkLocation: data.locations,
            expectedSalaryMin: data.salary,
            gender: data.gender || undefined,
            position: data.position,
            updatedAt: new Date(),
        };

        if (existingProfile) {
            await db.update(seekerProfiles)
                .set(profileData)
                .where(eq(seekerProfiles.userId, userId));
        } else {
            await db.insert(seekerProfiles).values({
                ...profileData,
                userId,
                fullName: session.user.name || "Anonymous User", // Fallback name
            });
        }

        return { success: true };

    } catch (error) {
        console.error("Update Preferences Error:", error);
        return { error: "Failed to update preferences" };
    }
}
// ... (existing updatePreferencesAction)

export async function getEmploymentAction(userId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.id !== userId) {
            return { error: "Unauthorized" };
        }

        const { db } = await import("@/lib/db/db");
        const { seekerProfiles, experience, skills, projects, languages } = await import("@/lib/db/schema");
        const { eq, desc } = await import("drizzle-orm");

        // 1. Fetch Seeker Profile
        const profile = await db.query.seekerProfiles.findFirst({
            where: eq(seekerProfiles.userId, userId),
        });

        if (!profile) return { success: false, error: "Profile not found" };

        // 2. Fetch Skills
        const userSkills = await db.query.skills.findMany({
            where: eq(skills.userId, userId),
        });

        // 3. Fetch Languages
        const userLanguages = await db.query.languages.findMany({
            where: eq(languages.userId, userId),
        });

        // 4. Fetch Projects
        const userProjects = await db.query.projects.findMany({
            where: eq(projects.userId, userId),
        });

        // 5. Fetch Latest Experience
        const latestExperience = await db.query.experience.findFirst({
            where: eq(experience.userId, userId),
        });

        return {
            success: true,
            data: {
                profile,
                skills: userSkills,
                languages: userLanguages,
                projects: userProjects,
                experience: latestExperience
            }
        };

    } catch (error) {
        console.error("Get Employment Error:", error);
        return { error: "Failed to fetch data" };
    }
}

export async function getEducationAction(userId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.id !== userId) {
            return { error: "Unauthorized" };
        }

        const { db } = await import("@/lib/db/db");
        const { education } = await import("@/lib/db/schema");
        const { eq } = await import("drizzle-orm");

        const userEducation = await db.query.education.findMany({
            where: eq(education.userId, userId),
        });

        // Separate Degree and Class 12 based on the 'type' field
        const degreeData = userEducation.find(e => e.type === "Degree" || e.degree !== "Class XII");
        const class12Data = userEducation.find(e => e.type === "Class XII" || e.degree === "Class XII");

        return {
            success: true,
            data: {
                degree: degreeData,
                class12: class12Data
            }
        };

    } catch (error) {
        console.error("Get Education Error:", error);
        return { error: "Failed to fetch education data" };
    }
}

export async function getPreferencesAction(userId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.id !== userId) {
            return { error: "Unauthorized" };
        }

        const { db } = await import("@/lib/db/db");
        const { seekerProfiles } = await import("@/lib/db/schema");
        const { eq } = await import("drizzle-orm");

        const profile = await db.query.seekerProfiles.findFirst({
            where: eq(seekerProfiles.userId, userId),
        });

        if (!profile) return { success: false, error: "Profile not found" };

        return {
            success: true,
            data: {
                headline: profile.bio,
                locations: profile.preferredWorkLocation,
                salary: profile.expectedSalaryMin,
                gender: profile.gender,
                position: profile.position,
            }
        };

    } catch (error) {
        console.error("Get Preferences Error:", error);
        return { error: "Failed to fetch preferences" };
    }
}

export async function getProfileCompletionAction(userId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.id !== userId) {
            return { error: "Unauthorized" };
        }

        const { db } = await import("@/lib/db/db");
        const { seekerProfiles, skills, education, experience, projects, languages, achievements } =
            await import("@/lib/db/schema");
        const { eq, and, count } = await import("drizzle-orm");
        const { calculateProfileCompletion } = await import("@/lib/profileCompletion");

        const [profile] = await db
            .select()
            .from(seekerProfiles)
            .where(eq(seekerProfiles.userId, userId))
            .limit(1);

        const [{ value: skillsCount }] = await db
            .select({ value: count() })
            .from(skills)
            .where(eq(skills.userId, userId));

        const [{ value: educationCount }] = await db
            .select({ value: count() })
            .from(education)
            .where(eq(education.userId, userId));

        // Experience table holds both Employment and Internships. We check the employmentType or designation if needed,
        // but for now we'll count them based on a generic 'EMPLOYED' vs 'INTERNSHIP' if we had a type, 
        // however the schema uses `employmentType` which is preferredWorkTypeEnum: FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT
        const [{ value: employmentCount }] = await db
            .select({ value: count() })
            .from(experience)
            .where(
                and(
                    eq(experience.userId, userId),
                    eq(experience.employmentType, "FULL_TIME") // Count as employment
                )
            );

        const [{ value: internshipsCount }] = await db
            .select({ value: count() })
            .from(experience)
            .where(
                and(
                    eq(experience.userId, userId),
                    eq(experience.employmentType, "INTERNSHIP")
                )
            );

        const [{ value: projectsCount }] = await db
            .select({ value: count() })
            .from(projects)
            .where(eq(projects.userId, userId));

        const [{ value: languagesCount }] = await db
            .select({ value: count() })
            .from(languages)
            .where(eq(languages.userId, userId));

        // Achievements table holds multiple types: CERTIFICATION, AWARD, CLUB, EXAM, ACADEMIC
        const [{ value: accomplishmentsCount }] = await db
            .select({ value: count() })
            .from(achievements)
            .where(
                and(
                    eq(achievements.userId, userId),
                    // In a real app we might use `inArray`, here we just check if it's one of the accomplishment types
                    // We'll count CERTIFICATION, AWARD, and CLUB as Accomplishments
                    eq(achievements.type, "CERTIFICATION") // Simplified for now, can be expanded
                )
            );

        const [{ value: competitiveExamsCount }] = await db
            .select({ value: count() })
            .from(achievements)
            .where(
                and(
                    eq(achievements.userId, userId),
                    eq(achievements.type, "EXAM")
                )
            );

        const [{ value: academicAchievementsCount }] = await db
            .select({ value: count() })
            .from(achievements)
            .where(
                and(
                    eq(achievements.userId, userId),
                    eq(achievements.type, "ACADEMIC")
                )
            );

        const result = calculateProfileCompletion({
            profile: profile ?? null,
            educationCount: Number(educationCount),
            skillsCount: Number(skillsCount),
            languagesCount: Number(languagesCount),
            internshipsCount: Number(internshipsCount),
            projectsCount: Number(projectsCount),
            accomplishmentsCount: Number(accomplishmentsCount),
            competitiveExamsCount: Number(competitiveExamsCount),
            employmentCount: Number(employmentCount),
            academicAchievementsCount: Number(academicAchievementsCount)
        });

        return { success: true, data: result };
    } catch (error) {
        console.error("getProfileCompletionAction error:", error);
        return { error: "Failed to calculate profile completion" };
    }
}
