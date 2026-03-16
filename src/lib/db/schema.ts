import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, pgEnum, integer, boolean, date, index } from "drizzle-orm/pg-core";

// Enums
export const userRole = pgEnum("user_role", ["SEEKER", "EMPLOYER", "ADMIN"]);
export const userAccountStatus = pgEnum("account_status", ["ACTIVE", "INACTIVE", "BANNED"]);

export const jobType = pgEnum("job_type", ["ONSITE", "HYBRID", "REMOTE"]);
export const jobStatus = pgEnum("job_status", ["OPEN", "CLOSED", "PAUSED"]);

export const applicationStatus = pgEnum("application_status", ["PENDING", "ACCEPTED", "SHORTLISTED", "IN_REVIEW", "INTERVIEW", "REJECTED"]);
export const jobApprovalStatusEnum = pgEnum("job_approval_status", ["PENDING", "APPROVED", "REJECTED"]);

// New Enums for Employer Profile
export const employerAccountTypeEnum = pgEnum("employer_account_type", ["COMPANY", "INDIVIDUAL"]);
export const hiringForEnum = pgEnum("hiring_for", ["COMPANY", "CONSULTANCY", "INDIVIDUAL_PROPRIETOR"]);
export const companySizeEnum = pgEnum("company_size", ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]);
export const verificationStatusEnum = pgEnum("verification_status", ["UNVERIFIED", "PENDING", "VERIFIED", "APPROVED", "REJECTED"]);

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
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),

    // Basic Info
    isPublic: boolean("is_public").default(true).notNull(), // Account Visibility
    position: text("position"), // Optional preferred position like Frontend, Fullstack

    // Personal Details
    fullName: text("full_name").notNull(),
    gender: genderEnum("gender"),
    dateOfBirth: date("date_of_birth", { mode: "date" }), // Auto-calculate age in app
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
}, (t) => ({
    userIdIndex: index("seeker_profiles_user_id_idx").on(t.userId),
}));

// 1.3 Employer Profiles Table
export const employerProfiles = pgTable("employer_profiles", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),

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

    // Verification Fields
    verificationStatus: verificationStatusEnum("verification_status").default("UNVERIFIED").notNull(),
    tempStaffingDocumentType: text("temp_staffing_document_type"),
    tempStaffingDocumentUrl: text("temp_staffing_document_url"),
    personalDocumentType: text("personal_document_type"),
    personalDocumentUrl: text("personal_document_url"),
    companyDocumentType: text("company_document_type"),
    companyDocumentUrl: text("company_document_url"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
    userIdIndex: index("employer_profiles_user_id_idx").on(t.userId),
}));

