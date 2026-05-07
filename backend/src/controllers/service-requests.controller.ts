import type { Context } from "hono";
import { db } from "../db";
import { serviceRequests } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { ok, err } from "../utils/response";
import type { AppVariables } from "../types/context";
import type { NewServiceRequest } from "../db/schema";

type C = Context<{ Variables: AppVariables }>;

export const list = async (c: C) => {
  const { status, priority } = c.req.query();
  const conditions = [];
  if (status) conditions.push(eq(serviceRequests.status, status));
  if (priority) conditions.push(eq(serviceRequests.priority, priority));

  const result = await db
    .select()
    .from(serviceRequests)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(serviceRequests.createdAt));
  return c.json(ok(result));
};

export const create = async (c: C) => {
  const user = c.get("user")!;
  const body = await c.req.json<Omit<NewServiceRequest, "id" | "requestId" | "userId" | "createdAt" | "updatedAt">>();
  const requestId = `REQ-${Date.now()}`;
  const [request] = await db
    .insert(serviceRequests)
    .values({ ...body, requestId, userId: user.id })
    .returning();
  return c.json(ok(request), 201);
};

export const get = async (c: C) => {
  const id = c.req.param("id")!;
  const [request] = await db.select().from(serviceRequests).where(eq(serviceRequests.id, id));
  if (!request) return c.json(err("Not found"), 404);
  return c.json(ok(request));
};

export const update = async (c: C) => {
  const id = c.req.param("id")!;
  const body = await c.req.json<Partial<NewServiceRequest>>();
  const [updated] = await db
    .update(serviceRequests)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(serviceRequests.id, id))
    .returning();
  if (!updated) return c.json(err("Not found"), 404);
  return c.json(ok(updated));
};

export const remove = async (c: C) => {
  const id = c.req.param("id")!;
  const [deleted] = await db.delete(serviceRequests).where(eq(serviceRequests.id, id)).returning();
  if (!deleted) return c.json(err("Not found"), 404);
  return c.json(ok({ id: deleted.id }));
};
