import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql, eq, desc } from "drizzle-orm";
import * as dotenv from "dotenv";
import * as path from "path";
import { jobs, applications } from "../src/lib/db/schema";

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function debugQuery() {
    const employerId = "f8624b23-0361-4871-beda-69af4beb363b";
    console.log("Running debug query for employer:", employerId);
    try {
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
            .groupBy(jobs.id)
            .orderBy(desc(jobs.createdAt));
        
        console.log("Query success! Found", results.length, "jobs.");
    } catch (error: any) {
        console.error("Query failed!");
        console.dir(error, { depth: null });
    }
    await pool.end();
    process.exit(0);
}

debugQuery();
