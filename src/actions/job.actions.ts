"use server";

import { db } from "@/lib/db/db";
import { jobs, employerProfiles, users, applications, seekerProfiles } from "@/lib/db/schema";
import { auth } from "@/auth";
import { eq, ilike, or, and, inArray, desc, sql, gte } from "drizzle-orm";
import type { CreateJobPayload } from "@/types/job";
import { unstable_cache } from "next/cache";

// Cached version of getJobs for the homepage (no filters, just recent open jobs)
export const getHomepageFeaturedJobs = unstable_cache(
    async () => {
        try {
            const results = await db
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
                    requiredSkills: jobs.requiredSkills,
                })
                .from(jobs)
                .innerJoin(employerProfiles, eq(jobs.employerId, employerProfiles.userId))
                .where(
                    and(
                        eq(jobs.status, "OPEN"),
                        eq(jobs.approvalStatus, "APPROVED")
                    )
                )
                .orderBy(desc(jobs.createdAt))
                .limit(6);

            return results.map(job => ({
                ...job,
                salary: `₹${(job.salaryMin / 1000).toFixed(0)}K - ₹${(job.salaryMax / 1000).toFixed(0)}K`,
                type: job.type.charAt(0) + job.type.slice(1).toLowerCase()
            }));
        } catch (error) {
            console.error("Error fetching homepage jobs:", error);
            return [];
        }
    },
    ["homepage-featured-jobs"],
    { revalidate: 60, tags: ["jobs"] } // Cache for 60 seconds
);
export async function getJobs(params: {
    keyword?: string;
    location?: string; // from hero search
    locations?: string[]; // from sidebar filters
    jobTypes?: string[];
    salaryMin?: number;
    salaryMax?: number;
    experience?: number;
    workModes?: string[];
    departments?: string[];
    companyTypes?: string[];
    roleCategories?: string[];
    industries?: string[];
    education?: string[];
    postedBy?: string[];
    freshness?: string;
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
                requiredSkills: jobs.requiredSkills,
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
                    params.locations && params.locations.length > 0
                        ? or(...params.locations.map(l => ilike(jobs.location, `%${l}%`)))
                        : (params.location ? ilike(jobs.location, `%${params.location}%`) : undefined),
                    params.jobTypes && params.jobTypes.length > 0
                        ? inArray(jobs.type, params.jobTypes.map(t => t.toUpperCase() as any))
                        : undefined,
                    params.workModes && params.workModes.length > 0
                        ? inArray(jobs.type, params.workModes.map(m => {
                            if (m.toLowerCase().includes("remote")) return "REMOTE";
                            if (m.toLowerCase().includes("hybrid")) return "HYBRID";
                            return "ONSITE";
                        }))
                        : undefined,
                    params.departments && params.departments.length > 0
                        ? inArray(jobs.department, params.departments)
                        : undefined,
                    params.roleCategories && params.roleCategories.length > 0
                        ? inArray(jobs.roleCategory, params.roleCategories)
                        : undefined,
                    params.industries && params.industries.length > 0
                        ? inArray(jobs.industry, params.industries)
                        : undefined,

                    params.salaryMin !== undefined ? gte(jobs.salaryMax, params.salaryMin) : undefined,
                    params.salaryMax !== undefined ? sql`${jobs.salaryMin} <= ${params.salaryMax}` : undefined,
                    params.experience !== undefined ? gte(jobs.experienceLevel, params.experience) : undefined,
                    params.freshness ? (
                        params.freshness === "1d" ? gte(jobs.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)) :
                        params.freshness === "7d" ? gte(jobs.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) :
                        params.freshness === "30d" ? gte(jobs.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) :
                        undefined
                    ) : undefined
                )
            )
            .orderBy(desc(jobs.createdAt))
            .limit(50); // Cap results to prevent massive payloads

        const results = await query;

        return results.map(job => ({
            ...job,
            salary: `₹${(job.salaryMin / 1000).toFixed(0)}K - ₹${(job.salaryMax / 1000).toFixed(0)}K`,
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
                experienceLevel: jobs.experienceLevel,
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
        if (result.length === 0) return null;

        // Fetch application count
        const appCountResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(applications)
            .where(eq(applications.jobId, jobId));
        
        const applicantCount = Number(appCountResult[0]?.count ?? 0);

        const job = result[0];
        return {
            ...job,
            applicantCount,
            salary: `₹${(job.salaryMin / 1000).toFixed(0)}K - ₹${(job.salaryMax / 1000).toFixed(0)}K`,
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
                salary: `₹${(job.salaryMin / 1000).toFixed(0)}K - ₹${(job.salaryMax / 1000).toFixed(0)}K`,
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
                approvalStatus: jobs.approvalStatus,
                rejectionReason: jobs.rejectionReason,
                applications: sql<number>`count(distinct ${applications.id})::int`,
                shortlisted: sql<number>`count(distinct case when ${applications.applicationStatus} = 'ACCEPTED' then ${applications.id} end)::int`,
            })
            .from(jobs)
            .leftJoin(applications, eq(jobs.id, applications.jobId))
            .where(eq(jobs.employerId, employerId))
            .groupBy(
                jobs.id,
                jobs.title,
                jobs.location,
                jobs.type,
                jobs.status,
                jobs.createdAt,
                jobs.statusChangedAt,
                jobs.approvalStatus,
                jobs.rejectionReason
            )
            .orderBy(desc(jobs.createdAt));

        return {
            success: true,
            jobs: results.map((job) => {
                const resultsDate = job.createdAt ? new Date(job.createdAt) : new Date();
                const formattedDate = resultsDate.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                });
                const statusChangedDateObj = job.statusChangedAt ? new Date(job.statusChangedAt) : null;
                const formattedStatusChangedDate = statusChangedDateObj ? statusChangedDateObj.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }) : undefined;

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
                    approvalStatus: job.approvalStatus,
                    rejectionReason: job.rejectionReason,
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

        // Backend Validation
        if (!payload.title?.trim()) return { error: "Job title is required" };
        if (!payload.description?.trim() || payload.description.length < 50) return { error: "Job description is too short (min 50 chars)" };
        if (payload.workExperienceMin === undefined || payload.workExperienceMin === null || 
            payload.workExperienceMax === undefined || payload.workExperienceMax === null) {
            return { error: "Work experience is required" };
        }
        if (payload.monthlySalaryMin === undefined || payload.monthlySalaryMin === null || 
            payload.monthlySalaryMax === undefined || payload.monthlySalaryMax === null) {
            return { error: "Salary range is required" };
        }
        if (payload.monthlySalaryMax < payload.monthlySalaryMin) return { error: "Max salary must be greater than min salary" };
        if (!payload.candidateEducationLevel) return { error: "Education qualification is required" };
        if (payload.allowCalls) {
            if (!payload.recruiterName?.trim()) return { error: "Recruiter name is required" };
            if (!payload.recruiterContact?.trim() || !/^\d{10}$/.test(payload.recruiterContact)) {
                return { error: "Valid 10-digit mobile number is required" };
            }
        }

        // Ensure the gender matches our schema enum
        const dbGender = payload.preferredCandidateGender.toUpperCase() as any;

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
            customScreeningQuestions: payload.customScreeningQuestions || [],
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
                preferredCandidateGender: payload.preferredCandidateGender.toUpperCase() as any,
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
                customScreeningQuestions: payload.customScreeningQuestions || [],
                approvalStatus: 'PENDING',
                rejectionReason: null,
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

export async function getUserApplicationsAction() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "Unauthorized" };
        }

        const userId = session.user.id;

        // Get all applications for the user with joined job and employer data
        const results = await db
            .select({
                applicationId: applications.id,
                applicationStatus: applications.applicationStatus,
                applicationDate: applications.applicationDate,
                resumeUrl: applications.resumeUrl,
                coverLetterUrl: applications.coverLetterUrl,
                jobId: jobs.id,
                jobTitle: jobs.title,
                jobLocation: jobs.location,
                jobType: jobs.type,
                salaryMin: jobs.salaryMin,
                salaryMax: jobs.salaryMax,
                requiredSkills: jobs.requiredSkills,
                description: jobs.description,
                employerId: jobs.employerId,
                companyName: employerProfiles.companyName,
                companyLogo: employerProfiles.companyLogo,
            })
            .from(applications)
            .innerJoin(jobs, eq(applications.jobId, jobs.id))
            .innerJoin(employerProfiles, eq(jobs.employerId, employerProfiles.userId))
            .where(eq(applications.applicantId, userId))
            .orderBy(desc(applications.applicationDate));

        // Map DB status to UI-friendly status
        const statusMap: Record<string, string> = {
            PENDING: "Pending",
            REVIEWED: "Reviewed",
            ACCEPTED: "Reviewed",
            REJECTED: "Rejected",
            SHORTLISTED: "Reviewed",
        };

        const mapped = results.map((r) => {
            const appliedDate = new Date(r.applicationDate);
            const now = new Date();
            const diffMs = now.getTime() - appliedDate.getTime();
            const daysAgo = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            const companyName = r.companyName || "Company";
            const initials = companyName
                .split(" ")
                .map((w: string) => w[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();

            return {
                id: r.applicationId,
                jobId: r.jobId,
                jobTitle: r.jobTitle,
                company: companyName,
                companyInitials: initials,
                companyColor: "bg-[#115e59]",
                companyLogo: r.companyLogo || "",
                location: r.jobLocation,
                jobType: r.jobType === "ONSITE" ? "On-site" : r.jobType === "REMOTE" ? "Remote" : r.jobType === "HYBRID" ? "Hybrid" : r.jobType,
                workMode: r.jobType === "ONSITE" ? "On-site" : r.jobType === "REMOTE" ? "Remote" : "Hybrid",
                salary: `₹${(r.salaryMin / 1000).toFixed(0)}K – ₹${(r.salaryMax / 1000).toFixed(0)}K`,
                dateApplied: appliedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                daysAgo,
                status: statusMap[r.applicationStatus] || "Pending",
                matchScore: 0,
                resumeUsed: r.resumeUrl ? "Resume" : "",
                coverLetterAttached: !!r.coverLetterUrl,
                timeline: [
                    {
                        title: "Application Submitted",
                        description: `Successfully sent to ${companyName}`,
                        date: appliedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                        icon: "send" as const,
                    },
                ],
                jobSummary: r.description?.substring(0, 200) || "",
                requiredSkills: r.requiredSkills || [],
            };
        });

        // Calculate stats
        const stats = {
            total: mapped.length,
            pending: mapped.filter((a) => a.status === "Pending").length,
            reviewed: mapped.filter((a) => a.status === "Reviewed").length,
            rejected: mapped.filter((a) => a.status === "Rejected").length,
        };

        return { success: true, applications: mapped, stats };
    } catch (error) {
        console.error("Error fetching user applications:", error);
        return { error: "Failed to fetch applications" };
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


        let recommendedJobs: any[] = [];

        if (keywords.length > 0) {

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


        }

        // If no jobs found or no keywords, use mix fallback
        if (recommendedJobs.length === 0) {

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


            // Fill up with general recent jobs if needed (up to 10 total)
            if (recommendedJobs.length < 10) {
                const existingIds = recommendedJobs.map(j => j.id);


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
