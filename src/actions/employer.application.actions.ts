"use server";

import { db } from "@/lib/db/db";
import { applications, jobs, users, seekerProfiles } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { auth } from "@/auth";

export async function getEmployerJobsAction() {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        const employerJobs = await db
            .select({
                id: jobs.id,
                title: jobs.title,
                status: jobs.status,
                createdAt: jobs.createdAt,
            })
            .from(jobs)
            .where(eq(jobs.employerId, session.user.id))
            .orderBy(desc(jobs.createdAt));

        return { data: employerJobs };
    } catch (error) {
        console.error("Failed to fetch employer jobs:", error);
        return { error: "Failed to fetch jobs" };
    }
}

export async function getEmployerApplicationsAction(params: {
    jobId?: string;
    status?: string;
    searchQuery?: string;
}) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        let conditions = [eq(jobs.employerId, session.user.id)];

        if (params.jobId && params.jobId !== "all") {
            conditions.push(eq(applications.jobId, params.jobId));
        }

        if (params.status && params.status !== "All") {
            const statusMap: Record<string, any> = {
                "Shortlisted": "SHORTLISTED",
                "In Review": "IN_REVIEW",
                "Interview": "INTERVIEW",
                "Rejected": "REJECTED"
            };
            const dbStatus = statusMap[params.status];
            if (dbStatus) {
                conditions.push(eq(applications.applicationStatus, dbStatus));
            }
        }

        const query = db
            .select({
                id: applications.id,
                jobId: applications.jobId,
                status: applications.applicationStatus,
                date: applications.applicationDate,
                applicant: {
                    id: users.id,
                    name: seekerProfiles.fullName,
                    email: users.email,
                    position: seekerProfiles.position,
                    experience: seekerProfiles.totalExperienceYears,
                },
                jobTitle: jobs.title,
            })
            .from(applications)
            .innerJoin(jobs, eq(applications.jobId, jobs.id))
            .innerJoin(users, eq(applications.applicantId, users.id))
            .innerJoin(seekerProfiles, eq(seekerProfiles.userId, users.id))
            .where(and(...conditions))
            .orderBy(desc(applications.applicationDate));

        const [result, countsResult] = await Promise.all([
            query,
            db
                .select({
                    status: applications.applicationStatus,
                    count: sql<number>`count(*)`
                })
                .from(applications)
                .innerJoin(jobs, eq(applications.jobId, jobs.id))
                .where(and(
                    eq(jobs.employerId, session.user.id),
                    params.jobId && params.jobId !== "all" ? eq(applications.jobId, params.jobId) : sql`true`
                ))
                .groupBy(applications.applicationStatus)
        ]);

        const counts: Record<string, number> = {
            "All": 0,
            "Shortlisted": 0,
            "In Review": 0,
            "Interview": 0,
            "Rejected": 0
        };

        let total = 0;
        countsResult.forEach(row => {
            const count = Number(row.count);
            total += count;
            if (row.status === "SHORTLISTED") counts["Shortlisted"] = count;
            if (row.status === "IN_REVIEW") counts["In Review"] = count;
            if (row.status === "INTERVIEW") counts["Interview"] = count;
            if (row.status === "REJECTED") counts["Rejected"] = count;
            if (row.status === "PENDING") counts["In Review"] += count; // Map pending to in review
        });
        counts["All"] = total;

        const formatted = result.map(app => {
            const initials = app.applicant.name
                ? app.applicant.name
                    .split(" ")
                    .map(n => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "U";

            return {
                id: app.id,
                initials: initials,
                name: app.applicant.name || "Unknown Applicant",
                email: app.applicant.email || "",
                position: app.applicant.position || "Candidate",
                jobId: app.jobId,
                jobTitle: app.jobTitle,
                experience: `${app.applicant.experience || 0} years`,
                status: app.status.replace("_", " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
                date: new Date(app.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                }),
                noticePeriod: "IMMEDIATE",
            };
        });

        return { data: formatted, counts };
    } catch (error) {
        console.error("Failed to fetch employer applications:", error);
        return { error: "Failed to fetch applications" };
    }
}
