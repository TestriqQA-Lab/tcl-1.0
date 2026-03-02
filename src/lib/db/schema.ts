import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, pgEnum, integer, boolean, date } from "drizzle-orm/pg-core";

// Enums
export const userRole = pgEnum("user_role", ["SEEKER", "EMPLOYER", "ADMIN"]);
export const userAccountStatus = pgEnum("account_status", ["ACTIVE", "INACTIVE", "BANNED"]);

export const jobType = pgEnum("job_type", ["ONSITE", "HYBRID", "REMOTE"]);
export const jobStatus = pgEnum("job_status", ["OPEN", "CLOSED"]);

export const applicationStatus = pgEnum("application_status", ["PENDING", "ACCEPTED", "REJECTED"]);

// New Enums for Employer Profile
export const employerAccountTypeEnum = pgEnum("employer_account_type", ["COMPANY", "INDIVIDUAL"]);
export const hiringForEnum = pgEnum("hiring_for", ["COMPANY", "CONSULTANCY"]);
export const companySizeEnum = pgEnum("company_size", ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]);

// New Enums for Seeker Profile
export const genderEnum = pgEnum("gender", ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]);
export const workStatusEnum = pgEnum("work_status", ["FRESHER", "EXPERIENCED"]);
export const lookingForEnum = pgEnum("looking_for", ["JOB", "INTERNSHIP", "BOTH"]);
export const employmentStatusEnum = pgEnum("employment_status", ["UNEMPLOYED", "EMPLOYED", "STUDENT"]);
export const noticePeriodEnum = pgEnum("notice_period", ["IMMEDIATE", "15_DAYS", "30_DAYS", "60_DAYS", "90_DAYS"]);
export const preferredWorkTypeEnum = pgEnum("preferred_work_type", ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"]);
export const proficiencyLevelEnum = pgEnum("proficiency_level", ["BEGINNER", "INTERMEDIATE", "ADVANCED"]);


// I] Tables:
// 1. Users Related Tables

// 1.1 Users Table
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    username: text("username").notNull().unique(),
    userRole: userRole("user_role").default("SEEKER").notNull(),
    email: text("email").notNull().unique(),
    password: text("password"), // Nullable for OAuth users
    profilePicture: text("profile_picture").default(""),
    phoneNumber: text('phone_number'), // Nullable for OAuth users

    // OAuth fields
    provider: text("provider").default("credentials").notNull(), // "credentials" | "google"
    providerAccountId: text("provider_account_id"), // Google sub ID
    emailVerified: timestamp("email_verified"), // OAuth email verification

    isVerified: boolean("is_verified").default(false).notNull(),
    isPhoneVerified: boolean("is_phone_verified").default(false).notNull(),
    accountStatus: userAccountStatus("account_status").default("ACTIVE").notNull(),
    termsAccepted: boolean("terms_accepted").default(false).notNull(),
    consentShared: boolean("consent_shared").default(false).notNull(), // Consent to share profile
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// 1.2 Seeker Profiles Table
export const seekerProfiles = pgTable("seeker_profiles", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id),

    // Basic Info
    isPublic: boolean("is_public").default(true).notNull(), // Account Visibility

    // Personal Details
    fullName: text("full_name").notNull(),
    gender: genderEnum("gender"),
    dateOfBirth: date("date_of_birth"), // Auto-calculate age in app
    currentLocation: text("current_location"),
    preferredWorkLocation: text("preferred_work_location").array().default([]), // Array of cities/remote
    nationality: text("nationality"),
    willingToRelocate: boolean("willing_to_relocate").default(false),

    // Professional Status
    workStatus: workStatusEnum("work_status").default("FRESHER"),
    lookingFor: lookingForEnum("looking_for").default("JOB"),
    currentEmploymentStatus: employmentStatusEnum("employment_status"),
    noticePeriod: noticePeriodEnum("notice_period"),
    preferredWorkType: preferredWorkTypeEnum("preferred_work_type").array().default([]),
    preferredWorkMode: jobType("preferred_work_mode").array().default([]), // Reuse jobType (ONSITE/REMOTE/HYBRID)

    // Onboarding - Employment Details
    totalExperienceYears: integer("total_experience_years").default(0),
    totalExperienceMonths: integer("total_experience_months").default(0),
    currentIndustry: text("current_industry"),
    currentDepartment: text("current_department"),
    currentRoleCategory: text("current_role_category"),
    currentJobRole: text("current_job_role"),
    currentSalary: integer("current_salary"), // Annual Fixed Salary

    // Summary
    bio: text("bio"), // Professional Summary
    careerGoals: text("career_goals"),

    // Resume & Links
    resumeUrl: text("resume_url").notNull().default(""),
    coverLetter: text("cover_letter").notNull().default(""),
    portfolioUrl: text("portfolio_url"),
    githubUrl: text("github_url"),
    linkedinUrl: text("linkedin_url"),
    otherLinks: text("other_links").array().default([]), // Blog, Kaggle, Behance

    // Preferences & Salary
    expectedSalaryMin: integer("expected_salary_min"),
    expectedSalaryMax: integer("expected_salary_max"),
    preferredIndustry: text("preferred_industry").array().default([]),
    preferredCompanyType: text("preferred_company_type").array().default([]), // Startup, MNC, etc.
    shiftPreference: text("shift_preference"), // Day/Night/Flexible

    experienceLevel: integer("experience_level").notNull().default(0), // Total years/months? Usually integer years.

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 1.3 Employer Profiles Table
export const employerProfiles = pgTable("employer_profiles", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id),

    // New Fields for Client Registration
    accountType: employerAccountTypeEnum("account_type").default("COMPANY").notNull(),
    hiringFor: hiringForEnum("hiring_for").default("COMPANY").notNull(),
    fullName: text("full_name").default("").notNull(),
    designation: text("designation"),
    pincode: text("pincode"),
    companyAddress: text("company_address"),

    // Relaxed Company/Business Fields (Nullable for Individuals)
    companyName: text("company_name"),
    companyLogo: text("company_logo").default(""),
    companyDescription: text("company_description"),
    companyWebsite: text("company_website"),
    companySize: companySizeEnum("company_size"),
    companyIndustry: text("company_industry"),
    companyLocation: text("company_location"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. Jobs Table
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

    // Job Requirements (Simplified without join tables)
    requiredSkills: text("required_skills").array().default([]), // ["React", "Node"]
    requiredLanguages: text("required_languages").array().default([]), // ["English", "Hindi"]
    requiredCertifications: text("required_certifications").array().default([]), // ["AWS Certified"]

    // Job Detail Page Fields (matching UI)
    overview: text("overview").array().default([]), // Array of paragraphs describing the role
    responsibilities: text("responsibilities").array().default([]), // Array of bullet responsibilities
    requirements: text("requirements").array().default([]), // Array of bullet requirements/qualifications
    howToApply: text("how_to_apply"), // Application instructions text

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. Applications Table
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

// 4. Education Table
export const education = pgTable("education", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id),

    type: text("type").notNull(), // Class X, Class XII, Degree
    board: text("board"),
    medium: text("medium"),
    percentage: text("percentage"),
    passingYear: text("passing_year"),
    endingYear: text("ending_year"),
    isPursuing: boolean("is_pursuing").default(false),
    institute: text("institute"),
    degree: text("degree"),
    stream: text("stream"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 5. Experience Table
export const experience = pgTable("experience", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id),
    companyName: text("company_name").notNull(),
    designation: text("designation").notNull(), // Also used for 'role' in internships
    employmentType: preferredWorkTypeEnum("employment_type").notNull(),
    startMonth: text("start_month").notNull(),
    startYear: text("start_year").notNull(),
    endMonth: text("end_month"),
    endYear: text("end_year"),
    isCurrent: boolean("is_current").default(false),
    description: text("description"),

    // Internship specific
    keySkills: text("key_skills"),
    projectUrl: text("project_url"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 6. Skills Table
export const skills = pgTable("skills", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id),
    skillName: text("skill_name").notNull(),
    proficiency: proficiencyLevelEnum("proficiency").default("BEGINNER"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 7. Certifications Table
export const certifications = pgTable("certifications", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id),
    certificationName: text("certification_name").notNull(),
    issuer: text("issuer").notNull(),
    issueDate: date("issue_date").notNull(),
    expiryDate: date("expiry_date"), // Null if no expiry
    credentialUrl: text("credential_url"),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 8. Languages Table
// Corrected to separate proficiency levels
export const languages = pgTable("languages", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id),
    languageName: text("language_name").notNull(),

    // Granular Proficiency
    read: proficiencyLevelEnum("read").default("BEGINNER"),
    write: proficiencyLevelEnum("write").default("BEGINNER"),
    speak: proficiencyLevelEnum("speak").default("BEGINNER"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 9. Job Skills Table
/* Deleted: Job Skills Table - Replaced with array in Jobs table for simpler MVP */

// 10. Job Certifications Table
/* Deleted: Job Certifications Table - Replaced with array in Jobs table for simpler MVP */

// 11. Job Languages Table
/* Deleted: Job Languages Table - Replaced with array in Jobs table for simpler MVP */

// 12. Projects Table
export const projects = pgTable("projects", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id),
    title: text("title").notNull(),
    description: text("description").notNull(),
    technologies: text("technologies").array().default([]), // Maps to keySkills string
    url: text("url"), // Live link
    startMonth: text("start_month"),
    startYear: text("start_year"),
    endMonth: text("end_month"),
    endYear: text("end_year"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 13. Achievements Table (Generic for all granular achievements)
export const achievements = pgTable("achievements", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id),
    type: text("type").notNull(), // CERTIFICATION, AWARD, CLUB, EXAM, ACADEMIC

    // Title/Name fields (certification name, exam name, club name, etc.)
    title: text("title"),

    // Subtitle/Organization
    organization: text("organization"), // position, educationId mapped here

    // Description/URL
    description: text("description"),
    url: text("url"),

    // Scoring & IDs
    completionId: text("completion_id"),
    score: text("score"),
    totalScore: text("total_score"),

    // Dates
    startMonth: text("start_month"),
    startYear: text("start_year"),
    endMonth: text("end_month"),
    endYear: text("end_year"),
    date: text("date"), // generic year 

    // Flags
    isCurrent: boolean("is_current").default(false),
    doesNotExpire: boolean("does_not_expire").default(false),

    // Arrays
    achievementsList: text("achievements_list").array().default([]), // For academic list

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 14. Password Reset Tokens Table
export const passwordResetTokens = pgTable("password_reset_tokens", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});


// II] Relations

// 1. Users Related Relations

// 1.1 Users Relations
export const usersRelations = relations(users, ({ one, many }) => ({
    seekerProfile: one(seekerProfiles),
    employerProfile: one(employerProfiles),
    jobs: many(jobs),
    applications: many(applications),
    education: many(education),
    experience: many(experience),
    skills: many(skills),
    certifications: many(certifications),
    languages: many(languages),
    projects: many(projects),
    achievements: many(achievements),
    passwordResetTokens: many(passwordResetTokens),
}));

// 1.2 Seeker Profiles Relations
export const seekerProfilesRelations = relations(seekerProfiles, ({ one }) => ({
    user: one(users, {
        fields: [seekerProfiles.userId],
        references: [users.id],
    }),
}));

// 1.3 Employer Profiles Relations
export const employerProfilesRelations = relations(employerProfiles, ({ one }) => ({
    user: one(users, {
        fields: [employerProfiles.userId],
        references: [users.id],
    }),
}));

// 2. Jobs Relations
export const jobsRelations = relations(jobs, ({ one, many }) => ({
    employer: one(users, {
        fields: [jobs.employerId],
        references: [users.id],
    }),
    applications: many(applications),
}));

// 3. Applications Relations
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

// 4. Education Relations
export const educationRelations = relations(education, ({ one }) => ({
    user: one(users, {
        fields: [education.userId],
        references: [users.id],
    }),
}));

// 5. Experience Relations
export const experienceRelations = relations(experience, ({ one }) => ({
    user: one(users, {
        fields: [experience.userId],
        references: [users.id],
    }),
}));

// 6. Skills Relations
export const skillsRelations = relations(skills, ({ one }) => ({
    user: one(users, {
        fields: [skills.userId],
        references: [users.id],
    }),
}));

// 7. Certifications Relations
export const certificationsRelations = relations(certifications, ({ one }) => ({
    user: one(users, {
        fields: [certifications.userId],
        references: [users.id],
    }),
}));

// 8. Languages Relations
export const languagesRelations = relations(languages, ({ one }) => ({
    user: one(users, {
        fields: [languages.userId],
        references: [users.id],
    }),
}));

// 9. Projects Relations
export const projectsRelations = relations(projects, ({ one }) => ({
    user: one(users, {
        fields: [projects.userId],
        references: [users.id],
    }),
}));

// 10. Achievements Relations
export const achievementsRelations = relations(achievements, ({ one }) => ({
    user: one(users, {
        fields: [achievements.userId],
        references: [users.id],
    }),
}));

// 14. Password Reset Tokens Relations
export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
    user: one(users, {
        fields: [passwordResetTokens.userId],
        references: [users.id],
    }),
}));

// III] Types

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
