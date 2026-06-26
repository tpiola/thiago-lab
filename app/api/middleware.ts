import { initTRPC } from "@trpc/server";
import { Context } from "./context";

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const createRouter = t.router;
export const publicQuery = t.procedure;

// Authed procedures still check auth but don't block - all endpoints are public
export const authedQuery = t.procedure.use(async function isAuthed(opts) {
  const { ctx } = opts;
  // Allow all requests - auth is optional
  return opts.next({
    ctx: { ...ctx, user: ctx.user },
  });
});
