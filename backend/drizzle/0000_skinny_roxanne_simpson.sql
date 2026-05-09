CREATE TABLE "service_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" varchar(50) NOT NULL,
	"priority" varchar(20) DEFAULT 'normal' NOT NULL,
	"status" varchar(30) DEFAULT 'Draft' NOT NULL,
	"service_type" varchar(255) NOT NULL,
	"location" varchar(500),
	"budget" varchar(100),
	"contact_info" text,
	"specifications" jsonb DEFAULT '[]'::jsonb,
	"special_requirements" text,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "service_requests_request_id_unique" UNIQUE("request_id")
);
--> statement-breakpoint
CREATE TABLE "calls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid,
	"start_time" timestamp,
	"end_time" timestamp,
	"duration" integer,
	"transcript" jsonb DEFAULT '[]'::jsonb,
	"analysis" jsonb,
	"customer_recording_url" text,
	"assistant_recording_url" text,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rfp_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rfp_id" varchar(50) NOT NULL,
	"request_id" uuid,
	"priority" varchar(20),
	"title" varchar(500) NOT NULL,
	"service_type" varchar(255),
	"description" text,
	"scope" text,
	"specifications" jsonb DEFAULT '[]'::jsonb,
	"evaluation_criteria" jsonb DEFAULT '[]'::jsonb,
	"rfp_status" varchar(20) DEFAULT 'Draft' NOT NULL,
	"vendor_status" varchar(20) DEFAULT 'Pending' NOT NULL,
	"boq" jsonb DEFAULT '[]'::jsonb,
	"date_time" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"approved_at" timestamp,
	CONSTRAINT "rfp_documents_rfp_id_unique" UNIQUE("rfp_id")
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"location" varchar(500),
	"phone" varchar(50),
	"rating" varchar(10),
	"tags" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendor_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid,
	"rfp_id" uuid,
	"vendor_ids" jsonb DEFAULT '[]'::jsonb,
	"assigned_at" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "calls" ADD CONSTRAINT "calls_request_id_service_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."service_requests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rfp_documents" ADD CONSTRAINT "rfp_documents_request_id_service_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."service_requests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_assignments" ADD CONSTRAINT "vendor_assignments_request_id_service_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."service_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_assignments" ADD CONSTRAINT "vendor_assignments_rfp_id_rfp_documents_id_fk" FOREIGN KEY ("rfp_id") REFERENCES "public"."rfp_documents"("id") ON DELETE set null ON UPDATE no action;