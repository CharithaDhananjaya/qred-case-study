CREATE INDEX IF NOT EXISTS "cards_company_id_idx" ON "cards" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "credit_limits_company_id_idx" ON "credit_limits" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invoices_company_id_status_idx" ON "invoices" USING btree ("company_id","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transactions_card_id_idx" ON "transactions" USING btree ("card_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transactions_created_at_idx" ON "transactions" USING btree ("created_at");