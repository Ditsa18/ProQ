import { pgTable, uuid, varchar, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import type { BOQItem } from "../../types/api";
import { serviceRequests } from "./service-requests.schema";

export const rfpDocuments = pgTable("rfp_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  rfpId: varchar("rfp_id", { length: 50 }).notNull().unique(),
  requestId: uuid("request_id").references(() => serviceRequests.id, { onDelete: "set null" }),
  priority: varchar("priority", { length: 20 }),
  title: varchar("title", { length: 500 }).notNull(),
  serviceType: varchar("service_type", { length: 255 }),
  description: text("description"),
  scope: text("scope"),
  specifications: jsonb("specifications").$type<string[]>().default([]),
  evaluationCriteria: jsonb("evaluation_criteria").$type<string[]>().default([]),
  rfpStatus: varchar("rfp_status", { length: 20 }).notNull().default("Draft"),
  vendorStatus: varchar("vendor_status", { length: 20 }).notNull().default("Pending"),
  boq: jsonb("boq").$type<BOQItem[]>().default([]),
  dateTime: timestamp("date_time"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  approvedAt: timestamp("approved_at"),
});

export type RfpDocument = typeof rfpDocuments.$inferSelect;
export type NewRfpDocument = typeof rfpDocuments.$inferInsert;
