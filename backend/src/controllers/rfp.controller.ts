import type { Context } from "hono";
import { db } from "../db";
import { rfpDocuments } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { ok, err } from "../utils/response";
import type { AppVariables } from "../types/context";
import type { BOQItem } from "../types/api";
import type { NewRfpDocument } from "../db/schema";

type C = Context<{ Variables: AppVariables }>;

export const list = async (c: C) => {
  const { status } = c.req.query();
  const result = await db
    .select()
    .from(rfpDocuments)
    .where(status ? eq(rfpDocuments.rfpStatus, status) : undefined)
    .orderBy(desc(rfpDocuments.createdAt));
  return c.json(ok(result));
};

export const create = async (c: C) => {
  const body = await c.req.json<Omit<NewRfpDocument, "id" | "rfpId" | "createdAt">>();
  const rfpId = `RFP-${Date.now()}`;
  const [rfp] = await db.insert(rfpDocuments).values({ ...body, rfpId }).returning();
  return c.json(ok(rfp), 201);
};

export const get = async (c: C) => {
  const id = c.req.param("id")!;
  const [rfp] = await db.select().from(rfpDocuments).where(eq(rfpDocuments.id, id));
  if (!rfp) return c.json(err("Not found"), 404);
  return c.json(ok(rfp));
};

export const update = async (c: C) => {
  const id = c.req.param("id")!;
  const body = await c.req.json<Partial<NewRfpDocument>>();
  const updates: Partial<NewRfpDocument> = { ...body };
  if (body.rfpStatus === "Approved") updates.approvedAt = new Date();
  const [updated] = await db.update(rfpDocuments).set(updates).where(eq(rfpDocuments.id, id)).returning();
  if (!updated) return c.json(err("Not found"), 404);
  return c.json(ok(updated));
};

export const saveBoq = async (c: C) => {
  const id = c.req.param("id")!;
  const { boq } = await c.req.json<{ boq: BOQItem[] }>();
  const [updated] = await db.update(rfpDocuments).set({ boq }).where(eq(rfpDocuments.id, id)).returning();
  if (!updated) return c.json(err("Not found"), 404);
  return c.json(ok(updated));
};

export const getBoq = async (c: C) => {
  const id = c.req.param("id")!;
  const [rfp] = await db.select({ boq: rfpDocuments.boq }).from(rfpDocuments).where(eq(rfpDocuments.id, id));
  if (!rfp) return c.json(err("Not found"), 404);
  return c.json(ok(rfp.boq));
};
