/**
 * Seed Script: Resets the development database
 * 
 * This script:
 * 1. Connects to the dev database using DATABASE_URL from .env.local
 * 2. Drops ALL tables (cascade) to remove data + foreign key constraints
 * 3. Drops ALL custom enums
 * 4. Logs progress for each step
 * 
 * After running this, run `npx drizzle-kit push --force` to recreate the schema.
 * 
 * Usage: npx tsx scripts/seed-reset.ts
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL not found in .env.local");
    process.exit(1);
}

// All tables in the correct drop order (children first, parents last)
const TABLES = [
    "otp_tokens",
    "password_reset_tokens",
    "applications",
    "achievements",
    "projects",
    "languages",
    "certifications",
    "skills",
    "experience",
    "education",
    "jobs",
    "employer_profiles",
    "seeker_profiles",
    "users",
];

// All custom enums defined in the schema
const ENUMS = [
    "user_role",
    "account_status",
    "job_type",
    "job_status",
    "application_status",
    "job_approval_status",
    "employer_account_type",
    "hiring_for",
    "company_size",
    "verification_status",
    "gender",
    "work_status",
    "looking_for",
    "employment_status",
    "notice_period",
    "preferred_work_type",
    "proficiency_level",
];

async function resetDatabase() {
    const pool = new Pool({ connectionString: DATABASE_URL });

    console.log("\n🔄 Starting database reset...\n");
    console.log(`📡 Database: ${DATABASE_URL?.replace(/\/\/.*@/, "//***@")}\n`);

    try {
        const client = await pool.connect();

        // Step 1: Drop all tables
        console.log("── Step 1: Dropping tables ──\n");
        for (const table of TABLES) {
            try {
                await client.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
                console.log(`  ✅ Dropped table: ${table}`);
            } catch (err: any) {
                console.log(`  ⚠️  Table ${table}: ${err.message}`);
            }
        }

        // Step 2: Drop all custom enums
        console.log("\n── Step 2: Dropping enums ──\n");
        for (const enumName of ENUMS) {
            try {
                await client.query(`DROP TYPE IF EXISTS "${enumName}" CASCADE`);
                console.log(`  ✅ Dropped enum: ${enumName}`);
            } catch (err: any) {
                console.log(`  ⚠️  Enum ${enumName}: ${err.message}`);
            }
        }

        // Step 3: Verify clean state
        console.log("\n── Step 3: Verifying clean state ──\n");
        const tablesResult = await client.query(`
            SELECT tablename FROM pg_tables 
            WHERE schemaname = 'public'
        `);
        const enumsResult = await client.query(`
            SELECT typname FROM pg_type 
            WHERE typtype = 'e' AND typnamespace = (
                SELECT oid FROM pg_namespace WHERE nspname = 'public'
            )
        `);

        if (tablesResult.rows.length === 0 && enumsResult.rows.length === 0) {
            console.log("  ✅ Database is completely clean!\n");
        } else {
            if (tablesResult.rows.length > 0) {
                console.log(`  ⚠️  Remaining tables: ${tablesResult.rows.map(r => r.tablename).join(", ")}`);
            }
            if (enumsResult.rows.length > 0) {
                console.log(`  ⚠️  Remaining enums: ${enumsResult.rows.map(r => r.typname).join(", ")}`);
            }
            console.log("");
        }

        client.release();

        console.log("🎉 Database reset complete!\n");
        console.log("Next step: Run the following to recreate the schema:");
        console.log("  npx drizzle-kit push --force\n");

    } catch (error) {
        console.error("❌ Database reset failed:", error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

resetDatabase();
