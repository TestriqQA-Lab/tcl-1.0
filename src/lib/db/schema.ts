import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, pgEnum, integer, boolean } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["SEEKER", "EMPLOYER", "ADMIN"]);
export const userAccountStatus = pgEnum("account_status", ["ACTIVE", "INACTIVE", "BANNED"]);

export const jobType = pgEnum("job_type", ["ONSITE", "HYBRID", "REMOTE"]);
export const jobStatus = pgEnum("job_status", ["OPEN", "CLOSED"]);

export const applicationStatus = pgEnum("application_status", ["PENDING", "ACCEPTED", "REJECTED"]);

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    username: text("username").notNull().unique(),
    userRole: userRole("user_role").default("SEEKER").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    profilePicture: text("profile_picture").default(""),
    phoneNumber: text('phone_number').notNull(),
    isVerified: boolean("is_verified").default(false).notNull(),
    accountStatus: userAccountStatus("account_status").default("ACTIVE").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const seekerProfiles = pgTable("seeker_profiles", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    resumeUrl: text("resume_url").notNull().default(""),
    coverLetter: text("cover_letter").notNull().default(""),
    skills: text("skills").array().notNull().default([]),
    experienceLevel: integer("experience_level").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const employerProfiles = pgTable("employer_profiles", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id),
    companyName: text("company_name").notNull(),
    companyLogo: text("company_logo").notNull().default(""),
    companyDescription: text("company_description").notNull(),
    companyWebsite: text("company_website").notNull(),
    companySize: integer("company_size").notNull(),
    companyIndustry: text("company_industry").notNull(),
    companyLocation: text("company_location").notNull(), // Added for company-wide location
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const jobs = pgTable("jobs", {
    id: uuid("id").primaryKey().defaultRandom(),
    employerId: uuid("employer_id").notNull().references(() => users.id),
    title: text("title").notNull(),
    description: text("description").notNull(),
    type: jobType("type").default("ONSITE").notNull(),
    location: text("location").notNull(),
    salaryMin: integer("salary_min").notNull(),
    salaryMax: integer("salary_max").notNull(),
    status: jobStatus("status").default("OPEN").notNull(),
    experienceLevel: integer("experience_level").notNull(),
    applicationDeadline: timestamp("application_deadline").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const applications = pgTable('applications', {
    id: uuid("id").primaryKey().defaultRandom(),
    applicantId: uuid("applicant_id").notNull().references(() => users.id),
    jobId: uuid("job_id").notNull().references(() => jobs.id),
    applicationStatus: applicationStatus("application_status").default("PENDING").notNull(),
    applicationDate: timestamp("application_date").defaultNow().notNull(),
    resumeUrl: text("resume_url").default("").notNull(),
    coverLetterUrl: text("cover_letter_url").default("").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const usersRelations = relations(users, ({ one, many }) => ({
    seekerProfile: one(seekerProfiles),
    employerProfile: one(employerProfiles),
    jobs: many(jobs),
    applications: many(applications),
}));

export const seekerProfilesRelations = relations(seekerProfiles, ({ one }) => ({
    user: one(users, {
        fields: [seekerProfiles.userId],
        references: [users.id],
    }),
}));

export const employerProfilesRelations = relations(employerProfiles, ({ one }) => ({
    user: one(users, {
        fields: [employerProfiles.userId],
        references: [users.id],
    }),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
    employer: one(users, {
        fields: [jobs.employerId],
        references: [users.id],
    }),
    applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
    applicant: one(users, {
        fields: [applications.applicantId],
        references: [users.id],
    }),
    job: one(jobs, {
        fields: [applications.jobId],
        references: [jobs.id],
    }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
