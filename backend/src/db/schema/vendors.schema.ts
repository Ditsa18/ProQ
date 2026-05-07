import { pgTable, uuid, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";

export const vendors = pgTable("vendors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 500 }),
  phone: varchar("phone", { length: 50 }),
  rating: varchar("rating", { length: 10 }),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Vendor = typeof vendors.$inferSelect;
export type NewVendor = typeof vendors.$inferInsert;
