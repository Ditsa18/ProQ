import { pgTable, uuid, varchar, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const serviceRequests = pgTable("service_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  requestId: varchar("request_id", { length: 50 }).notNull().unique(),
  priority: varchar("priority", { length: 20 }).notNull().default("normal"),
  status: varchar("status", { length: 30 }).notNull().default("Draft"),
  serviceType: varchar("service_type", { length: 255 }).notNull(),
  location: varchar("location", { length: 500 }),
  budget: varchar("budget", { length: 100 }),
  contactInfo: text("contact_info"),
  specifications: jsonb("specifications").$type<string[]>().default([]),
  specialRequirements: text("special_requirements"),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type ServiceRequest = typeof serviceRequests.$inferSelect;
export type NewServiceRequest = typeof serviceRequests.$inferInsert;
