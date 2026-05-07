import { Hono } from "hono";
import { requireAuth } from "../middlewares/session.middleware";
import * as sr from "../controllers/service-requests.controller";
import type { AppVariables } from "../types/context";

const router = new Hono<{ Variables: AppVariables }>();
router.use("*", requireAuth);

router.get("/", sr.list);
router.post("/", sr.create);
router.get("/:id", sr.get);
router.put("/:id", sr.update);
router.delete("/:id", sr.remove);

export default router;
