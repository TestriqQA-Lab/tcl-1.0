import { db } from '../src/lib/db/db';
import { jobs } from '../src/lib/db/schema';
import { sql } from 'drizzle-orm';

async function countJobs() {
    try {
        const count = await db.select({ count: sql<number>`count(*)` }).from(jobs);
        console.log(`Total jobs in database: ${count[0].count}`);

        const openJobs = await db.select({ count: sql<number>`count(*)` }).from(jobs).where(sql`${jobs.status} = 'OPEN'`);
        console.log(`Total OPEN jobs in database: ${openJobs[0].count}`);

    } catch (err) {
        console.error("Failed to count jobs:", err);
    }
    process.exit(0);
}

countJobs();
