/** @jsx jsx */
/** @jsxFrag Fragment */
import { jsx } from "hono/middleware";
import { renderToReadableStream } from "hono/streaming";
import { Hono } from "hono";
import { setCookie } from "hono/helpers";

import { Document } from "../layouts/Document.tsx";
import { isLoggedOut } from "../middlewares/authorization.ts";

const router = new Hono();

// Action
router.post("/", isLoggedOut, async (c) => {
  const data = await c.req.formData();
  const username = data.get("username")?.toString();
  if (username) {
    setCookie(c, "session", username);
    return c.redirect("/protected");
  }
  return c.redirect("/auth/sign-in");
});

// View
router.get("/", isLoggedOut, (c) => {
  const stream = renderToReadableStream(
    <Document title="Sign in Page">
      <form action="/auth/sign-in" method="POST">
        <div>
          <label for="username">Username:</label>
          <input
            id="username"
            name="username"
            type="text"
            value=""
            minLength="3"
            required
          />
        </div>

        <div>
          <label for="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            value=""
            minLength="8"
            required
          />
        </div>

        <div>
          <button type="submit">Login</button>
          <a href="/auth/sign-up">
            <small>Go to Register</small>
          </a>
        </div>
      </form>
    </Document>,
  );

  return c.body(stream, {
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "Transfer-Encoding": "chunked",
    },
  });
});

export default router;
