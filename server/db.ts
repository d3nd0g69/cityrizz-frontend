import { eq, desc, asc, like, or, count, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, subscribers, InsertSubscriber, Subscriber } from "../drizzle/schema";
import { ENV } from './_core/env';
import crypto from "crypto";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ── Subscriber helpers ────────────────────────────────────────────────────────

/** Generate a cryptographically secure unsubscribe token */
function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/** Add a new subscriber. Returns the subscriber or throws if email already exists. */
export async function addSubscriber(
  email: string,
  name?: string,
  source = "newsletter-page",
  newsletters = "all"
): Promise<Subscriber> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const token = generateToken();

  try {
    await db.insert(subscribers).values({
      email: email.toLowerCase().trim(),
      name: name || null,
      token,
      source,
      newsletters,
      status: "active",
    });
  } catch (err: any) {
    // Duplicate email — return existing subscriber
    if (err?.message?.includes("Duplicate") || err?.code === "ER_DUP_ENTRY") {
      const existing = await db
        .select()
        .from(subscribers)
        .where(eq(subscribers.email, email.toLowerCase().trim()))
        .limit(1);
      if (existing.length > 0) return existing[0];
    }
    throw err;
  }

  const result = await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.email, email.toLowerCase().trim()))
    .limit(1);

  return result[0];
}

/** Get subscriber by unsubscribe token */
export async function getSubscriberByToken(token: string): Promise<Subscriber | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(subscribers).where(eq(subscribers.token, token)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/** Mark subscriber as unsubscribed */
export async function unsubscribeByToken(token: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const sub = await getSubscriberByToken(token);
  if (!sub) return false;
  await db
    .update(subscribers)
    .set({ status: "unsubscribed", unsubscribedAt: new Date() })
    .where(eq(subscribers.token, token));
  return true;
}

/** List all subscribers with optional search and pagination */
export async function listSubscribers(opts: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "unsubscribed" | "all";
} = {}): Promise<{ subscribers: Subscriber[]; total: number }> {
  const db = await getDb();
  if (!db) return { subscribers: [], total: 0 };

  const page = opts.page ?? 1;
  const limit = opts.limit ?? 50;
  const offset = (page - 1) * limit;
  const status = opts.status ?? "all";

  let query = db.select().from(subscribers);
  let countQuery = db.select({ value: count() }).from(subscribers);

  // Build where conditions
  const conditions = [];
  if (status !== "all") {
    conditions.push(eq(subscribers.status, status));
  }
  if (opts.search) {
    conditions.push(
      or(
        like(subscribers.email, `%${opts.search}%`),
        like(subscribers.name, `%${opts.search}%`)
      )
    );
  }

  if (conditions.length > 0) {
    const whereClause = conditions.length === 1 ? conditions[0] : conditions.reduce((a, b) => a && b);
    query = query.where(whereClause) as typeof query;
    countQuery = countQuery.where(whereClause) as typeof countQuery;
  }

  const [rows, countResult] = await Promise.all([
    query.orderBy(desc(subscribers.createdAt)).limit(limit).offset(offset),
    countQuery,
  ]);

  return {
    subscribers: rows,
    total: Number(countResult[0]?.value ?? 0),
  };
}

/** Get subscriber stats */
export async function getSubscriberStats(): Promise<{
  total: number;
  active: number;
  unsubscribed: number;
}> {
  const db = await getDb();
  if (!db) return { total: 0, active: 0, unsubscribed: 0 };

  const [totalResult, activeResult, unsubResult] = await Promise.all([
    db.select({ value: count() }).from(subscribers),
    db.select({ value: count() }).from(subscribers).where(eq(subscribers.status, "active")),
    db.select({ value: count() }).from(subscribers).where(eq(subscribers.status, "unsubscribed")),
  ]);

  return {
    total: Number(totalResult[0]?.value ?? 0),
    active: Number(activeResult[0]?.value ?? 0),
    unsubscribed: Number(unsubResult[0]?.value ?? 0),
  };
}

