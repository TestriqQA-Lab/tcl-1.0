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

async function check() {
    try {
        const result = await db.execute(sql`SELECT id, approval_status, status FROM jobs;`);
        console.log("Total jobs:", result.rows.length);
        const nullApprovals = result.rows.filter(r => r.approval_status === null);
        console.log("Jobs with NULL approval_status:", nullApprovals.length);
        if (nullApprovals.length > 0) {
            console.log("NULL IDs:", nullApprovals.map(r => r.id));
        }

        const distinctApprovals = [...new Set(result.rows.map(r => String(r.approval_status)))];
        console.log("Distinct approval_status values:", distinctApprovals);
    } catch (error) {
        console.error("Error:", error);
    }
    await pool.end();
    process.exit(0);
}

check();
