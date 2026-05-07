import { Hono } from "hono";
import { requireAuth } from "../middlewares/session.middleware";
import * as calls from "../controllers/calls.controller";
import type { AppVariables } from "../types/context";

const router = new Hono<{ Variables: AppVariables }>();
router.use("*", requireAuth);

router.get("/", calls.list);
router.post("/", calls.create);
router.get("/:id", calls.get);
router.post("/:id/analysis", calls.saveAnalysis);

export default router;
