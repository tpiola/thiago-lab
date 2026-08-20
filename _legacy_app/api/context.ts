import { getAuthUser } from "./auth";

export async function createContext(req: Request) {
  const user = await getAuthUser(req);
  return { req, user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
