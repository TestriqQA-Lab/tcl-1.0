/**
 * One-time script to create the admin user in the database.
 * Run with: npx tsx scripts/create-admin.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

// Import schema
import { users } from "../src/lib/db/schema";

async function main() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });
    const db = drizzle(pool, { schema: { users } });

    const adminEmail = "admin@tcl.com";
    const adminPassword = "adminTCL1234";

    // Check if admin already exists
    const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, adminEmail))
        .limit(1);

    if (existing.length > 0) {
        console.log("✅ Admin user already exists. Updating password...");
        const hashedPassword = await hash(adminPassword, 10);
        await db
            .update(users)
            .set({ password: hashedPassword, userRole: "ADMIN" })
            .where(eq(users.email, adminEmail));
        console.log("✅ Admin password updated successfully.");
    } else {
        console.log("Creating admin user...");
        const hashedPassword = await hash(adminPassword, 10);
        await db.insert(users).values({
            email: adminEmail,
            password: hashedPassword,
            username: "superadmin",
            userRole: "ADMIN",
            provider: "credentials",
            isVerified: true,
            accountStatus: "ACTIVE",
        });
        console.log("✅ Admin user created successfully!");
    }

    console.log(`   Email: ${adminEmail}`);
    console.log(`   Role: ADMIN`);

    await pool.end();
    process.exit(0);
}

main().catch((err) => {
    console.error("❌ Failed to create admin user:", err);
    process.exit(1);
});
