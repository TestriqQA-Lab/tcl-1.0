import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { users } from "./src/lib/db/schema";

const connectionString = "postgresql://neondb_owner:npg_tG3id8ACbfwV@ep-royal-rice-a14qljgi-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

async function listUsers() {
    try {
        const pool = new Pool({ connectionString, ssl: true });
        const db = drizzle(pool);

        const allUsers = await db.select().from(users);
        console.log(`Found ${allUsers.length} users.`);
        allUsers.forEach(u => {
            console.log(`ID: ${u.id}, Email: ${u.email}, Role: ${u.userRole}`);
        });

        await pool.end();
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

listUsers();
