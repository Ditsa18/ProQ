import { Hono } from "hono";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { auth } from "./lib/auth";
import routes from "./routes";
import type { AppVariables } from "./types/context";

const app = new Hono<{ Variables: AppVariables }>();

app.use("*", corsMiddleware);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/api", routes);

app.get("/health", (c) => c.json({ status: "ok" }));

export default app;
