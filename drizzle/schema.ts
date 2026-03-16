import { pgTable, unique, uuid, text, boolean, timestamp, index, foreignKey, integer, date, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const accountStatus = pgEnum("account_status", ['ACTIVE', 'INACTIVE', 'BANNED'])
export const applicationStatus = pgEnum("application_status", ['PENDING', 'ACCEPTED', 'SHORTLISTED', 'IN_REVIEW', 'INTERVIEW', 'REJECTED'])
export const companySize = pgEnum("company_size", ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'])
export const employerAccountType = pgEnum("employer_account_type", ['COMPANY', 'INDIVIDUAL'])
export const employmentStatus = pgEnum("employment_status", ['UNEMPLOYED', 'EMPLOYED', 'STUDENT'])
export const gender = pgEnum("gender", ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'])
export const hiringFor = pgEnum("hiring_for", ['COMPANY', 'CONSULTANCY', 'INDIVIDUAL_PROPRIETOR'])
export const jobApprovalStatus = pgEnum("job_approval_status", ['PENDING', 'APPROVED', 'REJECTED'])
export const jobStatus = pgEnum("job_status", ['OPEN', 'CLOSED', 'PAUSED'])
export const jobType = pgEnum("job_type", ['ONSITE', 'HYBRID', 'REMOTE'])
export const lookingFor = pgEnum("looking_for", ['JOB', 'INTERNSHIP', 'BOTH'])
export const noticePeriod = pgEnum("notice_period", ['IMMEDIATE', '15_DAYS', '30_DAYS', '60_DAYS', '90_DAYS'])
export const preferredWorkType = pgEnum("preferred_work_type", ['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT'])
export const proficiencyLevel = pgEnum("proficiency_level", ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
export const userRole = pgEnum("user_role", ['SEEKER', 'EMPLOYER', 'ADMIN'])
export const verificationStatus = pgEnum("verification_status", ['UNVERIFIED', 'PENDING', 'VERIFIED', 'APPROVED', 'REJECTED'])
export const workStatus = pgEnum("work_status", ['FRESHER', 'EXPERIENCED'])


export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	username: text().notNull(),
	userRole: userRole("user_role").default('SEEKER').notNull(),
	email: text().notNull(),
	password: text(),
	profilePicture: text("profile_picture").default(''),
	phoneNumber: text("phone_number"),
	isVerified: boolean("is_verified").default(false).notNull(),
	accountStatus: accountStatus("account_status").default('ACTIVE').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	isPhoneVerified: boolean("is_phone_verified").default(false).notNull(),
	termsAccepted: boolean("terms_accepted").default(false).notNull(),
	consentShared: boolean("consent_shared").default(false).notNull(),
	provider: text().default('credentials').notNull(),
	providerAccountId: text("provider_account_id"),
	emailVerified: timestamp("email_verified", { mode: 'string' }),
}, (table) => [
	unique("users_username_unique").on(table.username),
	unique("users_email_unique").on(table.email),
]);

export const languages = pgTable("languages", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	languageName: text("language_name").notNull(),
	read: proficiencyLevel().default('BEGINNER'),
	write: proficiencyLevel().default('BEGINNER'),
	speak: proficiencyLevel().default('BEGINNER'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("languages_user_id_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "languages_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const seekerProfiles = pgTable("seeker_profiles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	resumeUrl: text("resume_url").default('').notNull(),
	coverLetter: text("cover_letter").default('').notNull(),
	experienceLevel: integer("experience_level").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	isPublic: boolean("is_public").default(true).notNull(),
	gender: gender(),
	dateOfBirth: date("date_of_birth"),
	currentLocation: text("current_location"),
	preferredWorkLocation: text("preferred_work_location").array().default([]),
	nationality: text(),
	willingToRelocate: boolean("willing_to_relocate").default(false),
	workStatus: workStatus("work_status").default('FRESHER'),
	lookingFor: lookingFor("looking_for").default('JOB'),
	employmentStatus: employmentStatus("employment_status"),
	noticePeriod: noticePeriod("notice_period"),
	preferredWorkType: preferredWorkType("preferred_work_type").array().default([]),
	preferredWorkMode: jobType("preferred_work_mode").array().default([]),
	bio: text(),
	careerGoals: text("career_goals"),
	portfolioUrl: text("portfolio_url"),
	githubUrl: text("github_url"),
	linkedinUrl: text("linkedin_url"),
	otherLinks: text("other_links").array().default([]),
	expectedSalaryMin: integer("expected_salary_min"),
	expectedSalaryMax: integer("expected_salary_max"),
	preferredIndustry: text("preferred_industry").array().default([]),
	preferredCompanyType: text("preferred_company_type").array().default([]),
	shiftPreference: text("shift_preference"),
	fullName: text("full_name").notNull(),
	totalExperienceYears: integer("total_experience_years").default(0),
	totalExperienceMonths: integer("total_experience_months").default(0),
	currentIndustry: text("current_industry"),
	currentDepartment: text("current_department"),
	currentRoleCategory: text("current_role_category"),
	currentJobRole: text("current_job_role"),
	currentSalary: integer("current_salary"),
	position: text(),
}, (table) => [
	index("seeker_profiles_user_id_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "seeker_profiles_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const applications = pgTable("applications", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	applicantId: uuid("applicant_id").notNull(),
	jobId: uuid("job_id").notNull(),
	applicationStatus: applicationStatus("application_status").default('PENDING').notNull(),
	applicationDate: timestamp("application_date", { mode: 'string' }).defaultNow().notNull(),
	resumeUrl: text("resume_url").default('').notNull(),
	coverLetterUrl: text("cover_letter_url").default('').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("applications_applicant_id_idx").using("btree", table.applicantId.asc().nullsLast().op("uuid_ops")),
	index("applications_job_id_idx").using("btree", table.jobId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.applicantId],
			foreignColumns: [users.id],
			name: "applications_applicant_id_users_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.jobId],
			foreignColumns: [jobs.id],
			name: "applications_job_id_jobs_id_fk"
		}).onDelete("cascade"),
]);

export const certifications = pgTable("certifications", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	certificationName: text("certification_name").notNull(),
	issuer: text().notNull(),
	issueDate: date("issue_date").notNull(),
	expiryDate: date("expiry_date"),
	credentialUrl: text("credential_url"),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("certifications_user_id_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "certifications_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const skills = pgTable("skills", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	skillName: text("skill_name").notNull(),
	proficiency: proficiencyLevel().default('BEGINNER'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("skills_user_id_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "skills_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const education = pgTable("education", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	type: text().notNull(),
	board: text(),
	medium: text(),
	percentage: text(),
	isPursuing: boolean("is_pursuing").default(false),
	institute: text(),
	degree: text(),
	stream: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	startDate: date("start_date"),
	endDate: date("end_date"),
}, (table) => [
	index("education_user_id_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "education_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const jobs = pgTable("jobs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	type: jobType().default('ONSITE').notNull(),
	location: text().notNull(),
	salaryMin: integer("salary_min").notNull(),
	status: jobStatus().default('OPEN').notNull(),
	experienceLevel: integer("experience_level").notNull(),
	applicationDeadline: timestamp("application_deadline", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	employerId: uuid("employer_id").notNull(),
	salaryMax: integer("salary_max").notNull(),
	requiredSkills: text("required_skills").array().default([]),
	requiredLanguages: text("required_languages").array().default([]),
	requiredCertifications: text("required_certifications").array().default([]),
	overview: text().array().default([]),
	responsibilities: text().array().default([]),
	requirements: text().array().default([]),
	howToApply: text("how_to_apply"),
	workExperienceMin: integer("work_experience_min"),
	workExperienceMax: integer("work_experience_max"),
	monthlySalaryMin: integer("monthly_salary_min"),
	monthlySalaryMax: integer("monthly_salary_max"),
	perksAndBenefits: text("perks_and_benefits").array().default([]),
	candidateLocationRequirement: text("candidate_location_requirement"),
	candidateEducationLevel: text("candidate_education_level"),
	preferredCandidateGender: text("preferred_candidate_gender"),
	screeningExperienceMin: integer("screening_experience_min"),
	screeningEducationLevel: text("screening_education_level"),
	screeningEnglishLevel: text("screening_english_level"),
	jobResponsibilitiesText: text("job_responsibilities_text"),
	aboutCompany: text("about_company"),
	allowCalls: boolean("allow_calls").default(false),
	recruiterName: text("recruiter_name"),
	recruiterContact: text("recruiter_contact"),
	callTimeFrom: text("call_time_from"),
	callTimeTo: text("call_time_to"),
	callDays: text("call_days"),
	statusChangedAt: timestamp("status_changed_at", { mode: 'string' }),
	approvalStatus: jobApprovalStatus("approval_status").default('PENDING').notNull(),
	rejectionReason: text("rejection_reason"),
}, (table) => [
	index("jobs_employer_id_idx").using("btree", table.employerId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.employerId],
			foreignColumns: [users.id],
			name: "jobs_employer_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const experience = pgTable("experience", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	companyName: text("company_name").notNull(),
	designation: text().notNull(),
	employmentType: preferredWorkType("employment_type").notNull(),
	isCurrent: boolean("is_current").default(false),
	description: text(),
	keySkills: text("key_skills"),
	projectUrl: text("project_url"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	startDate: date("start_date"),
	endDate: date("end_date"),
}, (table) => [
	index("experience_user_id_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "experience_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const projects = pgTable("projects", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	title: text().notNull(),
	description: text().notNull(),
	technologies: text().array().default([]),
	url: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	startDate: date("start_date"),
	endDate: date("end_date"),
}, (table) => [
	index("projects_user_id_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "projects_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const achievements = pgTable("achievements", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	type: text().notNull(),
	title: text(),
	organization: text(),
	description: text(),
	url: text(),
	completionId: text("completion_id"),
	score: text(),
	totalScore: text("total_score"),
	isCurrent: boolean("is_current").default(false),
	doesNotExpire: boolean("does_not_expire").default(false),
	achievementsList: text("achievements_list").array().default([]),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	startDate: date("start_date"),
	endDate: date("end_date"),
	specificDate: date("specific_date"),
}, (table) => [
	index("achievements_user_id_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "achievements_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const employerProfiles = pgTable("employer_profiles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	companyLogo: text("company_logo").default(''),
	companyDescription: text("company_description"),
	companyWebsite: text("company_website"),
	companyIndustry: text("company_industry"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	companyLocation: text("company_location"),
	companyName: text("company_name"),
	accountType: employerAccountType("account_type").default('COMPANY').notNull(),
	hiringFor: hiringFor("hiring_for").default('COMPANY').notNull(),
	fullName: text("full_name").default('').notNull(),
	designation: text(),
	pincode: text(),
	companyAddress: text("company_address"),
	companySize: companySize("company_size"),
	verificationStatus: verificationStatus("verification_status").default('UNVERIFIED').notNull(),
	tempStaffingDocumentType: text("temp_staffing_document_type"),
	tempStaffingDocumentUrl: text("temp_staffing_document_url"),
	personalDocumentType: text("personal_document_type"),
	personalDocumentUrl: text("personal_document_url"),
	companyDocumentType: text("company_document_type"),
	companyDocumentUrl: text("company_document_url"),
}, (table) => [
	index("employer_profiles_user_id_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "employer_profiles_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const passwordResetTokens = pgTable("password_reset_tokens", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	token: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "password_reset_tokens_user_id_users_id_fk"
		}).onDelete("cascade"),
	unique("password_reset_tokens_token_unique").on(table.token),
]);
