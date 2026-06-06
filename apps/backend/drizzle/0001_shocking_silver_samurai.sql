CREATE TYPE "public"."card_network" AS ENUM('visa', 'mastercard');--> statement-breakpoint
CREATE TYPE "public"."card_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('pending', 'paid', 'overdue');--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "status" SET DATA TYPE card_status USING status::card_status;--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "status" SET DEFAULT 'inactive';--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "network" SET DATA TYPE card_network USING network::card_network;--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "status" SET DATA TYPE invoice_status USING status::invoice_status;--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "status" SET DEFAULT 'pending';
