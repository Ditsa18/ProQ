import { Hono } from "hono";
import { requireAuth } from "../middlewares/session.middleware";
import * as rfp from "../controllers/rfp.controller";
import type { AppVariables } from "../types/context";

const router = new Hono<{ Variables: AppVariables }>();
router.use("*", requireAuth);

router.get("/", rfp.list);
router.post("/", rfp.create);
router.get("/:id", rfp.get);
router.put("/:id", rfp.update);
router.post("/:id/boq", rfp.saveBoq);
router.get("/:id/boq", rfp.getBoq);

export default router;
