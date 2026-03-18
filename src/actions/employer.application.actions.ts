"use server";

import { db } from "@/lib/db/db";
import { applications, jobs, users, seekerProfiles, education, languages } from "@/lib/db/schema";
import { eq, and, desc, sql, or, ilike, inArray } from "drizzle-orm";
import { auth } from "@/auth";

export async function getEmployerJobsAction() {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        const results = await db
            .select({
                id: jobs.id,
                title: jobs.title,
                status: jobs.status,
                createdAt: jobs.createdAt,
                applicantCount: sql<number>`count(${applications.id})::int`
            })
            .from(jobs)
            .leftJoin(applications, eq(jobs.id, applications.jobId))
            .where(eq(jobs.employerId, session.user.id))
            .groupBy(jobs.id)
            .orderBy(desc(jobs.createdAt));

        return { data: results };
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
            conditions.push(eq(jobs.id, params.jobId));
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

        if (params.searchQuery && params.searchQuery.trim()) {
            const query = `%${params.searchQuery.trim()}%`;
            conditions.push(or(
                ilike(seekerProfiles.fullName, query),
                ilike(users.email, query)
            ) as any);
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
                    phone: users.phoneNumber,
                    position: seekerProfiles.position,
                    experience: seekerProfiles.totalExperienceYears,
                    bio: seekerProfiles.bio,
                    resumeUrl: applications.resumeUrl,
                    noticePeriod: seekerProfiles.noticePeriod,
                    currentLocation: seekerProfiles.currentLocation,
                    preferredWorkLocation: seekerProfiles.preferredWorkLocation,
                },
                jobTitle: jobs.title,
                screeningExperienceMin: jobs.screeningExperienceMin,
                screeningEducationLevel: jobs.screeningEducationLevel,
                screeningEnglishLevel: jobs.screeningEnglishLevel,
                customScreeningQuestions: jobs.customScreeningQuestions,
                answers: applications.screeningAnswers,
            })
            .from(applications)
            .innerJoin(jobs, eq(applications.jobId, jobs.id))
            .innerJoin(users, eq(applications.applicantId, users.id))
            .leftJoin(seekerProfiles, eq(seekerProfiles.userId, users.id))
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
                .leftJoin(users, eq(applications.applicantId, users.id))
                .leftJoin(seekerProfiles, eq(seekerProfiles.userId, users.id))
                .where(and(...conditions))
                .groupBy(applications.applicationStatus)
        ]);

        // Fetch supplemental data for the applicants
        const applicantIds = result.map(app => app.applicant.id);
        
        let educationsMap: Record<string, any[]> = {};
        let languagesMap: Record<string, any[]> = {};

        if (applicantIds.length > 0) {
            const [educations, langs] = await Promise.all([
                db.select().from(education).where(inArray(education.userId, applicantIds)),
                db.select().from(languages).where(inArray(languages.userId, applicantIds))
            ]);

            educations.forEach(edu => {
                if (!educationsMap[edu.userId]) educationsMap[edu.userId] = [];
                educationsMap[edu.userId].push(edu);
            });

            langs.forEach(lang => {
                if (!languagesMap[lang.userId]) languagesMap[lang.userId] = [];
                languagesMap[lang.userId].push(lang);
            });
        }

        const counts: Record<string, number> = {
            "All": 0,
            "In Review": 0,
            "Shortlisted": 0,
            "Rejected": 0
        };

        let total = 0;
        countsResult.forEach(row => {
            const count = Number(row.count);
            total += count;
            if (row.status === "IN_REVIEW" || row.status === "PENDING") counts["In Review"] += count;
            if (row.status === "SHORTLISTED" || row.status === "INTERVIEW" || row.status === "ACCEPTED") counts["Shortlisted"] += count;
            if (row.status === "REJECTED") counts["Rejected"] = count;
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

            const applicantEducations = educationsMap[app.applicant.id] || [];
            const applicantLanguages = languagesMap[app.applicant.id] || [];

            const highestEducation = applicantEducations.length > 0
                ? applicantEducations.sort((a, b) => {
                    const types = ["Post Graduate", "Graduate", "Class XII", "Class X"];
                    const aIdx = types.indexOf(a.type);
                    const bIdx = types.indexOf(b.type);
                    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
                    return (b.endDate?.getTime() || 0) - (a.endDate?.getTime() || 0);
                })[0]?.type || "Not specified"
                : "Not specified";

            const englishProficiency = applicantLanguages.find(lang => 
                lang.languageName.toLowerCase() === "english"
            )?.speak || "Not specified";

            return {
                id: app.id,
                initials: initials,
                name: app.applicant.name || "Unknown Applicant",
                email: app.applicant.email,
                phone: app.applicant.phone,
                position: app.applicant.position || "Not specified",
                experience: app.applicant.experience ? `${app.applicant.experience} Years` : "Fresher",
                date: app.date ? new Date(app.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "N/A",
                status: app.status === "SHORTLISTED" ? "Shortlisted" :
                        app.status === "IN_REVIEW" || app.status === "PENDING" ? "In Review" :
                        app.status === "INTERVIEW" ? "Interview" :
                        app.status === "ACCEPTED" ? "Accepted" :
                        app.status === "REJECTED" ? "Rejected" : "Pending",
                bio: app.applicant.bio,
                resumeUrl: app.applicant.resumeUrl,
                jobTitle: app.jobTitle,
                noticePeriod: app.applicant.noticePeriod?.replace("_", " ") || "Immediate",
                location: app.applicant.currentLocation || "Not specified",
                preferredLocation: app.applicant.preferredWorkLocation ? app.applicant.preferredWorkLocation.join(", ") : "Anywhere",
                screeningQuestions: [
                    ...(app.screeningExperienceMin || app.applicant.experience ? [{
                        question: "Total Experience",
                        required: app.screeningExperienceMin ? `${app.screeningExperienceMin}+ Years` : "Any",
                        answer: app.applicant.experience ? `${app.applicant.experience} Years` : "Fresher"
                    }] : []),
                    ...(app.screeningEducationLevel || highestEducation !== "Not specified" ? [{
                        question: "Education Level",
                        required: app.screeningEducationLevel || "Any",
                        answer: highestEducation
                    }] : []),
                    ...(app.screeningEnglishLevel || englishProficiency !== "Not specified" ? [{
                        question: "English Proficiency",
                        required: app.screeningEnglishLevel || "Any",
                        answer: englishProficiency
                    }] : []),
                    ...((app.customScreeningQuestions as any[]) || []).map((cq: any) => {
                        let parsedAnswers = [];
                        try {
                            const parsed = app.answers ? JSON.parse(app.answers as string) : [];
                            if (Array.isArray(parsed)) parsedAnswers = parsed;
                        } catch (e) {
                            // Ignore parsing errors, default to empty array
                        }
                        const answerObj = parsedAnswers.find((a: any) => a.id === cq.id);
                        return {
                            question: cq.text,
                            required: cq.mandatory ? "Mandatory" : "Optional",
                            answer: answerObj ? answerObj.answer : "Not provided"
                        };
                    })
                ]
            };
        });

        return { data: formatted, counts };
    } catch (error) {
        console.error("Failed to fetch employer applications:", error);
        return { error: "Failed to fetch applications" };
    }
}

