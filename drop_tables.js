const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function run() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.query('DROP TABLE IF EXISTS "education", "experience", "projects", "achievements" CASCADE;');
    await client.end();
    console.log('Tables dropped');
}

run().catch(console.error);
