import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./src/lib/db/db";
import { users } from "./src/lib/db/schema";
import { eq } from "drizzle-orm";

async function check() {
    const targetEmail = 'employer53@bluehorizonsgroup.com';
    const result = await db.select().from(users).where(eq(users.email, targetEmail)).limit(1);
    
    if (result.length > 0) {
        console.log("✅ User Found:");
        console.log(JSON.stringify(result[0], null, 2));
    } else {
        console.log("❌ User NOT Found in DB.");
        const allUsers = await db.select().from(users).where(eq(users.userRole, "EMPLOYER")).limit(5);
        console.log("Samples of existing employers:");
        console.log(JSON.stringify(allUsers.map(u => u.email), null, 2));
    }
    process.exit(0);
}

check().catch(err => {
    console.error(err);
    process.exit(1);
});
