/*
 * CityRizz Events Router
 * Endpoints:
 *   events.list         — public: paginated list of published events
 *   events.featured     — public: featured events for hero section
 *   events.getBySlug    — public: single event detail
 *   events.submit       — public: submit an event for review
 *   events.adminList    — admin: all events with status filter
 *   events.adminUpdate  — admin: update event status (publish/reject)
 */

import { z } from "zod";
import { publicProcedure, adminProcedure, router } from "../_core/trpc";
import {
  listEvents,
  getEventBySlug,
  submitEvent,
  adminListEvents,
  updateEventStatus,
} from "../db";
import crypto from "crypto";

export const eventsRouter = router({
  /** List published events with optional category filter */
  list: publicProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(20),
        category: z.string().optional(),
        upcoming: z.boolean().default(true),
      })
    )
    .query(async ({ input }) => {
      return listEvents({
        page: input.page,
        limit: input.limit,
        category: input.category,
        upcoming: input.upcoming,
      });
    }),

  /** Get featured events for the hero section */
  featured: publicProcedure
    .input(z.object({ limit: z.number().int().min(1).max(10).default(3) }))
    .query(async ({ input }) => {
      const result = await listEvents({ featuredOnly: true, limit: input.limit, upcoming: true });
      return result.events;
    }),

  /** Get a single event by slug */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      const event = await getEventBySlug(input.slug);
      if (!event || event.status !== "published") return null;
      return event;
    }),

  /** Submit an event for review */
  submit: publicProcedure
    .input(
      z.object({
        title: z.string().min(3).max(255),
        description: z.string().max(2000).optional(),
        eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
        eventTime: z.string().max(64).optional(),
        venue: z.string().min(2).max(255),
        location: z.string().max(255).optional(),
        category: z.string().max(64).optional(),
        price: z.string().max(64).optional(),
        imageUrl: z.string().url().optional(),
        externalUrl: z.string().url().optional(),
        contactName: z.string().max(255).optional(),
        contactEmail: z.string().email().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Generate a URL-safe slug from the title + date
      const baseSlug = input.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 80);
      const suffix = crypto.randomBytes(3).toString("hex");
      const slug = `${baseSlug}-${suffix}`;

      await submitEvent({
        title: input.title,
        slug,
        description: input.description ?? null,
        eventDate: input.eventDate,
        eventTime: input.eventTime ?? null,
        venue: input.venue,
        location: input.location ?? null,
        category: input.category ?? null,
        price: input.price ?? null,
        imageUrl: input.imageUrl ?? null,
        externalUrl: input.externalUrl ?? null,
        featured: false,
        contactName: input.contactName ?? null,
        contactEmail: input.contactEmail ?? null,
      });

      return { success: true, message: "Event submitted! We'll review it within 24 hours." };
    }),

  /** Admin: list all events */
  adminList: adminProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(50),
        status: z.enum(["published", "pending", "rejected", "all"]).default("all"),
      })
    )
    .query(async ({ input }) => {
      return adminListEvents({ page: input.page, limit: input.limit, status: input.status });
    }),

  /** Admin: update event status */
  adminUpdateStatus: adminProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        status: z.enum(["published", "pending", "rejected"]),
      })
    )
    .mutation(async ({ input }) => {
      await updateEventStatus(input.id, input.status);
      return { success: true };
    }),
});
