import { betterAuth } from "better-auth";
import { pool } from "../db";

export const auth = betterAuth({
  database: pool,
  emailAndPassword: { enabled: true },
  trustedOrigins: (process.env.TRUSTED_ORIGINS ?? "http://localhost:3000").split(","),
});
