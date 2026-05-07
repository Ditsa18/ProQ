import { pgTable, uuid, jsonb, timestamp, text } from "drizzle-orm/pg-core";
import { serviceRequests } from "./service-requests.schema";
import { rfpDocuments } from "./rfp-documents.schema";

export const vendorAssignments = pgTable("vendor_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  requestId: uuid("request_id").references(() => serviceRequests.id, { onDelete: "cascade" }),
  rfpId: uuid("rfp_id").references(() => rfpDocuments.id, { onDelete: "set null" }),
  vendorIds: jsonb("vendor_ids").$type<string[]>().default([]),
  assignedAt: timestamp("assigned_at").notNull().defaultNow(),
  status: text("status").notNull().default("pending"),
});

export type VendorAssignment = typeof vendorAssignments.$inferSelect;
export type NewVendorAssignment = typeof vendorAssignments.$inferInsert;
