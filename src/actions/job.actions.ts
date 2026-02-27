"use server";

import { db } from "@/lib/db/db";
import { jobs, employerProfiles, users } from "@/lib/db/schema";
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
