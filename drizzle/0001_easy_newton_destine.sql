CREATE TYPE "public"."job_approval_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED');--> statement-breakpoint
ALTER TYPE "public"."hiring_for" ADD VALUE 'INDIVIDUAL_PROPRIETOR';--> statement-breakpoint
ALTER TYPE "public"."job_status" ADD VALUE 'PAUSED';--> statement-breakpoint
ALTER TABLE "achievements" DROP CONSTRAINT "achievements_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "applications" DROP CONSTRAINT "applications_applicant_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "applications" DROP CONSTRAINT "applications_job_id_jobs_id_fk";
--> statement-breakpoint
ALTER TABLE "certifications" DROP CONSTRAINT "certifications_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "education" DROP CONSTRAINT "education_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "employer_profiles" DROP CONSTRAINT "employer_profiles_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "experience" DROP CONSTRAINT "experience_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "jobs" DROP CONSTRAINT "jobs_employer_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "languages" DROP CONSTRAINT "languages_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "projects" DROP CONSTRAINT "projects_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "seeker_profiles" DROP CONSTRAINT "seeker_profiles_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "skills" DROP CONSTRAINT "skills_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "achievements" ADD COLUMN "start_date" date;--> statement-breakpoint
ALTER TABLE "achievements" ADD COLUMN "end_date" date;--> statement-breakpoint
ALTER TABLE "achievements" ADD COLUMN "specific_date" date;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "screening_answers" text;--> statement-breakpoint
ALTER TABLE "education" ADD COLUMN "start_date" date;--> statement-breakpoint
ALTER TABLE "education" ADD COLUMN "end_date" date;--> statement-breakpoint
ALTER TABLE "employer_profiles" ADD COLUMN "verification_status" "verification_status" DEFAULT 'UNVERIFIED' NOT NULL;--> statement-breakpoint
ALTER TABLE "employer_profiles" ADD COLUMN "temp_staffing_document_type" text;--> statement-breakpoint
ALTER TABLE "employer_profiles" ADD COLUMN "temp_staffing_document_url" text;--> statement-breakpoint
ALTER TABLE "employer_profiles" ADD COLUMN "personal_document_type" text;--> statement-breakpoint
ALTER TABLE "employer_profiles" ADD COLUMN "personal_document_url" text;--> statement-breakpoint
ALTER TABLE "employer_profiles" ADD COLUMN "company_document_type" text;--> statement-breakpoint
ALTER TABLE "employer_profiles" ADD COLUMN "company_document_url" text;--> statement-breakpoint
ALTER TABLE "experience" ADD COLUMN "start_date" date;--> statement-breakpoint
ALTER TABLE "experience" ADD COLUMN "end_date" date;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "approval_status" "job_approval_status" DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "status_changed_at" timestamp;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "start_date" date;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "end_date" date;--> statement-breakpoint
ALTER TABLE "seeker_profiles" ADD COLUMN "position" text;--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_applicant_id_users_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education" ADD CONSTRAINT "education_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employer_profiles" ADD CONSTRAINT "employer_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experience" ADD CONSTRAINT "experience_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_employer_id_users_id_fk" FOREIGN KEY ("employer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "languages" ADD CONSTRAINT "languages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seeker_profiles" ADD CONSTRAINT "seeker_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "achievements_user_id_idx" ON "achievements" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "applications_applicant_id_idx" ON "applications" USING btree ("applicant_id");--> statement-breakpoint
CREATE INDEX "applications_job_id_idx" ON "applications" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "certifications_user_id_idx" ON "certifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "education_user_id_idx" ON "education" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "employer_profiles_user_id_idx" ON "employer_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "experience_user_id_idx" ON "experience" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "jobs_employer_id_idx" ON "jobs" USING btree ("employer_id");--> statement-breakpoint
CREATE INDEX "languages_user_id_idx" ON "languages" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "projects_user_id_idx" ON "projects" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "seeker_profiles_user_id_idx" ON "seeker_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "skills_user_id_idx" ON "skills" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "achievements" DROP COLUMN "start_month";--> statement-breakpoint
ALTER TABLE "achievements" DROP COLUMN "start_year";--> statement-breakpoint
ALTER TABLE "achievements" DROP COLUMN "end_month";--> statement-breakpoint
ALTER TABLE "achievements" DROP COLUMN "end_year";--> statement-breakpoint
ALTER TABLE "achievements" DROP COLUMN "date";--> statement-breakpoint
ALTER TABLE "education" DROP COLUMN "passing_year";--> statement-breakpoint
ALTER TABLE "education" DROP COLUMN "ending_year";--> statement-breakpoint
ALTER TABLE "experience" DROP COLUMN "start_month";--> statement-breakpoint
ALTER TABLE "experience" DROP COLUMN "start_year";--> statement-breakpoint
ALTER TABLE "experience" DROP COLUMN "end_month";--> statement-breakpoint
ALTER TABLE "experience" DROP COLUMN "end_year";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "start_month";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "start_year";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "end_month";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "end_year";