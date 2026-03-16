import { pgTable, text, timestamp, uuid, pgEnum, integer, boolean, date, index } from "drizzle-orm/pg-core";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { db } from "./src/lib/db/db";
import { sql } from "drizzle-orm";

async function checkEnums() {
    try {
        const enums = await db.execute(sql`
            SELECT t.typname AS enum_name, e.enumlabel AS enum_value
            FROM pg_type t
            JOIN pg_enum e ON t.oid = e.enumtypid
            WHERE t.typname IN ('application_status', 'verification_status')
            ORDER BY t.typname, e.enumsortorder;
        `);
        console.log("Current Enums in DB:", JSON.stringify(enums, null, 2));

        const jobCols = await db.execute(sql`
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'jobs';
        `);
        console.log("Jobs Table Columns:", JSON.stringify(jobCols, null, 2));
    } catch (error) {
        console.error("Error checking DB:", error);
    }
    process.exit(0);
}

checkEnums();
