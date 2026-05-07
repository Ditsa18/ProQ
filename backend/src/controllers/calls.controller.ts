import type { Context } from "hono";
import { db } from "../db";
import { calls } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { ok, err } from "../utils/response";
import type { AppVariables } from "../types/context";
import type { AnalysisData, Message } from "../types/api";

type C = Context<{ Variables: AppVariables }>;

export const list = async (c: C) => {
  const result = await db.select().from(calls).orderBy(desc(calls.createdAt));
  return c.json(ok(result));
};

export const create = async (c: C) => {
  const body = await c.req.json<{ requestId?: string; status?: string }>();
  const [call] = await db
    .insert(calls)
    .values({ requestId: body.requestId, status: body.status ?? "active", startTime: new Date() })
    .returning();
  return c.json(ok(call), 201);
};

export const get = async (c: C) => {
  const id = c.req.param("id")!;
  const [call] = await db.select().from(calls).where(eq(calls.id, id));
  if (!call) return c.json(err("Not found"), 404);
  return c.json(ok(call));
};

export const saveAnalysis = async (c: C) => {
  const id = c.req.param("id")!;
  const body = await c.req.json<{ analysis: AnalysisData; transcript?: Message[]; status?: string }>();
  const [updated] = await db
    .update(calls)
    .set({ analysis: body.analysis, transcript: body.transcript, status: body.status ?? "completed", endTime: new Date() })
    .where(eq(calls.id, id))
    .returning();
  if (!updated) return c.json(err("Not found"), 404);
  return c.json(ok(updated));
};
