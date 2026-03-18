import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq } from "drizzle-orm";
import { jobs } from "../src/lib/db/schema";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema: { jobs } });

async function forceUpdate() {
    const ids = [
        '407d9b93-54cd-4e8c-859a-1c881079d8c9',
        '16d26cd7-561b-4395-8889-4da4b46c9cae',
        '4591781b-5611-460b-ae9e-13c5885078c5',
        'f210e4a7-86c8-47a4-bb4b-ec3694f483b8'
    ];
    try {
        for (const id of ids) {
            console.log(`Updating ${id}...`);
            await db.update(jobs)
                .set({ approvalStatus: 'PENDING' })
                .where(eq(jobs.id, id));
            console.log(`Updated.`);
        }
    } catch (error) {
        console.error("Error:", error);
    }
    await pool.end();
    process.exit(0);
}

forceUpdate();
