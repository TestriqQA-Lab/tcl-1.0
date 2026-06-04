import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,                        // Max connections in pool (keeps Neon free tier happy)
    min: 0,                        // Allow pool to fully drain when idle
    idleTimeoutMillis: 30000,      // Close idle connections after 30s
    connectionTimeoutMillis: 10000, // Fail fast if Neon takes >10s to respond (cold start guard)
    statement_timeout: 30000,      // Kill queries running >30s
});

export const db = drizzle(pool, { schema });
