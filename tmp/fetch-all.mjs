import pg from "pg";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});

const tables = [
    "users",
    "seeker_profiles",
    "employer_profiles",
    "jobs",
    "applications",
    "education",
    "experience",
    "skills",
    "certifications",
    "languages",
    "projects",
    "achievements",
    "password_reset_tokens",
];

// Check if otp_tokens exists
async function run() {
    const client = await pool.connect();
    let output = "";

    const log = (msg) => {
        output += msg + "\n";
    };

    try {
        // Check for otp_tokens table
        const tableCheck = await client.query(`
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' ORDER BY table_name
        `);
        log("=== ALL TABLES IN DATABASE ===");
        tableCheck.rows.forEach(r => log(`  - ${r.table_name}`));
        log("");

        // Query each table
        for (const table of tables) {
            try {
                const result = await client.query(`SELECT * FROM "${table}"`);
                log(`\n${"=".repeat(60)}`);
                log(`TABLE: ${table} (${result.rows.length} records)`);
                log("=".repeat(60));
                
                if (result.rows.length === 0) {
                    log("  (empty)");
                } else {
                    result.rows.forEach((row, i) => {
                        log(`\n  --- Record ${i + 1} ---`);
                        for (const [key, value] of Object.entries(row)) {
                            // Truncate long values
                            let displayVal = value;
                            if (typeof value === "string" && value.length > 100) {
                                displayVal = value.substring(0, 100) + "...";
                            }
                            if (Array.isArray(value)) {
                                displayVal = JSON.stringify(value);
                            }
                            log(`    ${key}: ${displayVal}`);
                        }
                    });
                }
            } catch (err) {
                log(`  ERROR querying ${table}: ${err.message}`);
            }
        }

        // Also try otp_tokens
        try {
            const otp = await client.query(`SELECT * FROM "otp_tokens"`);
            log(`\n${"=".repeat(60)}`);
            log(`TABLE: otp_tokens (${otp.rows.length} records)`);
            log("=".repeat(60));
            if (otp.rows.length === 0) log("  (empty)");
        } catch (e) {
            log(`\nTABLE: otp_tokens — does not exist or error: ${e.message}`);
        }

        // Summary
        log("\n\n=== SUMMARY ===");
        for (const table of tables) {
            try {
                const count = await client.query(`SELECT COUNT(*) FROM "${table}"`);
                log(`  ${table}: ${count.rows[0].count} records`);
            } catch (e) {
                log(`  ${table}: error`);
            }
        }

    } finally {
        client.release();
        await pool.end();
    }

    // Write to file (UTF-8)
    fs.writeFileSync("tmp/db-live-data.txt", output, "utf8");
    console.log("Done! Output written to tmp/db-live-data.txt");
}

run().catch(err => {
    console.error("Failed:", err.message);
    process.exit(1);
});
