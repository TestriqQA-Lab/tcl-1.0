"use server";

import { db } from "@/lib/db/db";
import { jobs, employerProfiles, users, applications, seekerProfiles } from "@/lib/db/schema";
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
                    eq(jobs.approvalStatus, "APPROVED"),
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
                screeningExperienceMin: jobs.screeningExperienceMin,
                screeningEducationLevel: jobs.screeningEducationLevel,
                screeningEnglishLevel: jobs.screeningEnglishLevel,
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
                    eq(jobs.approvalStatus, "APPROVED"),
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

const ROLE_CATEGORIES: Record<string, string[]> = {
    "Software Development": ["frontend", "backend", "full stack", "fullstack", "ui ux", "ui/ux", "mobile", "ios", "android", "web", "software engineer", "developer"],
    "Data Science": ["data analyst", "data science", "machine learning", "ml", "ai", "artificial intelligence", "data engineer"],
    "Management": ["product manager", "project manager", "scrum master", "technical lead", "cto"],
    "Design": ["graphic designer", "ui designer", "ux designer", "product designer", "illustrator"],
    "Marketing": ["seo", "digital marketing", "content writer", "social media manager"],
    "QA & Testing": ["qa", "tester", "quality assurance", "automation engineer"],
    "Cyber Security": ["security analyst", "penetration tester", "cyber security"],
};

export async function getJobScreeningQuestions(jobId: string) {
    try {
        const result = await db
            .select({
                screeningExperienceMin: jobs.screeningExperienceMin,
                screeningEducationLevel: jobs.screeningEducationLevel,
                screeningEnglishLevel: jobs.screeningEnglishLevel,
            })
            .from(jobs)
            .where(eq(jobs.id, jobId))
            .limit(1);

        if (!result.length) return null;
        return result[0];
    } catch (error) {
        console.error("Error fetching screening questions:", error);
        return null;
    }
}

export async function applyToJobAction(jobId: string, customResumeBase64?: string, screeningAnswers?: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "You must be logged in to apply for a job." };
        }

        const userId = session.user.id;

        // 1. Verify user is a seeker
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });

        if (user?.userRole !== "SEEKER") {
            return { error: "Only seekers can apply for jobs." };
        }

        // 2. Check if already applied
        const existingApplication = await db.query.applications.findFirst({
            where: and(
                eq(applications.jobId, jobId),
                eq(applications.applicantId, userId)
            ),
        });

        if (existingApplication) {
            return { error: "You have already applied for this job." };
        }

        // 3. Get job and seeker profile
        const [job, seeker] = await Promise.all([
            db.query.jobs.findFirst({ where: eq(jobs.id, jobId) }),
            db.query.seekerProfiles.findFirst({ where: eq(seekerProfiles.userId, userId) })
        ]);

        if (!job) return { error: "Job not found." };
        if (!seeker) return { error: "Seeker profile not found. Please complete your profile first." };

        // 4. Resolve Resume
        const resumeToUse = customResumeBase64 || seeker.resumeUrl;

        if (!resumeToUse) {
            return { error: "RESUME_REQUIRED", message: "A resume relates to your professional background is required to apply." };
        }

        // 5. Create application
        await db.insert(applications).values({
            jobId,
            applicantId: userId,
            applicationStatus: "PENDING",
            resumeUrl: resumeToUse,
            coverLetterUrl: seeker.coverLetter || "",
            screeningAnswers: screeningAnswers || null,
        });

        const { revalidatePath } = await import("next/cache");
        revalidatePath(`/job/${jobId}`);
        revalidatePath("/user-applications");

        return { success: true };
    } catch (error: any) {
        console.error("Error applying for job:", error);
        return { error: error.message || "An error occurred while applying for the job." };
    }
}

export async function hasUserAppliedAction(jobId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return false;

        const existing = await db.query.applications.findFirst({
            where: and(
                eq(applications.jobId, jobId),
                eq(applications.applicantId, session.user.id)
            ),
        });

        return !!existing;
    } catch (error) {
        return false;
    }
}

