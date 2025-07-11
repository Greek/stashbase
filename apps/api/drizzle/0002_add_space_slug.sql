ALTER TABLE "space" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
CREATE INDEX "space_slug_idx" ON "space" USING btree ("slug");--> statement-breakpoint
ALTER TABLE "space" ADD CONSTRAINT "space_slug_unique" UNIQUE("slug");