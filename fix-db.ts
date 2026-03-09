import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { sql } from "drizzle-orm";

async function main() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    await client.connect();
    const db = drizzle(client);

    console.log("Adding columns to 'jobs' table...");
    try {
        await db.execute(sql`
            ALTER TABLE "jobs" 
            ADD COLUMN IF NOT EXISTS "work_experience_min" integer,
            ADD COLUMN IF NOT EXISTS "work_experience_max" integer,
            ADD COLUMN IF NOT EXISTS "monthly_salary_min" integer,
            ADD COLUMN IF NOT EXISTS "monthly_salary_max" integer,
            ADD COLUMN IF NOT EXISTS "perks_and_benefits" text[] DEFAULT '{}'::text[],
            ADD COLUMN IF NOT EXISTS "candidate_location_requirement" text,
            ADD COLUMN IF NOT EXISTS "candidate_education_level" text,
            ADD COLUMN IF NOT EXISTS "preferred_candidate_gender" "gender",
            ADD COLUMN IF NOT EXISTS "screening_experience_min" integer,
            ADD COLUMN IF NOT EXISTS "screening_education_level" text,
            ADD COLUMN IF NOT EXISTS "screening_english_level" text,
            ADD COLUMN IF NOT EXISTS "job_responsibilities_text" text,
            ADD COLUMN IF NOT EXISTS "about_company" text,
            ADD COLUMN IF NOT EXISTS "allow_calls" boolean DEFAULT false,
            ADD COLUMN IF NOT EXISTS "recruiter_name" text,
            ADD COLUMN IF NOT EXISTS "recruiter_contact" text,
            ADD COLUMN IF NOT EXISTS "call_time_from" text,
            ADD COLUMN IF NOT EXISTS "call_time_to" text,
            ADD COLUMN IF NOT EXISTS "call_days" text;
        `);
        console.log("Migration successful!");
    } catch (e: any) {
        console.error("Migration failed:", e.message);
    } finally {
        await client.end();
        process.exit(0);
    }
}

main();
