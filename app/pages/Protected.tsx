/** @jsx jsx */
/** @jsxFrag Fragment */
import { deleteCookie, ErrorBoundary, type FC, jsx } from "hono/middleware";
import { renderToReadableStream, Suspense } from "hono/streaming";
import { Hono } from "hono";
import { getCookie } from "hono/helpers";

import { Document } from "../layouts/Document.tsx";
import { isLoggedIn } from "../middlewares/authorization.ts";

const router = new Hono();

// Action
router.post("/", isLoggedIn, (c) => {
  deleteCookie(c, "session");
  return c.redirect("/auth/sign-in");
});

//
// View
const TodoList: FC = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  const todos = await response.json() as Array<{ id: number; title: string }>;
  return (
    <ul>
      {todos.map((todo) => <li>{todo.title}</li>)}
    </ul>
  );
};

router.get("/", isLoggedIn, (c) => {
  const session = getCookie(c, "session");

  const stream = renderToReadableStream(
    <Document title="Protected Page">
      <div>
        <h1>Protected route!</h1>
        <p>Hello {session}</p>

        <form action="/protected" method="POST">
          <button type="submit">Logout</button>
        </form>
      </div>

      <ErrorBoundary
        fallback={<h4>An error has occurred, please try again.</h4>}
      >
        <Suspense fallback={<h4>Loading...</h4>}>
          <TodoList />
        </Suspense>
      </ErrorBoundary>
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
