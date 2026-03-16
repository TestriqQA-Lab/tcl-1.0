import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function verify() {
    try {
        const result = await db.execute(sql`SELECT rejection_reason FROM jobs LIMIT 1;`);
        console.log("Column exists.");
    } catch (error) {
        console.log("Column does not exist.");
        // console.error(error);
    }
    await pool.end();
    process.exit(0);
}

verify();