// ── Event helpers ─────────────────────────────────────────────────────────────

import { events, campaigns, InsertEvent, Event, InsertCampaign, Campaign } from "../drizzle/schema";

/** List published events with optional category filter and pagination */
export async function listEvents(opts: {
  page?: number;
  limit?: number;
  category?: string;
  featuredOnly?: boolean;
  upcoming?: boolean;
} = {}): Promise<{ events: Event[]; total: number }> {
  const db = await getDb();
  if (!db) return { events: [], total: 0 };

  const page = opts.page ?? 1;
  const limit = opts.limit ?? 20;
  const offset = (page - 1) * limit;

  const conditions: any[] = [eq(events.status, "published")];

  if (opts.category && opts.category !== "All") {
    conditions.push(eq(events.category, opts.category));
  }
  if (opts.featuredOnly) {
    conditions.push(eq(events.featured, true));
  }
  if (opts.upcoming) {
    const today = new Date().toISOString().slice(0, 10);
    conditions.push(sql`${events.eventDate} >= ${today}`);
  }

  const where = conditions.length === 1 ? conditions[0] : and(...conditions);

  const [rows, countResult] = await Promise.all([
    db.select().from(events).where(where).orderBy(asc(events.eventDate)).limit(limit).offset(offset),
    db.select({ value: count() }).from(events).where(where),
  ]);

  return {
    events: rows,
    total: Number(countResult[0]?.value ?? 0),
  };
}

/** Get a single event by slug */
export async function getEventBySlug(slug: string): Promise<Event | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(events).where(eq(events.slug, slug)).limit(1);
  return result[0];
}

/** Submit a new event (status: pending) */
export async function submitEvent(data: Omit<InsertEvent, "id" | "createdAt" | "updatedAt" | "status">): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(events).values({ ...data, status: "pending" });
}

/** Admin: list all events (any status) */
export async function adminListEvents(opts: {
  page?: number;
  limit?: number;
  status?: "published" | "pending" | "rejected" | "all";
} = {}): Promise<{ events: Event[]; total: number }> {
  const db = await getDb();
  if (!db) return { events: [], total: 0 };

  const page = opts.page ?? 1;
  const limit = opts.limit ?? 50;
  const offset = (page - 1) * limit;

  const conditions: any[] = [];
  if (opts.status && opts.status !== "all") {
    conditions.push(eq(events.status, opts.status));
  }

  const where = conditions.length > 0 ? (conditions.length === 1 ? conditions[0] : and(...conditions)) : undefined;

  const [rows, countResult] = await Promise.all([
    where
      ? db.select().from(events).where(where).orderBy(desc(events.createdAt)).limit(limit).offset(offset)
      : db.select().from(events).orderBy(desc(events.createdAt)).limit(limit).offset(offset),
    where
      ? db.select({ value: count() }).from(events).where(where)
      : db.select({ value: count() }).from(events),
  ]);

  return {
    events: rows,
    total: Number(countResult[0]?.value ?? 0),
  };
}

/** Admin: update event status */
export async function updateEventStatus(id: number, status: "published" | "pending" | "rejected"): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(events).set({ status }).where(eq(events.id, id));
}

// ── Campaign helpers ──────────────────────────────────────────────────────────

/** Create a new campaign draft */
export async function createCampaign(data: Pick<InsertCampaign, "subject" | "previewText" | "bodyHtml" | "bodyText">): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(campaigns).values({ ...data, status: "draft" });
  return (result as any)[0]?.insertId ?? 0;
}

/** Mark campaign as sent */
export async function markCampaignSent(id: number, recipientCount: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(campaigns).set({ status: "sent", recipientCount, sentAt: new Date() }).where(eq(campaigns.id, id));
}

/** List all campaigns */
export async function listCampaigns(): Promise<Campaign[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(campaigns).orderBy(desc(campaigns.createdAt));
}

/** Get campaign by ID */
export async function getCampaignById(id: number): Promise<Campaign | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(campaigns).where(eq(campaigns.id, id)).limit(1);
  return result[0];
}
