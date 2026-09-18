CREATE TYPE "public"."task_priority" AS ENUM('none', 'low', 'medium', 'high');--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "priority" "task_priority" DEFAULT 'none' NOT NULL;