export async function updateApplicationStatusAction(applicationId: string, status: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        // Verify ownership (the application belongs to a job posted by this employer)
        const applicationRecord = await db.query.applications.findFirst({
            where: eq(applications.id, applicationId),
            with: {
                job: true
            }
        });

        if (!applicationRecord || (applicationRecord as any).job.employerId !== session.user.id) {
            return { error: "Application not found or unauthorized" };
        }

        const statusMap: Record<string, any> = {
            "Shortlisted": "SHORTLISTED",
            "In Review": "IN_REVIEW",
            "Interview": "INTERVIEW",
            "Rejected": "REJECTED",
            "Accepted": "ACCEPTED"
        };

        const dbStatus = statusMap[status];
        if (!dbStatus) return { error: "Invalid status" };

        await db
            .update(applications)
            .set({ applicationStatus: dbStatus, updatedAt: new Date() })
            .where(eq(applications.id, applicationId));

        return { success: true };
    } catch (error) {
        console.error("Failed to update application status:", error);
        return { error: "Failed to update status" };
    }
}

export async function getEmployerDashboardMetricsAction() {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        const [activeJobsCount] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(jobs)
            .where(and(
                eq(jobs.employerId, session.user.id),
                eq(jobs.status, "OPEN")
            ));

        const [totalApplicationsCount] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(applications)
            .innerJoin(jobs, eq(applications.jobId, jobs.id))
            .where(eq(jobs.employerId, session.user.id));

        return {
            data: {
                activeJobs: activeJobsCount?.count || 0,
                totalApplications: totalApplicationsCount?.count || 0
            }
        };
    } catch (error) {
        console.error("Failed to fetch dashboard metrics:", error);
        return { error: "Failed to fetch metrics" };
    }
}

export async function getRecentApplicationsAction() {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        const results = await db
            .select({
                id: applications.id,
                name: seekerProfiles.fullName,
                position: seekerProfiles.position,
                status: applications.applicationStatus,
                date: applications.applicationDate,
            })
            .from(applications)
            .innerJoin(jobs, eq(applications.jobId, jobs.id))
            .innerJoin(users, eq(applications.applicantId, users.id))
            .leftJoin(seekerProfiles, eq(seekerProfiles.userId, users.id))
            .where(eq(jobs.employerId, session.user.id))
            .orderBy(desc(applications.applicationDate))
            .limit(5);

        const formatted = results.map(app => {
            // Simple relative time or formatted date
            const date = new Date(app.date);
            const now = new Date();
            const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
            
            let timeStr = "";
            if (diffInHours < 24) {
                timeStr = diffInHours === 0 ? "Just now" : `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
            } else {
                const diffInDays = Math.floor(diffInHours / 24);
                timeStr = `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
            }

            return {
                name: app.name || "Unknown Applicant",
                position: app.position || "Candidate",
                status: app.status.replace("_", " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
                time: timeStr
            };
        });

        return { data: formatted };
    } catch (error) {
        console.error("Failed to fetch recent applications:", error);
        return { error: "Failed to fetch applications" };
    }
}
