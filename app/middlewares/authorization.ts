import type { Context, Next } from "hono";
import { getCookie } from "hono/helpers";

export const isLoggedIn = async (c: Context, next: Next) => {
  const session = getCookie(c, "session");
  if (session) return await next();
  return c.redirect("/auth/sign-in");
};

export const isLoggedOut = async (c: Context, next: Next) => {
  const session = getCookie(c, "session");
  if (!session) return await next();
  return c.redirect("/protected");
};
