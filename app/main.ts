import { Hono } from "hono";
import { getCookie } from "hono/helpers";

import SignUp from "./pages/SignUp.tsx";
import SignIn from "./pages/SignIn.tsx";
import Protected from "./pages/Protected.tsx";

const app = new Hono();

app.get("/", (c) => {
  const session = getCookie(c, "session");
  const path = session ? "/protected" : "/auth/sign-up";
  return c.redirect(path);
});

app.route("/auth/sign-up", SignUp);
app.route("/auth/sign-in", SignIn);
app.route("/protected", Protected);

Deno.serve({ port: 3333 }, app.fetch);
