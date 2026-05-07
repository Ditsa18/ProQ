import { Hono } from "hono";
import { requireAuth } from "../middlewares/session.middleware";
import * as dashboard from "../controllers/dashboard.controller";
import type { AppVariables } from "../types/context";

const router = new Hono<{ Variables: AppVariables }>();
router.use("*", requireAuth);

router.get("/stats", dashboard.stats);
router.get("/activity", dashboard.activity);
router.get("/priority-distribution", dashboard.priorityDistribution);
router.get("/vendor-workload", dashboard.vendorWorkload);
router.get("/recent-requests", dashboard.recentRequests);

export default router;