export async function getRecommendedJobsAction(userId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.id !== userId) {
            return { error: "Unauthorized" };
        }

        // 1. Get user's position from seeker profile
        const profileResult = await db
            .select({ position: seekerProfiles.position })
            .from(seekerProfiles)
            .where(eq(seekerProfiles.userId, userId))
            .limit(1);

        const userPosition = profileResult[0]?.position?.toLowerCase() || "";
        console.log("DEBUG: getRecommendedJobsAction - User Position:", userPosition);

        // 2. Determine category keywords or handle mix fallback
        let keywords: string[] = [];
        if (userPosition) {
            keywords.push(userPosition);
            for (const [category, roles] of Object.entries(ROLE_CATEGORIES)) {
                if (roles.some(role => userPosition.includes(role)) || category.toLowerCase().includes(userPosition)) {
                    keywords = [...new Set([...keywords, ...roles])];
                    break;
                }
            }
        }
        console.log("DEBUG: getRecommendedJobsAction - Identified Keywords:", keywords);

        let recommendedJobs: any[] = [];

        if (keywords.length > 0) {
            console.log("DEBUG: getRecommendedJobsAction - Fetching roles-based jobs...");
            // Recommendation based on role/category
            const keywordConditions = keywords.map(kw => or(
                ilike(jobs.title, `%${kw}%`),
                ilike(jobs.description, `%${kw}%`)
            ));

            recommendedJobs = await db
                .select({
                    id: jobs.id,
                    title: jobs.title,
                    company: employerProfiles.companyName,
                    companyLogo: employerProfiles.companyLogo,
                    location: jobs.location,
                    type: jobs.type,
                    salaryMin: jobs.salaryMin,
                    salaryMax: jobs.salaryMax,
                    createdAt: jobs.createdAt,
                })
                .from(jobs)
                .innerJoin(employerProfiles, eq(jobs.employerId, employerProfiles.userId))
                .where(and(eq(jobs.status, "OPEN"), eq(jobs.approvalStatus, "APPROVED"), or(...keywordConditions)))
                .orderBy(desc(jobs.createdAt))
                .limit(10);

            console.log(`DEBUG: getRecommendedJobsAction - Found ${recommendedJobs.length} role-based jobs.`);
        }

        // If no jobs found or no keywords, use mix fallback
        if (recommendedJobs.length === 0) {
            console.log("DEBUG: getRecommendedJobsAction - Triggering MIX FALLBACK...");
            // MIX FALLBACK: Fetch 2 jobs from each category to ensure variety
            const categoryResults = await Promise.all(
                Object.values(ROLE_CATEGORIES).slice(0, 5).map(async (roles) => {
                    const kw = roles[0]; // Take the primary role for each category
                    try {
                        return await db
                            .select({
                                id: jobs.id,
                                title: jobs.title,
                                company: employerProfiles.companyName,
                                companyLogo: employerProfiles.companyLogo,
                                location: jobs.location,
                                type: jobs.type,
                                salaryMin: jobs.salaryMin,
                                salaryMax: jobs.salaryMax,
                                createdAt: jobs.createdAt,
                            })
                            .from(jobs)
                            .innerJoin(employerProfiles, eq(jobs.employerId, employerProfiles.userId))
                            .where(and(eq(jobs.status, "OPEN"), eq(jobs.approvalStatus, "APPROVED"), ilike(jobs.title, `%${kw}%`)))
                            .orderBy(desc(jobs.createdAt))
                            .limit(2);
                    } catch (e) {
                        console.error(`DEBUG: getRecommendedJobsAction - Error fetching for category ${kw}:`, e);
                        return [];
                    }
                })
            );

            recommendedJobs = categoryResults.flat();
            console.log(`DEBUG: getRecommendedJobsAction - Mix fallback found ${recommendedJobs.length} jobs.`);

            // Fill up with general recent jobs if needed (up to 10 total)
            if (recommendedJobs.length < 10) {
                const existingIds = recommendedJobs.map(j => j.id);
                console.log("DEBUG: getRecommendedJobsAction - Filling with extra recent jobs...");

                try {
                    const extraJobs = await db
                        .select({
                            id: jobs.id,
                            title: jobs.title,
                            company: employerProfiles.companyName,
                            companyLogo: employerProfiles.companyLogo,
                            location: jobs.location,
                            type: jobs.type,
                            salaryMin: jobs.salaryMin,
                            salaryMax: jobs.salaryMax,
                            createdAt: jobs.createdAt,
                        })
                        .from(jobs)
                        .innerJoin(employerProfiles, eq(jobs.employerId, employerProfiles.userId))
                        .where(and(
                            eq(jobs.status, "OPEN"),
                            eq(jobs.approvalStatus, "APPROVED"),
                            existingIds.length > 0 ? sql`${jobs.id} NOT IN (${sql.join(existingIds, sql`, `)})` : sql`TRUE`
                        ))
                        .orderBy(desc(jobs.createdAt))
                        .limit(10 - recommendedJobs.length);

                    recommendedJobs = [...recommendedJobs, ...extraJobs];
                    console.log(`DEBUG: getRecommendedJobsAction - Total jobs after extra fill: ${recommendedJobs.length}`);
                } catch (e) {
                    console.error("DEBUG: getRecommendedJobsAction - Error during extra fill:", e);
                }
            }

            // Randomize the mix slightly for better presentation
            recommendedJobs = recommendedJobs.sort(() => Math.random() - 0.5);
        }

        return {
            success: true,
            jobs: recommendedJobs.map(job => {
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - job.createdAt.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const timeAgo = diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;

                return {
                    id: job.id,
                    title: job.title,
                    company: job.company || "Unknown Company",
                    location: job.location,
                    salary: `₹${(job.salaryMin / 1000).toFixed(0)}L - ₹${(job.salaryMax / 1000).toFixed(0)}L`,
                    timeAgo,
                    logoUrl: job.companyLogo || undefined
                };
            })
        };

    } catch (error: any) {
        console.error("Error fetching recommended jobs:", error);
        return { error: error.message || "Failed to fetch recommended jobs" };
    }
}
