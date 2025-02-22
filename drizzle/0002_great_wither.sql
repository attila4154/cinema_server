DROP INDEX "email_idx";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "cinemas" integer[] DEFAULT '{}'::integer[] NOT NULL;--> statement-breakpoint
CREATE INDEX "email_idx" ON "user" USING btree ("email");