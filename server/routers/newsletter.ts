/*
 * CityRizz Newsletter Router
 * Endpoints:
 *   newsletter.subscribe      — public: add email to subscriber list + send confirmation
 *   newsletter.unsubscribe    — public: unsubscribe by token
 *   newsletter.getStatus      — public: check subscription status by token
 *   newsletter.adminList      — admin: paginated subscriber list
 *   newsletter.adminStats     — admin: subscriber counts
 *   newsletter.adminExport    — admin: export CSV of all subscribers
 */

import { z } from "zod";
import { publicProcedure, adminProcedure, router } from "../_core/trpc";
import {
  addSubscriber,
  unsubscribeByToken,
  getSubscriberByToken,
  listSubscribers,
  getSubscriberStats,
} from "../db";
import { sendSubscriptionConfirmation, sendUnsubscribeConfirmation } from "../email";

export const newsletterRouter = router({
  /** Subscribe to newsletters */
  subscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email("Please enter a valid email address"),
        name: z.string().max(255).optional(),
        source: z.string().max(64).default("newsletter-page"),
        newsletters: z.string().max(255).default("all"),
      })
    )
    .mutation(async ({ input }) => {
      const subscriber = await addSubscriber(
        input.email,
        input.name,
        input.source,
        input.newsletters
      );

      // Send confirmation email (non-blocking — don't fail if email fails)
      sendSubscriptionConfirmation(subscriber.email, subscriber.name, subscriber.token).catch(
        (err) => console.error("[Newsletter] Failed to send confirmation:", err)
      );

      return {
        success: true,
        message: "You're subscribed! Check your inbox for a confirmation email.",
        alreadySubscribed: subscriber.status === "active",
      };
    }),

  /** Unsubscribe by token */
  unsubscribe: publicProcedure
    .input(z.object({ token: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const sub = await getSubscriberByToken(input.token);
      if (!sub) {
        return { success: false, message: "Invalid or expired unsubscribe link." };
      }

      if (sub.status === "unsubscribed") {
        return { success: true, message: "You are already unsubscribed.", email: sub.email };
      }

      const ok = await unsubscribeByToken(input.token);
      if (!ok) {
        return { success: false, message: "Could not process unsubscribe request." };
      }

      // Send confirmation email
      sendUnsubscribeConfirmation(sub.email).catch(
        (err) => console.error("[Newsletter] Failed to send unsubscribe confirmation:", err)
      );

      return { success: true, message: "You've been unsubscribed.", email: sub.email };
    }),

  /** Check subscription status by token (for unsubscribe page) */
  getStatus: publicProcedure
    .input(z.object({ token: z.string().min(1) }))
    .query(async ({ input }) => {
      const sub = await getSubscriberByToken(input.token);
      if (!sub) return { found: false };
      return {
        found: true,
        email: sub.email,
        status: sub.status,
        name: sub.name,
      };
    }),

  /** Admin: list subscribers with pagination and search */
  adminList: adminProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(200).default(50),
        search: z.string().optional(),
        status: z.enum(["active", "unsubscribed", "all"]).default("all"),
      })
    )
    .query(async ({ input }) => {
      return listSubscribers({
        page: input.page,
        limit: input.limit,
        search: input.search,
        status: input.status,
      });
    }),

  /** Admin: get subscriber stats */
  adminStats: adminProcedure.query(async () => {
    return getSubscriberStats();
  }),

  /** Admin: export all active subscribers as CSV */
  adminExport: adminProcedure.query(async () => {
    const { subscribers } = await listSubscribers({ limit: 10000, status: "active" });

    const header = "email,name,newsletters,source,createdAt";
    const rows = subscribers.map((s) =>
      [
        `"${s.email}"`,
        `"${s.name ?? ""}"`,
        `"${s.newsletters ?? "all"}"`,
        `"${s.source ?? ""}"`,
        `"${s.createdAt.toISOString()}"`,
      ].join(",")
    );

    return {
      csv: [header, ...rows].join("\n"),
      count: subscribers.length,
    };
  }),
});
