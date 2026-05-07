import type { Context } from "hono";
import { db } from "../db";
import { serviceRequests, rfpDocuments, vendorAssignments } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { ok } from "../utils/response";
import type { AppVariables } from "../types/context";

type C = Context<{ Variables: AppVariables }>;

export const stats = async (c: C) => {
  const [allRequests, allRfps] = await Promise.all([
    db.select().from(serviceRequests),
    db.select().from(rfpDocuments),
  ]);
  return c.json(
    ok({
      totalRequests: allRequests.length,
      urgentRequests: allRequests.filter((r) => r.priority === "urgent").length,
      pendingApproval: allRfps.filter((r) => r.rfpStatus === "Draft").length,
      vendorAssigned: allRequests.filter((r) => r.status === "Assigned").length,
    })
  );
};

export const activity = async (c: C) => {
  const allRequests = await db.select({ createdAt: serviceRequests.createdAt }).from(serviceRequests);
  const now = new Date();
  const hours = Array.from({ length: 24 }, (_, i) => {
    const from = new Date(now.getTime() - (23 - i + 1) * 3600_000);
    const to = new Date(now.getTime() - (23 - i) * 3600_000);
    const count = allRequests.filter((r) => r.createdAt >= from && r.createdAt < to).length;
    return { hour: `${to.getHours()}:00`, count };
  });
  return c.json(ok(hours));
};

export const priorityDistribution = async (c: C) => {
  const allRequests = await db.select({ priority: serviceRequests.priority }).from(serviceRequests);
  const distribution: Record<string, number> = {};
  for (const r of allRequests) {
    distribution[r.priority] = (distribution[r.priority] ?? 0) + 1;
  }
  return c.json(ok(distribution));
};

export const vendorWorkload = async (c: C) => {
  const assignments = await db.select({ vendorIds: vendorAssignments.vendorIds }).from(vendorAssignments);
  const workload: Record<string, number> = {};
  for (const a of assignments) {
    for (const vid of a.vendorIds as string[]) {
      workload[vid] = (workload[vid] ?? 0) + 1;
    }
  }
  return c.json(ok(workload));
};

export const recentRequests = async (c: C) => {
  const result = await db
    .select()
    .from(serviceRequests)
    .where(eq(serviceRequests.priority, "urgent"))
    .orderBy(desc(serviceRequests.createdAt))
    .limit(10);
  return c.json(ok(result));
};
