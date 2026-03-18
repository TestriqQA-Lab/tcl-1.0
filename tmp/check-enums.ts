import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function fixEnums() {
    try {
        console.log("Adding 'REJECTED' to job_approval_status enum...");
        try {
            await db.execute(sql`ALTER TYPE job_approval_status ADD VALUE IF NOT EXISTS 'REJECTED';`);
            console.log("Success.");
        } catch (e) {
            console.log("Already exists or failed:", e);
        }

        console.log("Checking for jobs with invalid or NULL approval_status...");
        const invalidJobs = await db.execute(sql`SELECT id, approval_status, status FROM jobs WHERE approval_status IS NULL OR status IS NULL;`);
        console.log("Invalid/Missing jobs count:", invalidJobs.rows.length);
        if (invalidJobs.rows.length > 0) {
            console.log("Sample invalid jobs:", invalidJobs.rows);
        }

        console.log("Checking ALL distinct approval_status values in DB...");
        const allValues = await db.execute(sql`SELECT DISTINCT approval_status FROM jobs;`);
        console.log("Distinct values:", allValues.rows);
    } catch (error) {
        console.error("Error:", error);
    }
    await pool.end();
    process.exit(0);
}

fixEnums();
