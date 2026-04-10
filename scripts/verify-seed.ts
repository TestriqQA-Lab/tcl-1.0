import { config } from "dotenv";
config({ path: ".env.local" });

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../src/lib/db/schema";
const { seekerProfiles } = schema;

async function verify() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: true
    });
    const db = drizzle(pool, { schema });

    console.log("🔍 Verifying seeker profiles...");
    
    // Count all seeker profiles
    const count = await db.select().from(seekerProfiles);
    console.log(`Total seeker profiles in DB: ${count.length}`);

    // Sample 5 records from the Mumbai Western Line
    const sample = count.slice(-5);
    console.log("\nSample 5 records from the latest seed:");
    sample.forEach((p, i) => {
        console.log(`${i+1}. Name: ${p.fullName} | Location: ${p.currentLocation}`);
    });

    process.exit(0);
}

verify();
