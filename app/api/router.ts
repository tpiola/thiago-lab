import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users, contacts, deals, projects, tasks, documents, automations, research, templates, funnels, courses, communities, campaigns, bookings, aiGenerations, sites } from "@db/schema";
import { eq, desc, sql, like } from "drizzle-orm";
import { hashPassword, createToken } from "./auth";

export const appRouter = createRouter({
  // ─── Auth ───
  auth: createRouter({
    login: publicQuery
      .input(z.object({ username: z.string(), password: z.string() }))
      .mutation(async ({ input }) => {
        const db = getDb();
        const hashed = await hashPassword(input.password);
        const usernameLower = input.username.toLowerCase();
        let user = await db.query.users.findFirst({ where: eq(users.username, input.username) });
        if (!user) {
          const result = await db.insert(users).values({
            username: input.username, password: hashed, name: input.username,
            role: usernameLower === "thiago" ? "admin" : "user",
          }).$returningId();
          user = await db.query.users.findFirst({ where: eq(users.id, result[0].id) });
        }
        if (!user || user.password !== hashed) throw new Error("Credenciais invalidas");
        await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));
        const token = await createToken(user.id, user.username);
        return { token, user: { id: user.id, name: user.name, username: user.username, role: user.role } };
      }),
    me: publicQuery.query(async ({ ctx }) => {
      return ctx.user ? { id: ctx.user.id, name: ctx.user.name, username: ctx.user.username, role: ctx.user.role } : null;
    }),
  }),

  // ─── Contacts ───
  contact: createRouter({
    list: authedQuery.query(async () => getDb().query.contacts.findMany({ orderBy: desc(contacts.createdAt) })),
    create: authedQuery.input(z.object({ name: z.string(), email: z.string().optional(), phone: z.string().optional(), company: z.string().optional(), source: z.string().optional(), status: z.enum(["new","contacted","qualified","proposal","negotiation","closed_won","closed_lost"]).optional(), value: z.number().optional(), notes: z.string().optional() }))
      .mutation(async ({ input }) => { const db = getDb(); const r = await db.insert(contacts).values(input).$returningId(); return db.query.contacts.findFirst({ where: eq(contacts.id, r[0].id) }); }),
    update: authedQuery.input(z.object({ id: z.number(), name: z.string().optional(), email: z.string().optional(), phone: z.string().optional(), company: z.string().optional(), status: z.enum(["new","contacted","qualified","proposal","negotiation","closed_won","closed_lost"]).optional(), value: z.number().optional(), notes: z.string().optional() }))
      .mutation(async ({ input }) => { const { id, ...d } = input; await getDb().update(contacts).set(d).where(eq(contacts.id, id)); return getDb().query.contacts.findFirst({ where: eq(contacts.id, id) }); }),
    delete: authedQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => { await getDb().delete(contacts).where(eq(contacts.id, input.id)); return { success: true }; }),
  }),

  // ─── Deals ───
  deal: createRouter({
    list: authedQuery.query(async () => getDb().query.deals.findMany({ orderBy: desc(deals.createdAt) })),
    create: authedQuery.input(z.object({ contactId: z.number(), title: z.string(), value: z.number().optional(), stage: z.enum(["new","qualified","proposal","negotiation","closed_won","closed_lost"]).optional(), priority: z.enum(["low","medium","high"]).optional(), closeDate: z.string().optional() }))
      .mutation(async ({ input }) => { const db = getDb(); const r = await db.insert(deals).values({ ...input, closeDate: input.closeDate ? new Date(input.closeDate) : undefined }).$returningId(); return db.query.deals.findFirst({ where: eq(deals.id, r[0].id) }); }),
    update: authedQuery.input(z.object({ id: z.number(), title: z.string().optional(), value: z.number().optional(), stage: z.enum(["new","qualified","proposal","negotiation","closed_won","closed_lost"]).optional(), priority: z.enum(["low","medium","high"]).optional() }))
      .mutation(async ({ input }) => { const { id, ...d } = input; await getDb().update(deals).set(d).where(eq(deals.id, id)); return getDb().query.deals.findFirst({ where: eq(deals.id, id) }); }),
    delete: authedQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => { await getDb().delete(deals).where(eq(deals.id, input.id)); return { success: true }; }),
    stats: authedQuery.query(async () => {
      const all = await getDb().query.deals.findMany();
      const total = all.length; const won = all.filter(d => d.stage === "closed_won").reduce((s, d) => s + (d.value || 0), 0);
      const pipeline = all.filter(d => d.stage !== "closed_won" && d.stage !== "closed_lost").reduce((s, d) => s + (d.value || 0), 0);
      const wonCount = all.filter(d => d.stage === "closed_won").length;
      const winRate = total > 0 ? Math.round((wonCount / total) * 100) : 0;
      const byStage: Record<string, { count: number; value: number }> = {};
      for (const d of all) { if (!byStage[d.stage]) byStage[d.stage] = { count: 0, value: 0 }; byStage[d.stage].count++; byStage[d.stage].value += d.value || 0; }
      return { total, won, pipeline, wonCount, winRate, byStage };
    }),
  }),

  // ─── Projects (Notion-style) ───
  project: createRouter({
    list: authedQuery.query(async () => getDb().query.projects.findMany({ orderBy: desc(projects.updatedAt) })),
    create: authedQuery.input(z.object({ name: z.string(), description: z.string().optional(), status: z.enum(["planning","active","paused","completed","archived"]).optional(), priority: z.enum(["low","medium","high","urgent"]).optional(), icon: z.string().optional(), color: z.string().optional(), tags: z.array(z.string()).optional(), budget: z.number().optional(), startDate: z.string().optional(), endDate: z.string().optional() }))
      .mutation(async ({ input }) => { const db = getDb(); const r = await db.insert(projects).values({ ...input, startDate: input.startDate ? new Date(input.startDate) : undefined, endDate: input.endDate ? new Date(input.endDate) : undefined }).$returningId(); return db.query.projects.findFirst({ where: eq(projects.id, r[0].id) }); }),
    update: authedQuery.input(z.object({ id: z.number(), name: z.string().optional(), description: z.string().optional(), status: z.enum(["planning","active","paused","completed","archived"]).optional(), priority: z.enum(["low","medium","high","urgent"]).optional(), color: z.string().optional(), tags: z.array(z.string()).optional(), budget: z.number().optional(), revenue: z.number().optional() }))
      .mutation(async ({ input }) => { const { id, ...d } = input; await getDb().update(projects).set(d).where(eq(projects.id, id)); return getDb().query.projects.findFirst({ where: eq(projects.id, id) }); }),
    delete: authedQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => { await getDb().delete(projects).where(eq(projects.id, input.id)); return { success: true }; }),
    stats: authedQuery.query(async () => {
      const all = await getDb().query.projects.findMany();
      const total = all.length;
      const active = all.filter(p => p.status === "active").length;
      const completed = all.filter(p => p.status === "completed").length;
      const totalRevenue = all.reduce((s, p) => s + (p.revenue || 0), 0);
      const totalBudget = all.reduce((s, p) => s + (p.budget || 0), 0);
      return { total, active, completed, totalRevenue, totalBudget };
    }),
  }),

  // ─── Tasks ───
  task: createRouter({
    list: authedQuery.query(async () => getDb().query.tasks.findMany({ orderBy: desc(tasks.createdAt) })),
    byProject: authedQuery.input(z.object({ projectId: z.number() })).query(async ({ input }) => getDb().query.tasks.findMany({ where: eq(tasks.projectId, input.projectId), orderBy: desc(tasks.createdAt) })),
    create: authedQuery.input(z.object({ projectId: z.number().optional(), title: z.string(), description: z.string().optional(), status: z.enum(["todo","in_progress","review","done"]).optional(), priority: z.enum(["low","medium","high"]).optional(), assignee: z.string().optional(), dueDate: z.string().optional(), tags: z.array(z.string()).optional() }))
      .mutation(async ({ input }) => { const db = getDb(); const r = await db.insert(tasks).values({ ...input, dueDate: input.dueDate ? new Date(input.dueDate) : undefined }).$returningId(); return db.query.tasks.findFirst({ where: eq(tasks.id, r[0].id) }); }),
    update: authedQuery.input(z.object({ id: z.number(), title: z.string().optional(), description: z.string().optional(), status: z.enum(["todo","in_progress","review","done"]).optional(), priority: z.enum(["low","medium","high"]).optional(), assignee: z.string().optional() }))
      .mutation(async ({ input }) => { const { id, ...d } = input; await getDb().update(tasks).set(d).where(eq(tasks.id, id)); return getDb().query.tasks.findFirst({ where: eq(tasks.id, id) }); }),
    delete: authedQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => { await getDb().delete(tasks).where(eq(tasks.id, input.id)); return { success: true }; }),
  }),

  // ─── Documents / Wiki ───
  document: createRouter({
    list: authedQuery.query(async () => getDb().query.documents.findMany({ orderBy: desc(documents.updatedAt) })),
    create: authedQuery.input(z.object({ title: z.string(), content: z.string().optional(), icon: z.string().optional(), parentId: z.number().optional() }))
      .mutation(async ({ input }) => { const db = getDb(); const r = await db.insert(documents).values(input).$returningId(); return db.query.documents.findFirst({ where: eq(documents.id, r[0].id) }); }),
    update: authedQuery.input(z.object({ id: z.number(), title: z.string().optional(), content: z.string().optional(), isPublished: z.boolean().optional() }))
      .mutation(async ({ input }) => { const { id, ...d } = input; await getDb().update(documents).set(d).where(eq(documents.id, id)); return getDb().query.documents.findFirst({ where: eq(documents.id, id) }); }),
    delete: authedQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => { await getDb().delete(documents).where(eq(documents.id, input.id)); return { success: true }; }),
  }),

  // ─── Automations ───
  automation: createRouter({
    list: authedQuery.query(async () => getDb().query.automations.findMany({ orderBy: desc(automations.createdAt) })),
    create: authedQuery.input(z.object({ name: z.string(), description: z.string().optional(), trigger: z.enum(["schedule","webhook","manual","event"]).optional() }))
      .mutation(async ({ input }) => { const db = getDb(); const r = await db.insert(automations).values({ ...input, nodes: [] }).$returningId(); return db.query.automations.findFirst({ where: eq(automations.id, r[0].id) }); }),
    update: authedQuery.input(z.object({ id: z.number(), name: z.string().optional(), status: z.enum(["active","paused","draft","error"]).optional(), nodes: z.array(z.any()).optional() }))
      .mutation(async ({ input }) => { const { id, ...d } = input; await getDb().update(automations).set(d).where(eq(automations.id, id)); return getDb().query.automations.findFirst({ where: eq(automations.id, id) }); }),
    run: authedQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await getDb().update(automations).set({ runCount: sql`${automations.runCount} + 1`, lastRunAt: new Date(), status: "active" }).where(eq(automations.id, input.id));
      return { success: true };
    }),
    delete: authedQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => { await getDb().delete(automations).where(eq(automations.id, input.id)); return { success: true }; }),
  }),

  // ─── Research / Scrapes ───
  research: createRouter({
    list: authedQuery.query(async () => getDb().query.research.findMany({ orderBy: desc(research.createdAt) })),
    create: authedQuery.input(z.object({ query: z.string(), source: z.enum(["web","reddit","linkedin","x","youtube","github","news"]).optional() }))
      .mutation(async ({ input }) => { const db = getDb(); const r = await db.insert(research).values(input).$returningId(); return db.query.research.findFirst({ where: eq(research.id, r[0].id) }); }),
    complete: authedQuery.input(z.object({ id: z.number(), results: z.array(z.any()).optional(), summary: z.string().optional() }))
      .mutation(async ({ input }) => { const { id, ...d } = input; await getDb().update(research).set({ ...d, status: "completed", resultCount: d.results?.length || 0 }).where(eq(research.id, id)); return getDb().query.research.findFirst({ where: eq(research.id, id) }); }),
    delete: authedQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => { await getDb().delete(research).where(eq(research.id, input.id)); return { success: true }; }),
  }),

  // ─── Templates (Monetization) ───
  template: createRouter({
    list: authedQuery.query(async () => getDb().query.templates.findMany({ orderBy: desc(templates.createdAt) })),
    create: authedQuery.input(z.object({ name: z.string(), category: z.enum(["saas","agency","content","ecommerce","affiliate","course","community","freelance"]), description: z.string().optional(), strategy: z.string().optional(), expectedRevenue: z.string().optional(), difficulty: z.enum(["beginner","intermediate","advanced"]).optional() }))
      .mutation(async ({ input }) => { const db = getDb(); const r = await db.insert(templates).values(input).$returningId(); return db.query.templates.findFirst({ where: eq(templates.id, r[0].id) }); }),
    use: authedQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await getDb().update(templates).set({ used: sql`${templates.used} + 1` }).where(eq(templates.id, input.id));
      return { success: true };
    }),
    delete: authedQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => { await getDb().delete(templates).where(eq(templates.id, input.id)); return { success: true }; }),
  }),

  // ─── Funnels ───
  funnel: createRouter({
    list: authedQuery.query(async () => getDb().query.funnels.findMany({ orderBy: desc(funnels.createdAt) })),
    create: authedQuery.input(z.object({ name: z.string(), slug: z.string(), steps: z.array(z.any()).optional() })).mutation(async ({ input }) => { const db = getDb(); const r = await db.insert(funnels).values({ ...input, steps: input.steps || [] }).$returningId(); return db.query.funnels.findFirst({ where: eq(funnels.id, r[0].id) }); }),
    update: authedQuery.input(z.object({ id: z.number(), published: z.boolean().optional() })).mutation(async ({ input }) => { const { id, ...d } = input; await getDb().update(funnels).set(d).where(eq(funnels.id, id)); return getDb().query.funnels.findFirst({ where: eq(funnels.id, id) }); }),
    delete: authedQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => { await getDb().delete(funnels).where(eq(funnels.id, input.id)); return { success: true }; }),
  }),

  // ─── Courses ───
  course: createRouter({
    list: authedQuery.query(async () => getDb().query.courses.findMany({ orderBy: desc(courses.createdAt) })),
    create: authedQuery.input(z.object({ title: z.string(), description: z.string().optional(), price: z.number().optional() })).mutation(async ({ input }) => { const db = getDb(); const r = await db.insert(courses).values({ ...input, modules: [] }).$returningId(); return db.query.courses.findFirst({ where: eq(courses.id, r[0].id) }); }),
    update: authedQuery.input(z.object({ id: z.number(), published: z.boolean().optional() })).mutation(async ({ input }) => { const { id, ...d } = input; await getDb().update(courses).set(d).where(eq(courses.id, id)); return getDb().query.courses.findFirst({ where: eq(courses.id, id) }); }),
    delete: authedQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => { await getDb().delete(courses).where(eq(courses.id, input.id)); return { success: true }; }),
  }),

  // ─── Communities ───
  community: createRouter({
    list: authedQuery.query(async () => getDb().query.communities.findMany({ orderBy: desc(communities.createdAt) })),
    create: authedQuery.input(z.object({ name: z.string(), description: z.string().optional() })).mutation(async ({ input }) => { const db = getDb(); const r = await db.insert(communities).values({ ...input, posts: [], members: 1 }).$returningId(); return db.query.communities.findFirst({ where: eq(communities.id, r[0].id) }); }),
    addPost: authedQuery.input(z.object({ id: z.number(), author: z.string(), content: z.string() })).mutation(async ({ input }) => { const comm = await getDb().query.communities.findFirst({ where: eq(communities.id, input.id) }); if (!comm) throw new Error("Not found"); const posts = (comm.posts as any[]) || []; posts.unshift({ author: input.author, content: input.content, likes: 0, createdAt: new Date().toISOString() }); await getDb().update(communities).set({ posts }).where(eq(communities.id, input.id)); return getDb().query.communities.findFirst({ where: eq(communities.id, input.id) }); }),
    delete: authedQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => { await getDb().delete(communities).where(eq(communities.id, input.id)); return { success: true }; }),
  }),

  // ─── Campaigns ───
  campaign: createRouter({
    list: authedQuery.query(async () => getDb().query.campaigns.findMany({ orderBy: desc(campaigns.createdAt) })),
    create: authedQuery.input(z.object({ name: z.string(), subject: z.string(), body: z.string() })).mutation(async ({ input }) => { const db = getDb(); const r = await db.insert(campaigns).values(input).$returningId(); return db.query.campaigns.findFirst({ where: eq(campaigns.id, r[0].id) }); }),
    update: authedQuery.input(z.object({ id: z.number(), status: z.enum(["draft","scheduled","sent"]).optional(), sentCount: z.number().optional() })).mutation(async ({ input }) => { const { id, ...d } = input; await getDb().update(campaigns).set(d).where(eq(campaigns.id, id)); return getDb().query.campaigns.findFirst({ where: eq(campaigns.id, id) }); }),
    delete: authedQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => { await getDb().delete(campaigns).where(eq(campaigns.id, input.id)); return { success: true }; }),
  }),

  // ─── Bookings ───
  booking: createRouter({
    list: authedQuery.query(async () => getDb().query.bookings.findMany({ orderBy: desc(bookings.createdAt) })),
    create: authedQuery.input(z.object({ contactName: z.string(), contactEmail: z.string().optional(), title: z.string(), startTime: z.string(), endTime: z.string(), notes: z.string().optional() })).mutation(async ({ input }) => { const db = getDb(); const r = await db.insert(bookings).values({ ...input, startTime: new Date(input.startTime), endTime: new Date(input.endTime) }).$returningId(); return db.query.bookings.findFirst({ where: eq(bookings.id, r[0].id) }); }),
    update: authedQuery.input(z.object({ id: z.number(), status: z.enum(["confirmed","cancelled","completed"]).optional() })).mutation(async ({ input }) => { const { id, ...d } = input; await getDb().update(bookings).set(d).where(eq(bookings.id, id)); return getDb().query.bookings.findFirst({ where: eq(bookings.id, id) }); }),
    delete: authedQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => { await getDb().delete(bookings).where(eq(bookings.id, input.id)); return { success: true }; }),
  }),

  // ─── AI Generations ───
  ai: createRouter({
    list: authedQuery.query(async () => getDb().query.aiGenerations.findMany({ orderBy: desc(aiGenerations.createdAt) })),
    create: authedQuery.input(z.object({ type: z.enum(["image","video","copy","audio","site"]), prompt: z.string() })).mutation(async ({ input }) => { const db = getDb(); const r = await db.insert(aiGenerations).values(input).$returningId(); return db.query.aiGenerations.findFirst({ where: eq(aiGenerations.id, r[0].id) }); }),
    complete: authedQuery.input(z.object({ id: z.number(), resultUrl: z.string().optional(), resultText: z.string().optional() })).mutation(async ({ input }) => { const { id, ...d } = input; await getDb().update(aiGenerations).set({ ...d, status: "completed" }).where(eq(aiGenerations.id, id)); return getDb().query.aiGenerations.findFirst({ where: eq(aiGenerations.id, id) }); }),
    delete: authedQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => { await getDb().delete(aiGenerations).where(eq(aiGenerations.id, input.id)); return { success: true }; }),
  }),

  // ─── Sites ───
  site: createRouter({
    list: authedQuery.query(async () => getDb().query.sites.findMany({ orderBy: desc(sites.createdAt) })),
    create: authedQuery.input(z.object({ name: z.string(), slug: z.string(), type: z.enum(["landing","website","funnel","store"]).optional() })).mutation(async ({ input }) => { const db = getDb(); const r = await db.insert(sites).values({ ...input, content: {} }).$returningId(); return db.query.sites.findFirst({ where: eq(sites.id, r[0].id) }); }),
    update: authedQuery.input(z.object({ id: z.number(), published: z.boolean().optional() })).mutation(async ({ input }) => { const { id, ...d } = input; await getDb().update(sites).set(d).where(eq(sites.id, id)); return getDb().query.sites.findFirst({ where: eq(sites.id, id) }); }),
    delete: authedQuery.input(z.object({ id: z.number() })).mutation(async ({ input }) => { await getDb().delete(sites).where(eq(sites.id, input.id)); return { success: true }; }),
  }),
});

export type AppRouter = typeof appRouter;
