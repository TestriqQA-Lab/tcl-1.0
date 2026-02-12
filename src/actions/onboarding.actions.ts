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

        // 1. Update Seeker Profile
        await db.update(seekerProfiles)
            .set({
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
                noticePeriod: data.noticePeriod as any, // Cast if enum mismatch, or map
                updatedAt: new Date(),
            })
            .where(eq(seekerProfiles.userId, userId));

        // 2. Insert/Update Experience (if Employed/Experienced)
        if (data.workStatus === "EXPERIENCED" && data.companyName && data.designation) {
            await db.insert(experience).values({
                userId: userId,
                company: data.companyName,
                title: data.designation,
                location: data.currentCity,
                startDate: data.joiningDate ? new Date(data.joiningDate).toISOString() : new Date().toISOString(),
                endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
                currentlyWorking: !data.endDate,
                salary: data.currentSalary,
                noticePeriod: data.noticePeriod,
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
            schoolName: data.degree.collegeName,
            degree: data.degree.degreeName,
            fieldOfStudy: data.degree.specialization,
            startDate: data.degree.startDate.toISOString(),
            endDate: data.degree.endDate ? data.degree.endDate.toISOString() : null,
            grade: data.degree.cgpa,
            description: "First Degree Information",

            // Onboarding Specifics mapping
            university: data.degree.collegeName,
            specialization: data.degree.specialization,
            passingYear: data.degree.endDate ? data.degree.endDate.getFullYear() : undefined,
        });

        // 2. Insert Class 12
        await db.insert(education).values({
            userId: userId,
            schoolName: data.class12.schoolName,
            degree: "Class 12",
            fieldOfStudy: data.class12.specialization, // Stream
            startDate: data.class12.startDate.toISOString(),
            endDate: data.class12.endDate ? data.class12.endDate.toISOString() : null,
            description: "Second Class 12 Information",

            // Onboarding Specifics mapping
            passingYear: data.class12.endDate ? data.class12.endDate.getFullYear() : undefined,
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
        gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
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

        await db.update(seekerProfiles)
            .set({
                bio: data.headline,
                preferredWorkLocation: data.locations,
                expectedSalaryMin: data.salary,
                gender: data.gender,
                updatedAt: new Date(),
            })
            .where(eq(seekerProfiles.userId, userId));

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
            orderBy: [desc(experience.startDate)],
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

        // Separate Degree and Class 12 based on description or degree name
        // In updateEducationAction we set:
        // Degree -> description: "First Degree Information"
        // Class 12 -> degree: "Class 12", description: "Second Class 12 Information"

        const degreeData = userEducation.find(e => e.description === "First Degree Information" || e.degree !== "Class 12");
        const class12Data = userEducation.find(e => e.description === "Second Class 12 Information" || e.degree === "Class 12");

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
            }
        };

    } catch (error) {
        console.error("Get Preferences Error:", error);
        return { error: "Failed to fetch preferences" };
    }
}
