import { pgTable, uuid, text, jsonb, timestamp, integer } from "drizzle-orm/pg-core";
import type { Message, AnalysisData } from "../../types/api";
import { serviceRequests } from "./service-requests.schema";

export const calls = pgTable("calls", {
  id: uuid("id").primaryKey().defaultRandom(),
  requestId: uuid("request_id").references(() => serviceRequests.id, { onDelete: "set null" }),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  duration: integer("duration"),
  transcript: jsonb("transcript").$type<Message[]>().default([]),
  analysis: jsonb("analysis").$type<AnalysisData>(),
  customerRecordingUrl: text("customer_recording_url"),
  assistantRecordingUrl: text("assistant_recording_url"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Call = typeof calls.$inferSelect;
export type NewCall = typeof calls.$inferInsert;
