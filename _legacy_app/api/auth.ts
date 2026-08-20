import { SignJWT, jwtVerify } from "jose";
import { getDb } from "./queries/connection";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";

const SECRET = new TextEncoder().encode("sovereign-os-secret-key-2026-thiagolab");

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "sovereign-salt");
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function createToken(userId: number, username: string): Promise<string> {
  return new SignJWT({ userId, username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET, { clockTolerance: 60 });
    return payload as { userId: number; username: string };
  } catch {
    return null;
  }
}

export async function getAuthUser(req: Request) {
  // Try x-auth-token header first (localStorage method)
  const headerToken = req.headers.get("x-auth-token");
  if (headerToken) {
    const payload = await verifyToken(headerToken);
    if (payload) {
      const db = getDb();
      const user = await db.query.users.findFirst({ where: eq(users.id, payload.userId) });
      return user || null;
    }
  }

  // Fallback to cookie (legacy method)
  const cookie = req.headers.get("cookie");
  if (cookie) {
    const match = cookie.match(/auth-token=([^;]+)/);
    if (match) {
      const payload = await verifyToken(match[1]);
      if (payload) {
        const db = getDb();
        const user = await db.query.users.findFirst({ where: eq(users.id, payload.userId) });
        return user || null;
      }
    }
  }

  return null;
}
