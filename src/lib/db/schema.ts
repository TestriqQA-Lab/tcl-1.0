import { pgTable, text, timestamp, uuid, pgEnum, integer, boolean } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["SEEKER", "EMPLOYER", "ADMIN"]);

export const userAccountStatus = pgEnum("account_status", ["ACTIVE", "INACTIVE", "BANNED"]);

export const jobType = pgEnum("job_type", ["ONSITE", "HYBRID", "REMOTE"]);
export const jobStatus = pgEnum("job_status", ["OPEN", "CLOSED"]);

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    username: text("username").notNull().unique(),
    userRole: userRole("user_role").default("SEEKER").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    profilePicture: text("profile_picture").default(""),
    phoneNumber: integer('phone_number').notNull(),
    // Seekers
    resumeUrl: text("resume_url").default("").notNull(),
    coverLetterUrl: text("cover_letter_url").default("").notNull(),
    // Employeers
    totalApplicants: integer('total_applicants').default(0).notNull(),
    // Admin
    isVerified: boolean("is_verified").default(false).notNull(),
    accountStatus: userAccountStatus("account_status").default("ACTIVE").notNull(),
    // Other
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const jobs = pgTable("jobs", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    type: jobType("type").default("ONSITE").notNull(),
    location: text("location").notNull(),
    salary: integer("salary").notNull(),
    status: jobStatus("status").default("OPEN").notNull(),
    experienceLevel: integer("experience_level").notNull(),
    // skills
    // tags:
    applicationDeadline: timestamp("application_deadline").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    employerId: uuid("employer_id").notNull().references(() => users.id),
    // applications:
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
