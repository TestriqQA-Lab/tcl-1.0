import { config } from "dotenv";
config({ path: ".env.local" });

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../src/lib/db/schema";
import { eq } from "drizzle-orm";

const { users, employerProfiles } = schema;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});
const db = drizzle(pool, { schema });

async function reset() {
    const targetEmail = 'employer53@zenithsystemsgroup.com';
    
    // 1. Find user ID
    const user = await db.select({ id: users.id }).from(users).where(eq(users.email, targetEmail)).limit(1);
    
    if (user.length === 0) {
        console.log("❌ User not found.");
        process.exit(1);
    }

    const userId = user[0].id;

    // 2. Reset verification status
    await db.update(employerProfiles)
        .set({ verificationStatus: "UNVERIFIED" })
        .where(eq(employerProfiles.userId, userId));

    console.log(`✅ Successfully reset verification status for ${targetEmail} to UNVERIFIED.`);
    process.exit(0);
}

reset().catch(err => {
    console.error(err);
    process.exit(1);
});
