import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@db/schema";

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL || "mysql://root@localhost:4000/test",
  connectionLimit: 10,
});

export function getDb() {
  return drizzle(pool, { schema, mode: "planetscale" });
}
