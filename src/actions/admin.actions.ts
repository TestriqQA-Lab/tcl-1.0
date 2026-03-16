"use server";

import { db } from "@/lib/db/db";
import { users, employerProfiles, seekerProfiles, jobs, applications } from "@/lib/db/schema";
import { eq, desc, sql, count } from "drizzle-orm";
import { auth } from "@/auth";

/**
 * Fetches all employer profiles for administrative view.
 * Joins with the users table to get account email.
 */
export async function getAllEmployerProfilesAction() {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return { error: "Unauthorized. Admin access required." };
        }

        const profiles = await db
            .select({
                id: employerProfiles.id,
                userId: employerProfiles.userId,
                name: employerProfiles.fullName,
                companyName: employerProfiles.companyName,
                companyIndustry: employerProfiles.companyIndustry,
                email: users.email,
                status: employerProfiles.verificationStatus,
                logoUrl: employerProfiles.companyLogo,
                createdAt: employerProfiles.createdAt,
            })
            .from(employerProfiles)
            .innerJoin(users, eq(employerProfiles.userId, users.id))
            .orderBy(desc(employerProfiles.createdAt));

        return { success: true, data: profiles };
    } catch (error) {
        console.error("Failed to fetch all employer profiles:", error);
        return { error: "Failed to fetch employer profiles. Please try again." };
    }
}

/**
 * Fetches detailed employer profile by ID for administrative view.
 */
export async function getEmployerProfileDetailAction(profileId: string) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return { error: "Unauthorized. Admin access required." };
        }

        const profile = await db
            .select({
                id: employerProfiles.id,
                userId: employerProfiles.userId,
                fullName: employerProfiles.fullName,
                companyName: employerProfiles.companyName,
                companyIndustry: employerProfiles.companyIndustry,
                companyLocation: employerProfiles.companyLocation,
                companyWebsite: employerProfiles.companyWebsite,
                companySize: employerProfiles.companySize,
                companyDescription: employerProfiles.companyDescription,
                email: users.email,
                phoneNumber: users.phoneNumber,
                status: employerProfiles.verificationStatus,
                logoUrl: employerProfiles.companyLogo,
                createdAt: employerProfiles.createdAt,
                accountStatus: users.accountStatus,
                // Verification docs
                tempStaffingDocumentType: employerProfiles.tempStaffingDocumentType,
                tempStaffingDocumentUrl: employerProfiles.tempStaffingDocumentUrl,
                personalDocumentType: employerProfiles.personalDocumentType,
                personalDocumentUrl: employerProfiles.personalDocumentUrl,
                companyDocumentType: employerProfiles.companyDocumentType,
                companyDocumentUrl: employerProfiles.companyDocumentUrl,
            })
            .from(employerProfiles)
            .innerJoin(users, eq(employerProfiles.userId, users.id))
            .where(eq(employerProfiles.id, profileId))
            .limit(1);

        if (profile.length === 0) {
            return { error: "Employer profile not found." };
        }

        const employerData = profile[0];

        // Fetch Performance Metrics
        const [jobStats] = await db
            .select({
                totalJobs: sql<number>`cast(count(${jobs.id}) as int)`,
                activeJobs: sql<number>`cast(count(CASE WHEN ${jobs.status} = 'OPEN' THEN 1 END) as int)`,
            })
            .from(jobs)
            .where(eq(jobs.employerId, employerData.userId));

        const [appStats] = await db
            .select({
                totalApplications: sql<number>`cast(count(${applications.id}) as int)`,
                acceptedApplications: sql<number>`cast(count(CASE WHEN ${applications.applicationStatus} = 'ACCEPTED' THEN 1 END) as int)`,
            })
            .from(applications)
            .innerJoin(jobs, eq(applications.jobId, jobs.id))
            .where(eq(jobs.employerId, employerData.userId));

        const totalApplications = Number(appStats?.totalApplications || 0);
        const acceptedApplications = Number(appStats?.acceptedApplications || 0);
        const hireRate = totalApplications > 0 ? Math.round((acceptedApplications / totalApplications) * 100) : 0;

        return {
            success: true,
            data: {
                ...employerData,
                performance: {
                    totalJobs: Number(jobStats?.totalJobs || 0),
                    activeJobs: Number(jobStats?.activeJobs || 0),
                    applications: totalApplications,
                    hireRate: hireRate,
                },
            },
        };
    } catch (error) {
        console.error("Failed to fetch employer profile detail:", error);
        return { error: "Failed to fetch employer profile detail. Please try again." };
    }
}

