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

async function updateNulls() {
    try {
        console.log("Updating jobs with NULL approval_status to 'PENDING'...");
        const result = await db.execute(sql`UPDATE jobs SET approval_status = 'PENDING' WHERE approval_status IS NULL;`);
        console.log("Updated rows:", result.rowCount);
    } catch (error) {
        console.error("Error updating jobs:", error);
    }
    await pool.end();
    process.exit(0);
}

updateNulls();
