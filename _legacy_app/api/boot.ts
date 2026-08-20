import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { createOAuthCallbackHandler } from "./kimi/auth";
import { Paths } from "@contracts/constants";

const app = new Hono<{ Bindings: HttpBindings }>();

// CORS
app.use("*", cors({
  origin: (origin) => origin || "*",
  allowHeaders: ["Content-Type", "Authorization", "x-auth-token"],
  allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
  credentials: false,
}));

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
app.get(Paths.oauthCallback, createOAuthCallbackHandler());

// tRPC API routes
app.use("/api/trpc/*", async (c) => {
  console.log(`[TRPC] ${c.req.method} ${c.req.path}`);
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

// Static files and SPA fallback (handled by vite.ts in production)
export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`[Server] THIAGOLAB running on port ${port}`);
    console.log(`[Server] Environment: production`);
  });
}
