import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./src/lib/db/schema";
import * as fs from "fs";

async function main() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });
    const db = drizzle(pool, { schema });

    let output = "";

    output += "--- USERS ---\n";
    try {
        const allUsers = await db.select().from(schema.users);
        output += `Total Users: ${allUsers.length}\n`;
        for (const u of allUsers) {
            output += `- ID: ${u.id} | Email: ${u.email} | Role: ${u.userRole}\n`;
        }

        output += "--- SEEKER PROFILES ---\n";
        const allProfiles = await db.select().from(schema.seekerProfiles);
        output += `Total Profiles: ${allProfiles.length}\n`;
        for (const p of allProfiles) {
            output += `- Profile ID: ${p.id} | User ID: ${p.userId} | Name: ${p.fullName}\n`;
        }
    } catch (e: any) {
        output += `Error querying DB: ${e.message}\n`;
    } finally {
        await pool.end();
        fs.writeFileSync("db-results.txt", output);
        console.log("Results written to db-results.txt");
    }
}

main();
