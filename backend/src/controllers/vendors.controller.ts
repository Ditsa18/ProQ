import type { Context } from "hono";
import { db } from "../db";
import { vendors, vendorAssignments, serviceRequests } from "../db/schema";
import { eq } from "drizzle-orm";
import { ok, err } from "../utils/response";
import type { AppVariables } from "../types/context";

type C = Context<{ Variables: AppVariables }>;

export const list = async (c: C) => {
  const { search } = c.req.query();
  const result = await db.select().from(vendors).orderBy(vendors.name);
  if (!search) return c.json(ok(result));
  const lower = search.toLowerCase();
  return c.json(ok(result.filter((v) => v.name.toLowerCase().includes(lower))));
};

export const get = async (c: C) => {
  const id = c.req.param("id")!;
  const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id));
  if (!vendor) return c.json(err("Not found"), 404);
  return c.json(ok(vendor));
};

export const create = async (c: C) => {
  const body = await c.req.json<{ name: string; location?: string; phone?: string; rating?: string; tags?: string[] }>();
  const [vendor] = await db.insert(vendors).values(body).returning();
  return c.json(ok(vendor), 201);
};

export const update = async (c: C) => {
  const id = c.req.param("id")!;
  const body = await c.req.json<Partial<{ name: string; location: string; phone: string; rating: string; tags: string[] }>>();
  const [updated] = await db.update(vendors).set(body).where(eq(vendors.id, id)).returning();
  if (!updated) return c.json(err("Not found"), 404);
  return c.json(ok(updated));
};

export const remove = async (c: C) => {
  const id = c.req.param("id")!;
  const [deleted] = await db.delete(vendors).where(eq(vendors.id, id)).returning();
  if (!deleted) return c.json(err("Not found"), 404);
  return c.json(ok({ id: deleted.id }));
};

export const assign = async (c: C) => {
  const vendorId = c.req.param("id")!;
  const { requestId, rfpId } = await c.req.json<{ requestId: string; rfpId?: string }>();
  const [assignment] = await db
    .insert(vendorAssignments)
    .values({ requestId, rfpId, vendorIds: [vendorId] })
    .returning();
  await db
    .update(serviceRequests)
    .set({ status: "Assigned", updatedAt: new Date() })
    .where(eq(serviceRequests.id, requestId));
  return c.json(ok(assignment), 201);
};

export const suggestions = async (c: C) => {
  const { serviceType } = c.req.query();
  if (!serviceType) return c.json(err("serviceType is required"), 400);
  const all = await db.select().from(vendors);
  const lower = serviceType.toLowerCase();
  const matches = all.filter((v) =>
    (v.tags as string[]).some((tag) => tag.toLowerCase().includes(lower))
  );
  return c.json(ok(matches));
};
