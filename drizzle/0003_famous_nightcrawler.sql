ALTER TYPE "public"."gender" ADD VALUE 'ANY';--> statement-breakpoint
CREATE TABLE "otp_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" text NOT NULL,
	"otp" text NOT NULL,
	"type" text NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "department" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "industry" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "role_category" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "custom_screening_questions" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "rejection_reason" text;