import { Hono } from "hono";
import { requireAuth } from "../middlewares/session.middleware";
import * as vendors from "../controllers/vendors.controller";
import type { AppVariables } from "../types/context";

const router = new Hono<{ Variables: AppVariables }>();
router.use("*", requireAuth);

router.get("/suggestions", vendors.suggestions);
router.get("/", vendors.list);
router.post("/", vendors.create);
router.get("/:id", vendors.get);
router.put("/:id", vendors.update);
router.delete("/:id", vendors.remove);
router.post("/:id/assign", vendors.assign);

export default router;
