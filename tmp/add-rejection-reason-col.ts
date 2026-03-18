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

async function runMigration() {
    console.log("Adding rejection_reason column to jobs table...");
    try {
        await db.execute(sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS rejection_reason TEXT;`);
        console.log("Successfully added rejection_reason column.");
    } catch (error) {
        console.error("Error adding rejection_reason column:", error);
    }
    await pool.end();
    process.exit(0);
}

runMigration();
