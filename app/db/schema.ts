import {
  mysqlTable,
  mysqlEnum,
  serial,
  bigint,
  varchar,
  text,
  timestamp,
  int,
  json,
  boolean,
} from "drizzle-orm/mysql-core";

// ─── Users ───
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastLoginAt: timestamp("lastLoginAt"),
});

// ─── Contacts / Leads ───
export const contacts = mysqlTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  company: varchar("company", { length: 255 }),
  source: varchar("source", { length: 100 }).default("organic"),
  status: mysqlEnum("status", ["new","contacted","qualified","proposal","negotiation","closed_won","closed_lost"]).default("new").notNull(),
  value: int("value").default(0),
  tags: json("tags").$type<string[]>(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

// ─── Deals / Pipeline ───
export const deals = mysqlTable("deals", {
  id: serial("id").primaryKey(),
  contactId: bigint("contactId", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  value: int("value").default(0),
  stage: mysqlEnum("stage", ["new","qualified","proposal","negotiation","closed_won","closed_lost"]).default("new").notNull(),
  priority: mysqlEnum("priority", ["low","medium","high"]).default("medium").notNull(),
  closeDate: timestamp("closeDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Projects (Notion-style) ───
export const projects = mysqlTable("projects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["planning","active","paused","completed","archived"]).default("planning").notNull(),
  priority: mysqlEnum("priority", ["low","medium","high","urgent"]).default("medium").notNull(),
  icon: varchar("icon", { length: 50 }).default("folder"),
  color: varchar("color", { length: 20 }).default("#00ff88"),
  tags: json("tags").$type<string[]>(),
  budget: int("budget").default(0),
  revenue: int("revenue").default(0),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  properties: json("properties").$type<Record<string, any>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

// ─── Tasks (within projects) ───
export const tasks = mysqlTable("tasks", {
  id: serial("id").primaryKey(),
  projectId: bigint("projectId", { mode: "number", unsigned: true }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["todo","in_progress","review","done"]).default("todo").notNull(),
  priority: mysqlEnum("priority", ["low","medium","high"]).default("medium").notNull(),
  assignee: varchar("assignee", { length: 255 }),
  dueDate: timestamp("dueDate"),
  tags: json("tags").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

// ─── Documents / Wiki (Notion-style) ───
export const documents = mysqlTable("documents", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  icon: varchar("icon", { length: 50 }).default("page"),
  parentId: bigint("parentId", { mode: "number", unsigned: true }),
  isPublished: boolean("isPublished").default(false),
  views: int("views").default(0),
  properties: json("properties").$type<Record<string, any>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

// ─── Automations / Workflows ───
export const automations = mysqlTable("automations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  trigger: mysqlEnum("trigger", ["schedule","webhook","manual","event"]).default("manual").notNull(),
  status: mysqlEnum("status", ["active","paused","draft","error"]).default("draft").notNull(),
  nodes: json("nodes").$type<{ id: string; type: string; label: string; config?: Record<string, any> }[]>(),
  runCount: int("runCount").default(0),
  lastRunAt: timestamp("lastRunAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Research / Scrapes (Accio-style) ───
export const research = mysqlTable("research", {
  id: serial("id").primaryKey(),
  query: varchar("query", { length: 500 }).notNull(),
  source: mysqlEnum("source", ["web","reddit","linkedin","x","youtube","github","news"]).default("web").notNull(),
  results: json("results").$type<{ title: string; url: string; snippet: string; score?: number }[]>(),
  summary: text("summary"),
  status: mysqlEnum("status", ["pending","running","completed","failed"]).default("pending").notNull(),
  resultCount: int("resultCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Monetization Templates ───
export const templates = mysqlTable("templates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: mysqlEnum("category", ["saas","agency","content","ecommerce","affiliate","course","community","freelance"]).notNull(),
  description: text("description"),
  strategy: text("strategy"),
  steps: json("steps").$type<{ order: number; title: string; description: string; tools: string[]; timeline: string }[]>(),
  expectedRevenue: varchar("expectedRevenue", { length: 100 }),
  difficulty: mysqlEnum("difficulty", ["beginner","intermediate","advanced"]).default("intermediate").notNull(),
  isActive: boolean("isActive").default(true),
  used: int("used").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Funnels ───
export const funnels = mysqlTable("funnels", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  steps: json("steps").$type<{ name: string; type: string; url?: string }[]>(),
  published: boolean("published").default(false),
  visits: int("visits").default(0),
  conversions: int("conversions").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Courses ───
export const courses = mysqlTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  thumbnail: varchar("thumbnail", { length: 500 }),
  price: int("price").default(0),
  published: boolean("published").default(false),
  modules: json("modules").$type<{ title: string; lessons: { title: string; videoUrl?: string; content?: string }[] }[]>(),
  enrollments: int("enrollments").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Communities ───
export const communities = mysqlTable("communities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  members: int("members").default(0),
  posts: json("posts").$type<{ author: string; content: string; likes: number; createdAt: string }[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Campaigns ───
export const campaigns = mysqlTable("campaigns", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 500 }).notNull(),
  body: text("body").notNull(),
  status: mysqlEnum("status", ["draft","scheduled","sent"]).default("draft").notNull(),
  sentCount: int("sentCount").default(0),
  openCount: int("openCount").default(0),
  clickCount: int("clickCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Bookings ───
export const bookings = mysqlTable("bookings", {
  id: serial("id").primaryKey(),
  contactName: varchar("contactName", { length: 255 }).notNull(),
  contactEmail: varchar("contactEmail", { length: 320 }),
  title: varchar("title", { length: 255 }).notNull(),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime").notNull(),
  status: mysqlEnum("status", ["confirmed","cancelled","completed"]).default("confirmed").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── AI Generations ───
export const aiGenerations = mysqlTable("ai_generations", {
  id: serial("id").primaryKey(),
  type: mysqlEnum("type", ["image","video","copy","audio","site"]).notNull(),
  prompt: text("prompt").notNull(),
  resultUrl: varchar("resultUrl", { length: 1000 }),
  resultText: text("resultText"),
  status: mysqlEnum("status", ["pending","completed","failed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Sites ───
export const sites = mysqlTable("sites", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["landing","website","funnel","store"]).default("landing").notNull(),
  content: json("content").$type<Record<string, any>>(),
  published: boolean("published").default(false),
  visits: int("visits").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
