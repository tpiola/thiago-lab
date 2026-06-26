import mysql from "mysql2/promise";

async function main() {
  const pool = mysql.createPool({
    uri: process.env.DATABASE_URL || "mysql://root@localhost:4000/test",
    connectionLimit: 1,
  });

  const [rows] = await pool.execute(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = DATABASE()
  `);
  console.log("Tables found:");
  (rows as any[]).forEach((r) => console.log(" -", r.TABLE_NAME));

  await pool.end();
  process.exit(0);
}

main().catch(console.error);
