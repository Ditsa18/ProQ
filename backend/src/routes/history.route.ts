import { Hono } from "hono";
import { requireAuth } from "../middlewares/session.middleware";
import * as history from "../controllers/history.controller";
import type { AppVariables } from "../types/context";

const router = new Hono<{ Variables: AppVariables }>();
router.use("*", requireAuth);

router.get("/search", history.search);
router.get("/", history.list);
router.get("/:requestId", history.getOne);

export default router;
