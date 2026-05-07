import { Hono } from "hono";
import callsRouter from "./calls.route";
import serviceRequestsRouter from "./service-requests.route";
import rfpRouter from "./rfp.route";
import vendorsRouter from "./vendors.route";
import historyRouter from "./history.route";
import dashboardRouter from "./dashboard.route";
import type { AppVariables } from "../types/context";

const api = new Hono<{ Variables: AppVariables }>();

api.route("/calls", callsRouter);
api.route("/service-requests", serviceRequestsRouter);
api.route("/rfp", rfpRouter);
api.route("/vendors", vendorsRouter);
api.route("/history", historyRouter);
api.route("/dashboard", dashboardRouter);

export default api;
