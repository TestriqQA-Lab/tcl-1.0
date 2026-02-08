import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("user_role", ["SEEKER", "EMPLOYER", "ADMIN"]);

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: roleEnum("role").default("SEEKER").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
