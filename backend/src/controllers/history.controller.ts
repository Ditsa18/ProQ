import type { Context } from "hono";
import { db } from "../db";
import { serviceRequests, calls, rfpDocuments } from "../db/schema";
import { eq, and, desc, gte, lte } from "drizzle-orm";
import { ok, err } from "../utils/response";
import type { AppVariables } from "../types/context";

type C = Context<{ Variables: AppVariables }>;

export const list = async (c: C) => {
  const result = await db.select().from(serviceRequests).orderBy(desc(serviceRequests.updatedAt));
  return c.json(ok(result));
};

export const search = async (c: C) => {
  const { priority, status, from, to } = c.req.query();
  const conditions = [];
  if (priority) conditions.push(eq(serviceRequests.priority, priority));
  if (status) conditions.push(eq(serviceRequests.status, status));
  if (from) conditions.push(gte(serviceRequests.createdAt, new Date(from)));
  if (to) conditions.push(lte(serviceRequests.createdAt, new Date(to)));

  const result = await db
    .select()
    .from(serviceRequests)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(serviceRequests.createdAt));
  return c.json(ok(result));
};

export const getOne = async (c: C) => {
  const requestId = c.req.param("requestId")!;
  const [request] = await db.select().from(serviceRequests).where(eq(serviceRequests.id, requestId));
  if (!request) return c.json(err("Not found"), 404);

  const [relatedCalls, relatedRfps] = await Promise.all([
    db.select().from(calls).where(eq(calls.requestId, requestId)),
    db.select().from(rfpDocuments).where(eq(rfpDocuments.requestId, requestId)),
  ]);

  return c.json(ok({ request, calls: relatedCalls, rfps: relatedRfps }));
};
