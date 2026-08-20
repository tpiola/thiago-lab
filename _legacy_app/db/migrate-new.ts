import mysql from "mysql2/promise";

async function main() {
  const pool = mysql.createPool({
    uri: process.env.DATABASE_URL || "mysql://root@localhost:4000/test",
    connectionLimit: 1,
  });

  const tables = [
    `CREATE TABLE IF NOT EXISTS projects (
      id bigint unsigned auto_increment primary key,
      name varchar(255) not null,
      description text,
      status enum('planning','active','paused','completed','archived') default 'planning' not null,
      priority enum('low','medium','high','urgent') default 'medium' not null,
      icon varchar(50) default 'folder',
      color varchar(20) default '#00ff88',
      tags json,
      budget int default 0,
      revenue int default 0,
      startDate timestamp NULL,
      endDate timestamp NULL,
      properties json,
      createdAt timestamp default now() not null,
      updatedAt timestamp default now() not null on update now()
    )`,
    `CREATE TABLE IF NOT EXISTS tasks (
      id bigint unsigned auto_increment primary key,
      projectId bigint unsigned,
      title varchar(255) not null,
      description text,
      status enum('todo','in_progress','review','done') default 'todo' not null,
      priority enum('low','medium','high') default 'medium' not null,
      assignee varchar(255),
      dueDate timestamp NULL,
      tags json,
      createdAt timestamp default now() not null,
      updatedAt timestamp default now() not null on update now()
    )`,
    `CREATE TABLE IF NOT EXISTS documents (
      id bigint unsigned auto_increment primary key,
      title varchar(255) not null,
      content text,
      icon varchar(50) default 'page',
      parentId bigint unsigned,
      isPublished boolean default false,
      views int default 0,
      properties json,
      createdAt timestamp default now() not null,
      updatedAt timestamp default now() not null on update now()
    )`,
    `CREATE TABLE IF NOT EXISTS automations (
      id bigint unsigned auto_increment primary key,
      name varchar(255) not null,
      description text,
      trigger enum('schedule','webhook','manual','event') default 'manual' not null,
      status enum('active','paused','draft','error') default 'draft' not null,
      nodes json,
      runCount int default 0,
      lastRunAt timestamp NULL,
      createdAt timestamp default now() not null
    )`,
    `CREATE TABLE IF NOT EXISTS research (
      id bigint unsigned auto_increment primary key,
      query varchar(500) not null,
      source enum('web','reddit','linkedin','x','youtube','github','news') default 'web' not null,
      results json,
      summary text,
      status enum('pending','running','completed','failed') default 'pending' not null,
      resultCount int default 0,
      createdAt timestamp default now() not null
    )`,
    `CREATE TABLE IF NOT EXISTS templates (
      id bigint unsigned auto_increment primary key,
      name varchar(255) not null,
      category enum('saas','agency','content','ecommerce','affiliate','course','community','freelance') not null,
      description text,
      strategy text,
      steps json,
      expectedRevenue varchar(100),
      difficulty enum('beginner','intermediate','advanced') default 'intermediate' not null,
      isActive boolean default true,
      used int default 0,
      createdAt timestamp default now() not null
    )`,
  ];

  for (const sql of tables) {
    try {
      await pool.execute(sql);
      const tableName = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1];
      console.log(`${tableName} OK`);
    } catch (e: any) {
      console.error("Error:", e.message);
    }
  }

  await pool.end();
  console.log("Migration complete!");
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
