/** @jsx jsx */
/** @jsxFrag Fragment */
import { type FC, jsx } from "hono/middleware";

export const Document: FC<{ title: string; }> = (props) => {
  return (
    <html>
      <head>
        <title>{props.title}</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css"
        />
      </head>
      <body>{props.children}</body>
    </html>
  );
};