/**
 * Fetches all seeker profiles for administrative view.
 */
export async function getAllSeekerProfilesAction() {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return { error: "Unauthorized. Admin access required." };
        }

        const profiles = await db
            .select({
                id: seekerProfiles.id,
                userId: seekerProfiles.userId,
                fullName: seekerProfiles.fullName,
                position: seekerProfiles.position,
                email: users.email,
                phoneNumber: users.phoneNumber,
                currentLocation: seekerProfiles.currentLocation,
                profilePicture: users.profilePicture,
                createdAt: seekerProfiles.createdAt,
            })
            .from(seekerProfiles)
            .innerJoin(users, eq(seekerProfiles.userId, users.id))
            .orderBy(desc(seekerProfiles.createdAt));

        return { success: true, data: profiles };
    } catch (error) {
        console.error("Failed to fetch all seeker profiles:", error);
        return { error: "Failed to fetch seeker profiles. Please try again." };
    }
}

/**
 * Fetches job postings for administrative view, optionally filtered by status.
 * Also returns counts for each status.
 */
export async function getAllJobsAction(status?: "OPEN" | "PAUSED" | "CLOSED") {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return { error: "Unauthorized. Admin access required." };
        }

        // Fetch filtered jobs
        let query = db
            .select({
                id: jobs.id,
                title: jobs.title,
                companyName: employerProfiles.companyName,
                createdAt: jobs.createdAt,
                status: jobs.status,
                applicationsCount: sql<number>`cast(count(${applications.id}) as int)`,
            })
            .from(jobs)
            .innerJoin(employerProfiles, eq(jobs.employerId, employerProfiles.userId))
            .leftJoin(applications, eq(jobs.id, applications.jobId));

        if (status) {
            // @ts-ignore - query type changes between select and where
            query = query.where(eq(jobs.status, status));
        }

        const filteredJobs = await query
            .groupBy(jobs.id, employerProfiles.companyName)
            .orderBy(desc(jobs.createdAt));

        // Fetch counts for all statuses
        const counts = await db
            .select({
                status: jobs.status,
                count: sql<number>`cast(count(${jobs.id}) as int)`,
            })
            .from(jobs)
            .groupBy(jobs.status);

        const statusCounts = {
            OPEN: 0,
            PAUSED: 0,
            CLOSED: 0,
        };

        counts.forEach((c) => {
            if (c.status === "OPEN" || c.status === "PAUSED" || c.status === "CLOSED") {
                statusCounts[c.status] = c.count;
            }
        });

        return {
            success: true,
            data: {
                jobs: filteredJobs,
                counts: statusCounts,
            },
        };
    } catch (error) {
        console.error("Failed to fetch jobs:", error);
        return { error: "Failed to fetch jobs. Please try again." };
    }
}

/**
 * Fetches summary statistics for the admin dashboard.
 */
export async function getAdminDashboardStatsAction() {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return { error: "Unauthorized. Admin access required." };
        }

        const [employerCount] = await db.select({ count: count(employerProfiles.userId) }).from(employerProfiles);
        const [seekerCount] = await db.select({ count: count(seekerProfiles.userId) }).from(seekerProfiles);
        const [jobCount] = await db.select({ count: count(jobs.id) }).from(jobs);

        return {
            success: true,
            data: {
                employers: Number(employerCount.count),
                seekers: Number(seekerCount.count),
                jobs: Number(jobCount.count),
            },
        };
    } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        return { error: "Failed to fetch dashboard statistics. Please try again." };
    }
}

