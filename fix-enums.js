const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function fixEnums() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log("Connected to database.");

        // Attempt to add new values to application_status enum
        const appStatuses = ["SHORTLISTED", "IN_REVIEW", "INTERVIEW"];
        for (const status of appStatuses) {
            try {
                await client.query(`ALTER TYPE application_status ADD VALUE IF NOT EXISTS '${status}'`);
                console.log(`Added ${status} to application_status`);
            } catch (e) {
                console.log(`Could not add ${status}: ${e.message}`);
            }
        }

        // Attempt to add APPROVED to verification_status
        try {
            await client.query(`ALTER TYPE verification_status ADD VALUE IF NOT EXISTS 'APPROVED'`);
            console.log(`Added APPROVED to verification_status`);
        } catch (e) {
            console.log(`Could not add APPROVED: ${e.message}`);
        }

        console.log("Enum fix attempt complete.");
    } catch (error) {
        console.error("Connection error:", error);
    } finally {
        await client.end();
    }
}

fixEnums();
