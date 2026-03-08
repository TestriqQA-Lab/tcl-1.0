"use server";

import { db } from "@/lib/db/db";
import { jobs, employerProfiles, users } from "@/lib/db/schema";
import { auth } from "@/auth";
import { eq, ilike, or, and, inArray, desc } from "drizzle-orm";

export async function getJobs(params: {
    keyword?: string;
    location?: string;
    jobTypes?: string[];
}) {
    try {
        const query = db
            .select({
                id: jobs.id,
                title: jobs.title,
                company: employerProfiles.companyName,
                companyLogo: employerProfiles.companyLogo,
                location: jobs.location,
                type: jobs.type,
                salaryMin: jobs.salaryMin,
                salaryMax: jobs.salaryMax,
                description: jobs.description,
                createdAt: jobs.createdAt,
            })
            .from(jobs)
            .innerJoin(employerProfiles, eq(jobs.employerId, employerProfiles.userId))
            .where(
                and(
                    eq(jobs.status, "OPEN"),
                    params.keyword ? or(
                        ilike(jobs.title, `%${params.keyword}%`),
                        ilike(jobs.description, `%${params.keyword}%`),
                        ilike(employerProfiles.companyName, `%${params.keyword}%`)
                    ) : undefined,
                    params.location ? ilike(jobs.location, `%${params.location}%`) : undefined,
                    params.jobTypes && params.jobTypes.length > 0
                        ? inArray(jobs.type, params.jobTypes.map(t => t.toUpperCase() as any))
                        : undefined
                )
            )
            .orderBy(desc(jobs.createdAt));

        const results = await query;

        return results.map(job => ({
            ...job,
            salary: `$${(job.salaryMin / 1000).toFixed(0)}k - $${(job.salaryMax / 1000).toFixed(0)}k`,
            // Capitalize first letter, lowercase rest for job type formatting
            type: job.type.charAt(0) + job.type.slice(1).toLowerCase()
        }));
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return [];
    }
}

export async function getJobById(jobId: string) {
    try {
        const query = db
            .select({
                id: jobs.id,
                title: jobs.title,
                description: jobs.description,
                type: jobs.type,
                location: jobs.location,
                salaryMin: jobs.salaryMin,
                salaryMax: jobs.salaryMax,
                requiredSkills: jobs.requiredSkills,
                createdAt: jobs.createdAt,
                employerId: jobs.employerId,
                company: {
                    name: employerProfiles.companyName,
                    logo: employerProfiles.companyLogo,
                    industry: employerProfiles.companyIndustry,
                    description: employerProfiles.companyDescription,
                }
            })
            .from(jobs)
            .innerJoin(employerProfiles, eq(jobs.employerId, employerProfiles.userId))
            .where(eq(jobs.id, jobId));

        const result = await query;
        console.log("getJobById Result Count:", result.length);
        if (result.length === 0) return null;

        const job = result[0];
        return {
            ...job,
            salary: `$${(job.salaryMin / 1000).toFixed(0)}k - $${(job.salaryMax / 1000).toFixed(0)}k`,
            type: job.type.charAt(0) + job.type.slice(1).toLowerCase()
        };
    } catch (error) {
        console.error("Error fetching job by id:", error);
        return null;
    }
}

export async function getSimilarJobs(jobId: string, limitCount = 3) {
    try {
        // Fetch the current job to get its type and location for matching
        const currentJobResult = await db.select({ type: jobs.type, location: jobs.location }).from(jobs).where(eq(jobs.id, jobId)).limit(1);

        if (!currentJobResult.length) return [];
        const currentJob = currentJobResult[0];

        const query = db
            .select({
                id: jobs.id,
                title: jobs.title,
                location: jobs.location,
                type: jobs.type,
                salaryMin: jobs.salaryMin,
                salaryMax: jobs.salaryMax,
                description: jobs.description,
                company: employerProfiles.companyName,
                companyLogo: employerProfiles.companyLogo,
            })
            .from(jobs)
            .innerJoin(employerProfiles, eq(jobs.employerId, employerProfiles.userId))
            .where(
                and(
                    eq(jobs.status, "OPEN"),
                    or(
                        eq(jobs.type, currentJob.type),
                        ilike(jobs.location, `%${currentJob.location}%`)
                    )
                )
            )
            .orderBy(desc(jobs.createdAt))
            .limit(limitCount);

        const results = await query;

        // Filter out the current job explicitly and format the data
        return results
            .filter(j => j.id !== jobId)
            .map(job => ({
                id: job.id,
                title: job.title,
                company: job.company,
                companyLogo: job.companyLogo,
                location: job.location,
                type: job.type.charAt(0) + job.type.slice(1).toLowerCase(),
                description: job.description,
                salary: `$${(job.salaryMin / 1000).toFixed(0)}k - $${(job.salaryMax / 1000).toFixed(0)}k`,
                color: "bg-blue-600" // Placeholder for identical UI rendering
            }));

    } catch (error) {
        console.error("Error fetching similar jobs:", error);
        return [];
    }
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

export async function createJobAction(payload: CreateJobPayload) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "Unauthorized" };
        }

        const employerId = session.user.id;

        // Ensure the gender matches our schema enum or is mapped back
        let dbGender: any = null;
        if (payload.preferredCandidateGender !== "ANY") {
            dbGender = payload.preferredCandidateGender.toUpperCase();
        }

        // Just putting application deadline 30 days from now
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 30);

        const newJob = await db.insert(jobs).values({
            employerId,
            title: payload.title,
            description: payload.description,
            type: "ONSITE", // Can be updated if needed or added to payload
            location: payload.location || "India",
            salaryMin: payload.monthlySalaryMin || 0,
            salaryMax: payload.monthlySalaryMax || 0,
            status: "OPEN",
            experienceLevel: payload.workExperienceMin || 0,
            applicationDeadline: deadline,

            requiredSkills: payload.requiredSkills,

            // Step 1 additions
            workExperienceMin: payload.workExperienceMin,
            workExperienceMax: payload.workExperienceMax,
            monthlySalaryMin: payload.monthlySalaryMin,
            monthlySalaryMax: payload.monthlySalaryMax,
            perksAndBenefits: payload.perksAndBenefits,

            // Step 2 additions
            candidateLocationRequirement: payload.candidateLocationRequirement,
            candidateEducationLevel: payload.candidateEducationLevel,
            preferredCandidateGender: dbGender,

            // Step 3 additions
            screeningExperienceMin: payload.screeningExperienceMin,
            screeningEducationLevel: payload.screeningEducationLevel,
            screeningEnglishLevel: payload.screeningEnglishLevel,

            // Step 4 additions
            aboutCompany: payload.aboutCompany,

            // Step 5 additions
            allowCalls: payload.allowCalls,
            recruiterName: payload.recruiterName,
            recruiterContact: payload.recruiterContact,
            callTimeFrom: payload.callTimeFrom,
            callTimeTo: payload.callTimeTo,
            callDays: payload.callDays,
        }).returning({ id: jobs.id });

        return { success: true, jobId: newJob[0].id };
    } catch (error: any) {
        console.error("Error creating job:", error);
        return { error: error.message || "Failed to create job" };
    }
}
