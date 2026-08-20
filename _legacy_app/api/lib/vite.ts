import type { Hono } from "hono";
import type { HttpBindings } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

type App = Hono<{ Bindings: HttpBindings }>;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function serveStaticFiles(app: App) {
  const distPath = path.resolve(__dirname, "../../dist/public");
  const indexPath = path.resolve(distPath, "index.html");

  console.log("[Static] distPath:", distPath);
  console.log("[Static] indexPath:", indexPath);
  console.log("[Static] dist exists:", fs.existsSync(distPath));
  console.log("[Static] index exists:", fs.existsSync(indexPath));

  if (!fs.existsSync(indexPath)) {
    console.error("[Static] ERROR: index.html not found!");
    app.get("/", (c) => c.text("THIAGOLAB - Build output not found. Please rebuild.", 500));
    return;
  }

  // Serve static files from dist/public
  app.use("/assets/*", serveStatic({ root: distPath }));

  // SPA fallback - serve index.html for all non-API routes
  app.get("*", (c) => {
    const url = c.req.path;
    // Don't interfere with API routes
    if (url.startsWith("/api/")) return c.notFound();

    // Serve index.html for all other routes (SPA)
    const content = fs.readFileSync(indexPath, "utf-8");
    return c.html(content);
  });
}
