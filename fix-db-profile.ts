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

    console.log("Adding Date columns to profile tables...");
    try {
        await db.execute(sql`
            -- education
            ALTER TABLE "education" 
            ADD COLUMN IF NOT EXISTS "start_date" date,
            ADD COLUMN IF NOT EXISTS "end_date" date;

            -- experience
            ALTER TABLE "experience" 
            ADD COLUMN IF NOT EXISTS "start_date" date,
            ADD COLUMN IF NOT EXISTS "end_date" date;

            -- certifications
            ALTER TABLE "certifications" 
            ADD COLUMN IF NOT EXISTS "issue_date" date,
            ADD COLUMN IF NOT EXISTS "expiry_date" date;

            -- projects
            ALTER TABLE "projects" 
            ADD COLUMN IF NOT EXISTS "start_date" date,
            ADD COLUMN IF NOT EXISTS "end_date" date;

            -- achievements
            ALTER TABLE "achievements" 
            ADD COLUMN IF NOT EXISTS "start_date" date,
            ADD COLUMN IF NOT EXISTS "end_date" date,
            ADD COLUMN IF NOT EXISTS "specific_date" date;

            -- seeker_profiles
            ALTER TABLE "seeker_profiles" 
            ADD COLUMN IF NOT EXISTS "date_of_birth" date;
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
