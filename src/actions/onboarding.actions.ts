"use server";

import { auth } from "@/auth";

export async function updateEmploymentAction(
    userId: string,
    data: {
        isEmployed: boolean;
        totalExperienceYears: number;
        totalExperienceMonths: number;
        companyName?: string;
        designation?: string;
        currentCity?: string;
        joiningDate?: Date; // or string
        endDate?: Date; // or string or null
        currentSalary?: number;
        noticePeriod?: string;
        keySkills: string[];
        currentIndustry?: string;
        currentDepartment?: string;
        currentRoleCategory?: string;
        currentJobRole?: string;
    }
) {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.id !== userId) {
            return { error: "Unauthorized" };
        }

        const { db } = await import("@/lib/db/db");
        const { seekerProfiles, experience, skills } = await import("@/lib/db/schema");
        const { eq } = await import("drizzle-orm");

        // 1. Update Seeker Profile with Experience Totals & Current Role Info
        await db.update(seekerProfiles)
            .set({
                totalExperienceYears: data.totalExperienceYears,
                totalExperienceMonths: data.totalExperienceMonths,
                currentIndustry: data.currentIndustry,
                currentDepartment: data.currentDepartment,
                currentRoleCategory: data.currentRoleCategory,
                currentJobRole: data.currentJobRole,
                currentSalary: data.currentSalary,
                updatedAt: new Date(),
            })
            .where(eq(seekerProfiles.userId, userId));

        // 2. If Employed, Insert/Update Current Experience
        // For MVP, we'll just insert a new record or assumption:
        // Ideally we should check if there's an existing "currently working" record and update it, 
        // but for onboarding (first time), insert is fine.
        if (data.isEmployed && data.companyName && data.designation) {
            await db.insert(experience).values({
                userId: userId,
                company: data.companyName,
                title: data.designation,
                location: data.currentCity,
                startDate: data.joiningDate ? new Date(data.joiningDate).toISOString() : new Date().toISOString(),
                endDate: data.endDate ? new Date(data.endDate).toISOString() : null, // Null means present
                currentlyWorking: !data.endDate,
                salary: data.currentSalary, // Assuming monthly/annual logic matches
                noticePeriod: data.noticePeriod,
                employmentType: "FULL_TIME", // Default or add field
            });
        }

        // 3. Insert Skills
        // Delete existing skills for clean slate or append? Onboarding usually implies fresh.
        // Let's delete old ones to avoid dupes if they go back and forth.
        await db.delete(skills).where(eq(skills.userId, userId));

        if (data.keySkills && data.keySkills.length > 0) {
            await db.insert(skills).values(
                data.keySkills.map(skill => ({
                    userId: userId,
                    skillName: skill,
                    proficiency: "INTERMEDIATE", // Default
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
        qualification: string;
        course: string;
        courseType: string;
        specialization: string;
        university: string;
        startingYear: number;
        passingYear: number;
    }
) {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.id !== userId) {
            return { error: "Unauthorized" };
        }

        const { db } = await import("@/lib/db/db");
        const { education } = await import("@/lib/db/schema");

        await db.insert(education).values({
            userId: userId,
            degree: data.course, // Mapping "Course" to "degree"
            schoolName: data.university,
            fieldOfStudy: data.specialization,
            startDate: new Date(data.startingYear, 0, 1).toISOString(), // Jan 1st of start year
            endDate: new Date(data.passingYear, 0, 1).toISOString(), // Jan 1st of pass year
            courseType: data.courseType,
            description: data.qualification, // Storing qualification level (e.g. Post Grad) in description or separate field? 
            // Schema has `degree`, `schoolName`, `fieldOfStudy`. 
            // We might want to store `qualification` in `degree` and `course` in `fieldOfStudy` or similar.
            // Let's use `degree` for Qualification (e.g. Masters) and `fieldOfStudy` for Course (e.g. CS).
            // Actually schema comment says: degree: "Class X, B.Tech".
            // So: degree = data.course (e.g. B.Tech), fieldOfStudy = data.specialization (e.g. AI).
            // Where to store "Highest Qualification" (e.g. Graduation/PostGrad)? 
            // Maybe just in `degree` we put "B.Tech" and that implies Graduation.
            // Let's map: 
            // schoolName -> university
            // degree -> data.course
            // fieldOfStudy -> data.specialization
            // courseType -> data.courseType
            // passingYear -> data.passingYear (added to schema)
        });

        return { success: true };

    } catch (error) {
        console.error("Update Education Error:", error);
        return { error: "Failed to update education details" };
    }
}
