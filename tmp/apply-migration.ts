import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function migrate() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log('Connected to database');

        // Check if value already exists to avoid error on retry
        const checkResult = await client.query(`
            SELECT e.enumlabel 
            FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid 
            WHERE t.typname = 'gender' AND e.enumlabel = 'ANY';
        `);

        if (checkResult.rows.length === 0) {
            console.log("Adding 'ANY' to gender enum...");
            await client.query('ALTER TYPE "gender" ADD VALUE \'ANY\'');
            console.log("Successfully added 'ANY' to gender enum");
        } else {
            console.log("'ANY' already exists in gender enum");
        }

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

migrate();