// 2. Jobs Table
export const jobs = pgTable("jobs", {
    id: uuid("id").primaryKey().defaultRandom(),
    employerId: uuid("employer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    type: jobType("type").default("ONSITE").notNull(),
    location: text("location").notNull(),
    salaryMin: integer("salary_min").notNull(),
    salaryMax: integer("salary_max").notNull(),
    status: jobStatus("status").default("OPEN").notNull(),
    approvalStatus: jobApprovalStatusEnum("approval_status").default("PENDING").notNull(),
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

    // --- I] Job Details ---
    workExperienceMin: integer("work_experience_min"),
    workExperienceMax: integer("work_experience_max"),
    monthlySalaryMin: integer("monthly_salary_min"),
    monthlySalaryMax: integer("monthly_salary_max"),
    perksAndBenefits: text("perks_and_benefits").array().default([]), // For predefined + custom perks

    // --- II] Candidate Preferences ---
    candidateLocationRequirement: text("candidate_location_requirement"), // "ANYWHERE", "SPECIFIC_CITY" -> might also map to explicit cities later
    candidateEducationLevel: text("candidate_education_level"), // "diploma", "12 pass", "graduate", "post-graduate"
    preferredCandidateGender: genderEnum("preferred_candidate_gender"), // Reusing existing genderEnum (MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY)

    // --- III] Screening Questions ---
    screeningExperienceMin: integer("screening_experience_min"), // e.g. 1 to 10
    screeningEducationLevel: text("screening_education_level"),
    screeningEnglishLevel: text("screening_english_level"), // "no english", "basic english", "good english", "fluent english"

    // --- IV] Job Description ---
    // responsibilities: text("responsibilities").array().default([]), // < Existing array field, but we might want a raw text for textarea
    jobResponsibilitiesText: text("job_responsibilities_text"),
    aboutCompany: text("about_company"),

    // --- V] Communication Preferences ---
    allowCalls: boolean("allow_calls").default(false),
    recruiterName: text("recruiter_name"),
    recruiterContact: text("recruiter_contact"),
    callTimeFrom: text("call_time_from"), // e.g. "09:00 AM"
    callTimeTo: text("call_time_to"),   // e.g. "06:00 PM"
    callDays: text("call_days"),        // "Mon-Fri", "Mon-Sat", "Everyday"
    rejectionReason: text("rejection_reason"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    statusChangedAt: timestamp("status_changed_at"), // Set when job is paused or closed
}, (t) => ({
    employerIdIndex: index("jobs_employer_id_idx").on(t.employerId),
}));

// 3. Applications Table
export const applications = pgTable('applications', {
    id: uuid("id").primaryKey().defaultRandom(),
    applicantId: uuid("applicant_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    jobId: uuid("job_id").notNull().references(() => jobs.id, { onDelete: "cascade" }),
    applicationStatus: applicationStatus("application_status").default("PENDING").notNull(),
    applicationDate: timestamp("application_date").defaultNow().notNull(),
    resumeUrl: text("resume_url").default("").notNull(),
    coverLetterUrl: text("cover_letter_url").default("").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (t) => ({
    applicantIdIndex: index("applications_applicant_id_idx").on(t.applicantId),
    jobIdIndex: index("applications_job_id_idx").on(t.jobId),
}));

// 4. Education Table
export const education = pgTable("education", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),

    type: text("type").notNull(), // Class X, Class XII, Degree
    board: text("board"),
    medium: text("medium"),
    percentage: text("percentage"),
    startDate: date("start_date", { mode: "date" }), // Replaced startYear/Month with unified date
    endDate: date("end_date", { mode: "date" }), // Replaced passingYear/endingYear
    isPursuing: boolean("is_pursuing").default(false),
    institute: text("institute"),
    degree: text("degree"),
    stream: text("stream"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
    userIdIndex: index("education_user_id_idx").on(t.userId),
}));

// 5. Experience Table
export const experience = pgTable("experience", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    companyName: text("company_name").notNull(),
    designation: text("designation").notNull(), // Also used for 'role' in internships
    employmentType: preferredWorkTypeEnum("employment_type").notNull(),
    startDate: date("start_date", { mode: "date" }), // Made nullable to avoid migration issues with existing data
    endDate: date("end_date", { mode: "date" }),
    isCurrent: boolean("is_current").default(false),
    description: text("description"),

    // Internship specific
    keySkills: text("key_skills"),
    projectUrl: text("project_url"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
    userIdIndex: index("experience_user_id_idx").on(t.userId),
}));

// 6. Skills Table
export const skills = pgTable("skills", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    skillName: text("skill_name").notNull(),
    proficiency: proficiencyLevelEnum("proficiency").default("BEGINNER"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
    userIdIndex: index("skills_user_id_idx").on(t.userId),
}));

// 7. Certifications Table
export const certifications = pgTable("certifications", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    certificationName: text("certification_name").notNull(),
    issuer: text("issuer").notNull(),
    issueDate: date("issue_date", { mode: "date" }).notNull(),
    expiryDate: date("expiry_date", { mode: "date" }), // Null if no expiry
    credentialUrl: text("credential_url"),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
    userIdIndex: index("certifications_user_id_idx").on(t.userId),
}));

// 8. Languages Table
// Corrected to separate proficiency levels
export const languages = pgTable("languages", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    languageName: text("language_name").notNull(),

    // Granular Proficiency
    read: proficiencyLevelEnum("read").default("BEGINNER"),
    write: proficiencyLevelEnum("write").default("BEGINNER"),
    speak: proficiencyLevelEnum("speak").default("BEGINNER"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
    userIdIndex: index("languages_user_id_idx").on(t.userId),
}));

// 9. Job Skills Table
/* Deleted: Job Skills Table - Replaced with array in Jobs table for simpler MVP */

// 10. Job Certifications Table
/* Deleted: Job Certifications Table - Replaced with array in Jobs table for simpler MVP */

// 11. Job Languages Table
/* Deleted: Job Languages Table - Replaced with array in Jobs table for simpler MVP */

// 12. Projects Table
export const projects = pgTable("projects", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    technologies: text("technologies").array().default([]), // Maps to keySkills string
    url: text("url"), // Live link
    startDate: date("start_date", { mode: "date" }),
    endDate: date("end_date", { mode: "date" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
    userIdIndex: index("projects_user_id_idx").on(t.userId),
}));

// 13. Achievements Table (Generic for all granular achievements)
export const achievements = pgTable("achievements", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
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
    startDate: date("start_date", { mode: "date" }),
    endDate: date("end_date", { mode: "date" }),
    date: date("specific_date", { mode: "date" }),

    // Flags
    isCurrent: boolean("is_current").default(false),
    doesNotExpire: boolean("does_not_expire").default(false),

    // Arrays
    achievementsList: text("achievements_list").array().default([]), // For academic list

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
    userIdIndex: index("achievements_user_id_idx").on(t.userId),
}));

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
