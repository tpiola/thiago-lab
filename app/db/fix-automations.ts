import "dotenv/config";
import mysql from "mysql2/promise";

async function main() {
  const pool = mysql.createPool({
    uri: process.env.DATABASE_URL || "",
    connectionLimit: 1,
  });
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS automations (
      id bigint unsigned auto_increment primary key,
      name varchar(255) not null,
      description text,
      \`trigger\` enum('schedule','webhook','manual','event') default 'manual' not null,
      status enum('active','paused','draft','error') default 'draft' not null,
      nodes json,
      runCount int default 0,
      lastRunAt timestamp NULL,
      createdAt timestamp default now() not null
    )
  `);
  console.log("automations OK");
  await pool.end();
}
main().catch(console.error);
