import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── Newsletter subscribers ────────────────────────────────────────────────────

export const subscribers = mysqlTable("subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  status: mysqlEnum("status", ["active", "unsubscribed"]).default("active").notNull(),
  /** Newsletters the subscriber opted into — comma-separated list */
  newsletters: varchar("newsletters", { length: 255 }).default("all"),
  /** Secure token used for unsubscribe links */
  token: varchar("token", { length: 64 }).notNull().unique(),
  confirmedAt: timestamp("confirmedAt"),
  unsubscribedAt: timestamp("unsubscribedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  /** Source of signup: newsletter-page, footer, events, etc. */
  source: varchar("source", { length: 64 }).default("newsletter-page"),
});

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = typeof subscribers.$inferInsert;

// ── Events ────────────────────────────────────────────────────────────────────

export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  /** ISO date string: YYYY-MM-DD */
  eventDate: varchar("eventDate", { length: 10 }).notNull(),
  /** Human-readable time range: e.g. "7:00 PM – 10:00 PM" */
  eventTime: varchar("eventTime", { length: 64 }),
  venue: varchar("venue", { length: 255 }),
  location: varchar("location", { length: 255 }),
  category: varchar("category", { length: 64 }),
  price: varchar("price", { length: 64 }),
  imageUrl: text("imageUrl"),
  externalUrl: text("externalUrl"),
  featured: boolean("featured").default(false).notNull(),
  /** published = live, pending = awaiting review, rejected = declined */
  status: mysqlEnum("status", ["published", "pending", "rejected"]).default("pending").notNull(),
  /** Contact info for submitted events */
  contactName: varchar("contactName", { length: 255 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

// ── Email campaigns ───────────────────────────────────────────────────────────

export const campaigns = mysqlTable("campaigns", {
  id: int("id").autoincrement().primaryKey(),
  subject: varchar("subject", { length: 255 }).notNull(),
  previewText: varchar("previewText", { length: 255 }),
  bodyHtml: text("bodyHtml").notNull(),
  bodyText: text("bodyText"),
  /** draft | sent */
  status: mysqlEnum("status", ["draft", "sent"]).default("draft").notNull(),
  /** Number of recipients at send time */
  recipientCount: int("recipientCount").default(0),
  sentAt: timestamp("sentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;
