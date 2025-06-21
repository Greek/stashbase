CREATE TABLE "domain" (
	"id" text PRIMARY KEY NOT NULL,
	"domain_name" text NOT NULL,
	"dns_key" text NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"creator_id" text NOT NULL,
	"space_id" text,
	CONSTRAINT "domain_domain_name_unique" UNIQUE("domain_name"),
	CONSTRAINT "domain_dns_key_unique" UNIQUE("dns_key")
);
--> statement-breakpoint
CREATE TABLE "file" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"s3_path" text NOT NULL,
	"filename" text NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"uploader_id" text,
	"space_id" text
);
--> statement-breakpoint
CREATE TABLE "membership" (
	"id" text PRIMARY KEY NOT NULL,
	"roles" text[] DEFAULT '{}'::text[] NOT NULL,
	"member_id" text,
	"space_id" text
);
--> statement-breakpoint
CREATE TABLE "space" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text DEFAULT 'My New Space' NOT NULL,
	"owner_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "domain" ADD CONSTRAINT "domain_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "domain" ADD CONSTRAINT "domain_space_id_space_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."space"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file" ADD CONSTRAINT "file_uploader_id_user_id_fk" FOREIGN KEY ("uploader_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file" ADD CONSTRAINT "file_space_id_space_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."space"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership" ADD CONSTRAINT "membership_member_id_user_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership" ADD CONSTRAINT "membership_space_id_space_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."space"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "space" ADD CONSTRAINT "space_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "domain_space_id_idx" ON "domain" USING btree ("space_id");--> statement-breakpoint
CREATE UNIQUE INDEX "domain_domain_name_idx" ON "domain" USING btree ("domain_name");--> statement-breakpoint
CREATE UNIQUE INDEX "domain_dns_key_idx" ON "domain" USING btree ("dns_key");--> statement-breakpoint
CREATE INDEX "file_space_id_idx" ON "file" USING btree ("space_id");--> statement-breakpoint
CREATE INDEX "file_slug_idx" ON "file" USING btree ("slug");