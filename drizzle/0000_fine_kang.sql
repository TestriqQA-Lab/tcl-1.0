CREATE TYPE "public"."application_status" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."company_size" AS ENUM('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+');--> statement-breakpoint
CREATE TYPE "public"."employer_account_type" AS ENUM('COMPANY', 'INDIVIDUAL');--> statement-breakpoint
CREATE TYPE "public"."employment_status" AS ENUM('UNEMPLOYED', 'EMPLOYED', 'STUDENT');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');--> statement-breakpoint
CREATE TYPE "public"."hiring_for" AS ENUM('COMPANY', 'CONSULTANCY');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('OPEN', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('ONSITE', 'HYBRID', 'REMOTE');--> statement-breakpoint
CREATE TYPE "public"."looking_for" AS ENUM('JOB', 'INTERNSHIP', 'BOTH');--> statement-breakpoint
CREATE TYPE "public"."notice_period" AS ENUM('IMMEDIATE', '15_DAYS', '30_DAYS', '60_DAYS', '90_DAYS');--> statement-breakpoint
CREATE TYPE "public"."preferred_work_type" AS ENUM('FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT');--> statement-breakpoint
CREATE TYPE "public"."proficiency_level" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED');--> statement-breakpoint
CREATE TYPE "public"."account_status" AS ENUM('ACTIVE', 'INACTIVE', 'BANNED');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('SEEKER', 'EMPLOYER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."work_status" AS ENUM('FRESHER', 'EXPERIENCED');--> statement-breakpoint
CREATE TABLE "achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"title" text,
	"organization" text,
	"description" text,
	"url" text,
	"completion_id" text,
	"score" text,
	"total_score" text,
	"start_month" text,
	"start_year" text,
	"end_month" text,
	"end_year" text,
	"date" text,
	"is_current" boolean DEFAULT false,
	"does_not_expire" boolean DEFAULT false,
	"achievements_list" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"applicant_id" uuid NOT NULL,
	"job_id" uuid NOT NULL,
	"application_status" "application_status" DEFAULT 'PENDING' NOT NULL,
	"application_date" timestamp DEFAULT now() NOT NULL,
	"resume_url" text DEFAULT '' NOT NULL,
	"cover_letter_url" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"certification_name" text NOT NULL,
	"issuer" text NOT NULL,
	"issue_date" date NOT NULL,
	"expiry_date" date,
	"credential_url" text,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "education" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"board" text,
	"medium" text,
	"percentage" text,
	"passing_year" text,
	"ending_year" text,
	"is_pursuing" boolean DEFAULT false,
	"institute" text,
	"degree" text,
	"stream" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employer_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"account_type" "employer_account_type" DEFAULT 'COMPANY' NOT NULL,
	"hiring_for" "hiring_for" DEFAULT 'COMPANY' NOT NULL,
	"full_name" text DEFAULT '' NOT NULL,
	"designation" text,
	"pincode" text,
	"company_address" text,
	"company_name" text,
	"company_logo" text DEFAULT '',
	"company_description" text,
	"company_website" text,
	"company_size" "company_size",
	"company_industry" text,
	"company_location" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experience" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"company_name" text NOT NULL,
	"designation" text NOT NULL,
	"employment_type" "preferred_work_type" NOT NULL,
	"start_month" text NOT NULL,
	"start_year" text NOT NULL,
	"end_month" text,
	"end_year" text,
	"is_current" boolean DEFAULT false,
	"description" text,
	"key_skills" text,
	"project_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employer_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"type" "job_type" DEFAULT 'ONSITE' NOT NULL,
	"location" text NOT NULL,
	"salary_min" integer NOT NULL,
	"salary_max" integer NOT NULL,
	"status" "job_status" DEFAULT 'OPEN' NOT NULL,
	"experience_level" integer NOT NULL,
	"application_deadline" timestamp NOT NULL,
	"required_skills" text[] DEFAULT '{}',
	"required_languages" text[] DEFAULT '{}',
	"required_certifications" text[] DEFAULT '{}',
	"overview" text[] DEFAULT '{}',
	"responsibilities" text[] DEFAULT '{}',
	"requirements" text[] DEFAULT '{}',
	"how_to_apply" text,
	"work_experience_min" integer,
	"work_experience_max" integer,
	"monthly_salary_min" integer,
	"monthly_salary_max" integer,
	"perks_and_benefits" text[] DEFAULT '{}',
	"candidate_location_requirement" text,
	"candidate_education_level" text,
	"preferred_candidate_gender" "gender",
	"screening_experience_min" integer,
	"screening_education_level" text,
	"screening_english_level" text,
	"job_responsibilities_text" text,
	"about_company" text,
	"allow_calls" boolean DEFAULT false,
	"recruiter_name" text,
	"recruiter_contact" text,
	"call_time_from" text,
	"call_time_to" text,
	"call_days" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"language_name" text NOT NULL,
	"read" "proficiency_level" DEFAULT 'BEGINNER',
	"write" "proficiency_level" DEFAULT 'BEGINNER',
	"speak" "proficiency_level" DEFAULT 'BEGINNER',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"technologies" text[] DEFAULT '{}',
	"url" text,
	"start_month" text,
	"start_year" text,
	"end_month" text,
	"end_year" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seeker_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"full_name" text NOT NULL,
	"gender" "gender",
	"date_of_birth" date,
	"current_location" text,
	"preferred_work_location" text[] DEFAULT '{}',
	"nationality" text,
	"willing_to_relocate" boolean DEFAULT false,
	"work_status" "work_status" DEFAULT 'FRESHER',
	"looking_for" "looking_for" DEFAULT 'JOB',
	"employment_status" "employment_status",
	"notice_period" "notice_period",
	"preferred_work_type" "preferred_work_type"[] DEFAULT '{}',
	"preferred_work_mode" "job_type"[] DEFAULT '{}',
	"total_experience_years" integer DEFAULT 0,
	"total_experience_months" integer DEFAULT 0,
	"current_industry" text,
	"current_department" text,
	"current_role_category" text,
	"current_job_role" text,
	"current_salary" integer,
	"bio" text,
	"career_goals" text,
	"resume_url" text DEFAULT '' NOT NULL,
	"cover_letter" text DEFAULT '' NOT NULL,
	"portfolio_url" text,
	"github_url" text,
	"linkedin_url" text,
	"other_links" text[] DEFAULT '{}',
	"expected_salary_min" integer,
	"expected_salary_max" integer,
	"preferred_industry" text[] DEFAULT '{}',
	"preferred_company_type" text[] DEFAULT '{}',
	"shift_preference" text,
	"experience_level" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"skill_name" text NOT NULL,
	"proficiency" "proficiency_level" DEFAULT 'BEGINNER',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"user_role" "user_role" DEFAULT 'SEEKER' NOT NULL,
	"email" text NOT NULL,
	"password" text,
	"profile_picture" text DEFAULT '',
	"phone_number" text,
	"provider" text DEFAULT 'credentials' NOT NULL,
	"provider_account_id" text,
	"email_verified" timestamp,
	"is_verified" boolean DEFAULT false NOT NULL,
	"is_phone_verified" boolean DEFAULT false NOT NULL,
	"account_status" "account_status" DEFAULT 'ACTIVE' NOT NULL,
	"terms_accepted" boolean DEFAULT false NOT NULL,
	"consent_shared" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_applicant_id_users_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education" ADD CONSTRAINT "education_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employer_profiles" ADD CONSTRAINT "employer_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experience" ADD CONSTRAINT "experience_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_employer_id_users_id_fk" FOREIGN KEY ("employer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "languages" ADD CONSTRAINT "languages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seeker_profiles" ADD CONSTRAINT "seeker_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;