/**
 * Updates the verification status of an employer.
 */
export async function updateEmployerVerificationStatusAction(
    employerUserId: string,
    status: "VERIFIED" | "REJECTED" | "PENDING" | "UNVERIFIED"
) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return { error: "Unauthorized. Admin access required." };
        }

        await db
            .update(employerProfiles)
            .set({
                verificationStatus: status,
                updatedAt: new Date(),
            })
            .where(eq(employerProfiles.userId, employerUserId));

        return { success: true };
    } catch (error) {
        console.error("Failed to update verification status:", error);
        return { error: "Failed to update verification status. Please try again." };
    }
}

/**
 * Fetches job postings for the admin approval dashboard.
 * Filtered by approval status and includes counts for badges.
 */
export async function getJobApprovalsAction(status: "PENDING" | "APPROVED" | "REJECTED") {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return { error: "Unauthorized. Admin access required." };
        }

        // Fetch filtered jobs
        const filteredJobs = await db
            .select({
                id: jobs.id,
                role: jobs.title,
                company: employerProfiles.companyName,
                dateSubmitted: jobs.createdAt,
                status: jobs.approvalStatus,
            })
            .from(jobs)
            .innerJoin(employerProfiles, eq(jobs.employerId, employerProfiles.userId))
            .where(eq(jobs.approvalStatus, status))
            .orderBy(desc(jobs.createdAt));

        // Fetch counts for each approval status
        const counts = await db
            .select({
                status: jobs.approvalStatus,
                count: sql<number>`cast(count(${jobs.id}) as int)`,
            })
            .from(jobs)
            .groupBy(jobs.approvalStatus);

        const statusCounts = {
            PENDING: 0,
            APPROVED: 0,
            REJECTED: 0,
        };

        counts.forEach((c) => {
            if (c.status) {
                statusCounts[c.status as keyof typeof statusCounts] = c.count;
            }
        });

        return {
            success: true,
            data: {
                jobs: filteredJobs,
                counts: statusCounts,
            },
        };
    } catch (error) {
        console.error("Failed to fetch job approvals:", error);
        return { error: "Failed to fetch job approvals. Please try again." };
    }
}

/**
 * Updates the approval status of a job posting.
 * Only accessible by ADMIN role.
 */
export async function updateJobApprovalStatusAction(
    jobId: string,
    newStatus: "PENDING" | "APPROVED" | "REJECTED",
    rejectionReason?: string
) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return { error: "Unauthorized. Admin access required." };
        }

        const { revalidatePath } = await import("next/cache");

        await db
            .update(jobs)
            .set({
                approvalStatus: newStatus,
                rejectionReason: newStatus === "REJECTED" ? rejectionReason : null,
                updatedAt: new Date(),
            })
            .where(eq(jobs.id, jobId));

        revalidatePath("/admin-dashboard/job-approvals");
        return { success: true };
    } catch (error) {
        console.error("Failed to update job approval status:", error);
        return { error: "Failed to update job approval status. Please try again." };
    }
}

/**
 * Fetches full job details for admin review.
 */
export async function getJobDetailAction(jobId: string) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return { error: "Unauthorized. Admin access required." };
        }

        const jobDetail = await db
            .select({
                job: jobs,
                employer: {
                    companyName: employerProfiles.companyName,
                    companyIndustry: employerProfiles.companyIndustry,
                    companyLogo: employerProfiles.companyLogo,
                    companyDescription: employerProfiles.companyDescription,
                }
            })
            .from(jobs)
            .innerJoin(employerProfiles, eq(jobs.employerId, employerProfiles.userId))
            .where(eq(jobs.id, jobId))
            .limit(1);

        if (jobDetail.length === 0) {
            return { error: "Job posting not found." };
        }

        return {
            success: true,
            data: jobDetail[0]
        };
    } catch (error) {
        console.error("Failed to fetch job detail:", error);
        return { error: "Failed to fetch job detail. Please try again." };
    }
}
