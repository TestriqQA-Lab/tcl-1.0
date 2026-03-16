import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function verify() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log('Connected to database');

        const result = await client.query(`
            SELECT e.enumlabel 
            FROM pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid 
            WHERE t.typname = 'gender';
        `);

        console.log('Gender enum values:', result.rows.map(r => r.enumlabel));

        if (result.rows.some(r => r.enumlabel === 'ANY')) {
            console.log("VERIFICATION SUCCESS: 'ANY' is present in gender enum");
        } else {
            console.log("VERIFICATION FAILURE: 'ANY' is NOT present in gender enum");
        }

    } catch (err) {
        console.error('Verification failed:', err);
    } finally {
        await client.end();
    }
}

verify();
