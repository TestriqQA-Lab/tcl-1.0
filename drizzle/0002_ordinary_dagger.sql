ALTER TYPE "public"."application_status" ADD VALUE 'SHORTLISTED' BEFORE 'REJECTED';--> statement-breakpoint
ALTER TYPE "public"."application_status" ADD VALUE 'IN_REVIEW' BEFORE 'REJECTED';--> statement-breakpoint
ALTER TYPE "public"."application_status" ADD VALUE 'INTERVIEW' BEFORE 'REJECTED';--> statement-breakpoint
ALTER TYPE "public"."verification_status" ADD VALUE 'APPROVED' BEFORE 'REJECTED';