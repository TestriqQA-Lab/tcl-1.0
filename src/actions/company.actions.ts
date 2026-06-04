"use server";

import { db } from "@/lib/db/db";
import { employerProfiles, jobs, users } from "@/lib/db/schema";
import { eq, sql, ilike, and, count, inArray, or } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export interface CompanyListItem {
    id: string;
    userId: string;
    companyName: string;
    companyLogo: string;
    companyDescription: string | null;
    companyIndustry: string | null;
    companyLocation: string | null;
    companySize: string | null;
    companyWebsite: string | null;
    verificationStatus: string;
    openJobsCount: number;
}

export interface CompanyFilters {
    search?: string;
    industry?: string;
    location?: string;
    companySize?: string;
    page?: number;
    pageSize?: number;
}

export interface CompaniesResult {
    companies: CompanyListItem[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface CompanyStats {
    totalCompanies: number;
    totalIndustries: number;
    totalOpenJobs: number;
}

export async function getCompanies(filters: CompanyFilters = {}): Promise<CompaniesResult> {
    const { search, industry, location, companySize, page = 1, pageSize = 12 } = filters;

    try {
        // Build conditions array
        const conditions = [];

        // Only show employers with company names
        conditions.push(sql`${employerProfiles.companyName} IS NOT NULL`);
        conditions.push(sql`${employerProfiles.companyName} != ''`);

        if (search) {
            conditions.push(
                sql`(${ilike(employerProfiles.companyName, `%${search}%`)} OR ${ilike(employerProfiles.companyIndustry, `%${search}%`)} OR ${ilike(employerProfiles.companyDescription, `%${search}%`)})`
            );
        }

        if (industry) {
            // Support comma-separated multi-select
            const industries = industry.split(",").map(i => i.trim()).filter(Boolean);
            if (industries.length === 1) {
                conditions.push(ilike(employerProfiles.companyIndustry, `%${industries[0]}%`));
            } else if (industries.length > 1) {
                conditions.push(
                    or(...industries.map(ind => ilike(employerProfiles.companyIndustry, `%${ind}%`)))!
                );
            }
        }

        if (location) {
            // Support comma-separated multi-select
            const locations = location.split(",").map(l => l.trim()).filter(Boolean);
            if (locations.length === 1) {
                conditions.push(ilike(employerProfiles.companyLocation, `%${locations[0]}%`));
            } else if (locations.length > 1) {
                conditions.push(
                    or(...locations.map(loc => ilike(employerProfiles.companyLocation, `%${loc}%`)))!
                );
            }
        }

        if (companySize) {
            conditions.push(eq(employerProfiles.companySize, companySize as any));
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Get total count
        const countResult = await db
            .select({ count: sql<number>`cast(count(*) as integer)` })
            .from(employerProfiles)
            .where(whereClause);

        const totalCount = countResult[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / pageSize);
        const offset = (page - 1) * pageSize;

        // Get companies with open job counts via subquery
        const companiesData = await db
            .select({
                id: employerProfiles.id,
                userId: employerProfiles.userId,
                companyName: employerProfiles.companyName,
                companyLogo: employerProfiles.companyLogo,
                companyDescription: employerProfiles.companyDescription,
                companyIndustry: employerProfiles.companyIndustry,
                companyLocation: employerProfiles.companyLocation,
                companySize: employerProfiles.companySize,
                companyWebsite: employerProfiles.companyWebsite,
                verificationStatus: employerProfiles.verificationStatus,
            })
            .from(employerProfiles)
            .where(whereClause)
            .orderBy(sql`${employerProfiles.companyName} ASC`)
            .limit(pageSize)
            .offset(offset);

        // Get job counts for these companies
        const userIds = companiesData.map(c => c.userId);
        let jobCounts: Record<string, number> = {};

        if (userIds.length > 0) {
            const jobCountsResult = await db
                .select({
                    employerId: jobs.employerId,
                    count: sql<number>`cast(count(*) as integer)`,
                })
                .from(jobs)
                .where(
                    and(
                        inArray(jobs.employerId, userIds),
                        eq(jobs.status, "OPEN"),
                        eq(jobs.approvalStatus, "APPROVED")
                    )
                )
                .groupBy(jobs.employerId);

            jobCounts = Object.fromEntries(
                jobCountsResult.map(r => [r.employerId, r.count])
            );
        }

        const companies: CompanyListItem[] = companiesData.map(c => ({
            id: c.id,
            userId: c.userId,
            companyName: c.companyName || "Unnamed Company",
            companyLogo: c.companyLogo || "",
            companyDescription: c.companyDescription,
            companyIndustry: c.companyIndustry,
            companyLocation: c.companyLocation,
            companySize: c.companySize,
            companyWebsite: c.companyWebsite,
            verificationStatus: c.verificationStatus,
            openJobsCount: jobCounts[c.userId] || 0,
        }));

        return {
            companies,
            totalCount,
            page,
            pageSize,
            totalPages,
        };
    } catch (error) {
        console.error("Error fetching companies:", error);
        return {
            companies: [],
            totalCount: 0,
            page: 1,
            pageSize,
            totalPages: 0,
        };
    }
}

const _getCompanyStats = async (): Promise<CompanyStats> => {
    try {
        const [companiesCount] = await db
            .select({ count: sql<number>`cast(count(*) as integer)` })
            .from(employerProfiles)
            .where(
                and(
                    sql`${employerProfiles.companyName} IS NOT NULL`,
                    sql`${employerProfiles.companyName} != ''`
                )
            );

        const industriesResult = await db
            .select({ industry: employerProfiles.companyIndustry })
            .from(employerProfiles)
            .where(
                and(
                    sql`${employerProfiles.companyIndustry} IS NOT NULL`,
                    sql`${employerProfiles.companyIndustry} != ''`
                )
            )
            .groupBy(employerProfiles.companyIndustry);

        const [openJobsCount] = await db
            .select({ count: sql<number>`cast(count(*) as integer)` })
            .from(jobs)
            .where(
                and(
                    eq(jobs.status, "OPEN"),
                    eq(jobs.approvalStatus, "APPROVED")
                )
            );

        return {
            totalCompanies: companiesCount?.count || 0,
            totalIndustries: industriesResult.length || 0,
            totalOpenJobs: openJobsCount?.count || 0,
        };
    } catch (error) {
        console.error("Error fetching company stats:", error);
        return { totalCompanies: 0, totalIndustries: 0, totalOpenJobs: 0 };
    }
};

// Cached version — revalidates every 5 minutes
export const getCompanyStats = unstable_cache(
    _getCompanyStats,
    ["company-stats"],
    { revalidate: 300, tags: ["companies"] }
);

const _getFeaturedCompanies = async (): Promise<CompanyListItem[]> => {
    try {
        // Get companies with most open approved jobs
        const topEmployers = await db
            .select({
                employerId: jobs.employerId,
                jobCount: sql<number>`cast(count(*) as integer)`,
            })
            .from(jobs)
            .where(
                and(
                    eq(jobs.status, "OPEN"),
                    eq(jobs.approvalStatus, "APPROVED")
                )
            )
            .groupBy(jobs.employerId)
            .orderBy(sql`count(*) DESC`)
            .limit(20);

        if (topEmployers.length === 0) {
            // Fallback: return any companies with names
            const fallback = await db
                .select({
                    id: employerProfiles.id,
                    userId: employerProfiles.userId,
                    companyName: employerProfiles.companyName,
                    companyLogo: employerProfiles.companyLogo,
                    companyDescription: employerProfiles.companyDescription,
                    companyIndustry: employerProfiles.companyIndustry,
                    companyLocation: employerProfiles.companyLocation,
                    companySize: employerProfiles.companySize,
                    companyWebsite: employerProfiles.companyWebsite,
                    verificationStatus: employerProfiles.verificationStatus,
                })
                .from(employerProfiles)
                .where(
                    and(
                        sql`${employerProfiles.companyName} IS NOT NULL`,
                        sql`${employerProfiles.companyName} != ''`
                    )
                )
                .limit(20);

            return fallback.map(c => ({
                id: c.id,
                userId: c.userId,
                companyName: c.companyName || "Unnamed Company",
                companyLogo: c.companyLogo || "",
                companyDescription: c.companyDescription,
                companyIndustry: c.companyIndustry,
                companyLocation: c.companyLocation,
                companySize: c.companySize,
                companyWebsite: c.companyWebsite,
                verificationStatus: c.verificationStatus,
                openJobsCount: 0,
            }));
        }

        const employerIds = topEmployers.map(e => e.employerId);
        const jobCountMap = Object.fromEntries(
            topEmployers.map(e => [e.employerId, e.jobCount])
        );

        const profilesData = await db
            .select({
                id: employerProfiles.id,
                userId: employerProfiles.userId,
                companyName: employerProfiles.companyName,
                companyLogo: employerProfiles.companyLogo,
                companyDescription: employerProfiles.companyDescription,
                companyIndustry: employerProfiles.companyIndustry,
                companyLocation: employerProfiles.companyLocation,
                companySize: employerProfiles.companySize,
                companyWebsite: employerProfiles.companyWebsite,
                verificationStatus: employerProfiles.verificationStatus,
            })
            .from(employerProfiles)
            .where(inArray(employerProfiles.userId, employerIds));

        return profilesData.map(c => ({
            id: c.id,
            userId: c.userId,
            companyName: c.companyName || "Unnamed Company",
            companyLogo: c.companyLogo || "",
            companyDescription: c.companyDescription,
            companyIndustry: c.companyIndustry,
            companyLocation: c.companyLocation,
            companySize: c.companySize,
            companyWebsite: c.companyWebsite,
            verificationStatus: c.verificationStatus,
            openJobsCount: jobCountMap[c.userId] || 0,
        }));
    } catch (error) {
        console.error("Error fetching featured companies:", error);
        return [];
    }
};

// Cached version — revalidates every 5 minutes
export const getFeaturedCompanies = unstable_cache(
    _getFeaturedCompanies,
    ["featured-companies"],
    { revalidate: 300, tags: ["companies"] }
);

export async function getDistinctIndustries(): Promise<string[]> {
    try {
        const result = await db
            .select({ industry: employerProfiles.companyIndustry })
            .from(employerProfiles)
            .where(
                and(
                    sql`${employerProfiles.companyIndustry} IS NOT NULL`,
                    sql`${employerProfiles.companyIndustry} != ''`
                )
            )
            .groupBy(employerProfiles.companyIndustry)
            .orderBy(employerProfiles.companyIndustry);

        return result.map(r => r.industry!).filter(Boolean);
    } catch (error) {
        console.error("Error fetching industries:", error);
        return [];
    }
}

export async function getDistinctLocations(): Promise<string[]> {
    try {
        const result = await db
            .select({ location: employerProfiles.companyLocation })
            .from(employerProfiles)
            .where(
                and(
                    sql`${employerProfiles.companyLocation} IS NOT NULL`,
                    sql`${employerProfiles.companyLocation} != ''`
                )
            )
            .groupBy(employerProfiles.companyLocation)
            .orderBy(employerProfiles.companyLocation);

        return result.map(r => r.location!).filter(Boolean);
    } catch (error) {
        console.error("Error fetching locations:", error);
        return [];
    }
}

import type { Company } from "@/data/company-mock";

export async function getCompanyProfileById(userId: string): Promise<Company | null> {
    try {
        const profileData = await db
            .select()
            .from(employerProfiles)
            .where(eq(employerProfiles.userId, userId))
            .limit(1);

        if (!profileData || profileData.length === 0) {
            return null;
        }

        const profile = profileData[0];

        const jobsData = await db
            .select({
                id: jobs.id,
                title: jobs.title,
                type: jobs.type,
                location: jobs.location,
                createdAt: jobs.createdAt
            })
            .from(jobs)
            .where(
                and(
                    eq(jobs.employerId, userId),
                    eq(jobs.status, "OPEN"),
                    eq(jobs.approvalStatus, "APPROVED")
                )
            )
            .orderBy(jobs.createdAt);

        const roles = jobsData.map(job => ({
            id: job.id,
            title: job.title,
            type: job.type.replace("_", "-").toLowerCase(),
            location: job.location,
            posted_at: new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        }));

        // Default fallbacks for missing db fields to keep UI looking premium
        const defaultPerks = [
            { label: "Flexible PTO", bg: "bg-[#0f766d]/10", text: "text-[#0f766d]", border: "border-[#0f766d]/20" },
            { label: "Health Insurance", bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-200" },
        ];

        let iconStr = "business";
        let initials = "CO";
        if (profile.companyName) {
            initials = profile.companyName.substring(0, 2).toUpperCase();
        }

        return {
            id: profile.userId,
            name: profile.companyName || "Unnamed Company",
            tagline: profile.companyIndustry ? `${profile.companyIndustry} in ${profile.companyLocation || "Global"}` : "Innovative Company",
            logo_bg: "bg-[#0f766d]/10", 
            logo_icon: iconStr,
            logo_url: profile.companyLogo || undefined, 
            location: profile.companyLocation || "Not specified",
            employees: profile.companySize || "Not specified",
            verified: profile.verificationStatus === "VERIFIED" || profile.verificationStatus === "APPROVED",
            about: profile.companyDescription ? profile.companyDescription.split('\n').filter(p => p.trim()) : ["No description available."],
            culture: [], 
            roles: roles,
            perks: defaultPerks,
            headquarters: {
                address: [profile.companyLocation || "Remote"],
                map_image: "",
                map_alt: "Map location"
            },
            website: profile.companyWebsite || "#",
            founded: "Not specified",
            socials: []
        };
    } catch (error) {
        console.error("Error fetching company profile by ID:", error);
        return null;
    }
}

