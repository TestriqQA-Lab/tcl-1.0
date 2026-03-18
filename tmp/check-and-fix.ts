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

async function fix() {
    try {
        console.log("Checking for jobs with NULL approval_status...");
        const selectResult = await db.execute(sql`SELECT id FROM jobs WHERE approval_status IS NULL;`);
        console.log("Found:", selectResult.rows.length);

        if (selectResult.rows.length > 0) {
            console.log("Updating...");
            const updateResult = await db.execute(sql`UPDATE jobs SET approval_status = 'PENDING' WHERE approval_status IS NULL;`);
            console.log("Updated rows:", updateResult.rowCount);
        } else {
            console.log("No rows to update.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
    await pool.end();
    process.exit(0);
}

fix();
