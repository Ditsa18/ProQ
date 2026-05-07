import type { auth } from "../lib/auth";

type AuthSession = typeof auth.$Infer.Session;

export type AppVariables = {
  user: AuthSession["user"] | null;
  session: AuthSession["session"] | null;
};
