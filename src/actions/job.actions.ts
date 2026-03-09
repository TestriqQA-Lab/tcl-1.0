"use server";

import { db } from "@/lib/db/db";
import { jobs, employerProfiles, users, applications } from "@/lib/db/schema";
import { auth } from "@/auth";
import { eq, ilike, or, and, inArray, desc, sql } from "drizzle-orm";
import type { CreateJobPayload } from "@/types/job";

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

export async function getEmployerJobs() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "Unauthorized" };
        }

        const employerId = session.user.id;

        const results = await db
            .select({
                id: jobs.id,
                title: jobs.title,
                location: jobs.location,
                type: jobs.type,
                status: jobs.status,
                createdAt: jobs.createdAt,
                statusChangedAt: jobs.statusChangedAt,
                applications: sql<number>`count(distinct ${applications.id})::int`,
                shortlisted: sql<number>`count(distinct case when ${applications.applicationStatus} = 'ACCEPTED' then ${applications.id} end)::int`,
            })
            .from(jobs)
            .leftJoin(applications, eq(jobs.id, applications.jobId))
            .where(eq(jobs.employerId, employerId))
            .groupBy(jobs.id)
            .orderBy(desc(jobs.createdAt));

        return {
            success: true,
            jobs: results.map(job => {
                // Formatting date to '12 Oct 2023'
                const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
                const formattedDate = job.createdAt.toLocaleDateString('en-GB', dateOptions);
                const formattedStatusChangedDate = job.statusChangedAt
                    ? job.statusChangedAt.toLocaleDateString('en-GB', dateOptions)
                    : undefined;

                let status: 'Active' | 'Paused' | 'Closed' = 'Closed';
                if (job.status === 'OPEN') status = 'Active';
                else if (job.status === 'PAUSED') status = 'Paused';

                return {
                    id: job.id,
                    title: job.title,
                    location: job.location,
                    type: job.type.charAt(0) + job.type.slice(1).toLowerCase(),
                    department: 'Engineering', // Placeholder, map if added to DB
                    status,
                    applications: job.applications,
                    shortlisted: job.shortlisted,
                    postedDate: formattedDate,
                    statusChangedDate: formattedStatusChangedDate,
                };
            })
        };
    } catch (error) {
        console.error("Error fetching employer jobs:", error);
        return { error: "Failed to fetch jobs" };
    }
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

export async function updateJobStatus(jobId: string, newStatus: "OPEN" | "PAUSED" | "CLOSED") {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "Unauthorized" };
        }

        const { revalidatePath } = await import("next/cache");

        await db.update(jobs)
            .set({
                status: newStatus,
                // Stamp timestamp when pausing or closing; clear it when reopening
                statusChangedAt: newStatus !== 'OPEN' ? new Date() : null,
            })
            .where(
                and(
                    eq(jobs.id, jobId),
                    eq(jobs.employerId, session.user.id)
                )
            );

        revalidatePath("/job-postings");
        return { success: true };
    } catch (error: any) {
        console.error("Error updating job status:", error);
        return { error: error.message || "Failed to update job status" };
    }
}
export async function getJobByIdForEmployer(jobId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { error: "Unauthorized" };

        const result = await db
            .select()
            .from(jobs)
            .where(and(eq(jobs.id, jobId), eq(jobs.employerId, session.user.id)))
            .limit(1);

        if (!result.length) return { error: "Job not found" };
        return { success: true, job: result[0] };
    } catch (error: any) {
        console.error("Error fetching job by id:", error);
        return { error: error.message || "Failed to fetch job" };
    }
}

export async function updateJobAction(jobId: string, payload: CreateJobPayload) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { error: "Unauthorized" };

        const { revalidatePath } = await import("next/cache");

        await db.update(jobs)
            .set({
                title: payload.title,
                description: payload.description,
                location: payload.location,
                workExperienceMin: payload.workExperienceMin ?? undefined,
                workExperienceMax: payload.workExperienceMax ?? undefined,
                monthlySalaryMin: payload.monthlySalaryMin ?? undefined,
                monthlySalaryMax: payload.monthlySalaryMax ?? undefined,
                perksAndBenefits: payload.perksAndBenefits,
                candidateLocationRequirement: payload.candidateLocationRequirement,
                candidateEducationLevel: payload.candidateEducationLevel,
                requiredSkills: payload.requiredSkills,
                preferredCandidateGender: payload.preferredCandidateGender as any,
                screeningExperienceMin: payload.screeningExperienceMin ?? undefined,
                screeningEducationLevel: payload.screeningEducationLevel,
                screeningEnglishLevel: payload.screeningEnglishLevel,
                aboutCompany: payload.aboutCompany,
                allowCalls: payload.allowCalls,
                recruiterName: payload.recruiterName,
                recruiterContact: payload.recruiterContact,
                callTimeFrom: payload.callTimeFrom,
                callTimeTo: payload.callTimeTo,
                callDays: payload.callDays,
                updatedAt: new Date(),
            })
            .where(and(eq(jobs.id, jobId), eq(jobs.employerId, session.user.id)));

        revalidatePath("/job-postings");
        return { success: true };
    } catch (error: any) {
        console.error("Error updating job:", error);
        return { error: error.message || "Failed to update job" };
    }
}
