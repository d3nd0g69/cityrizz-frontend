/*
 * CityRizz Campaigns Router
 * Endpoints:
 *   campaigns.list      — admin: list all campaigns with history
 *   campaigns.create    — admin: create a new campaign draft
 *   campaigns.send      — admin: send campaign to all active subscribers
 */

import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import {
  createCampaign,
  markCampaignSent,
  listCampaigns,
  getCampaignById,
  listSubscribers,
} from "../db";
import { ENV } from "../_core/env";

/** Send a campaign to a list of recipients via SendGrid */
async function sendCampaignEmail(opts: {
  recipients: { email: string; name?: string | null }[];
  subject: string;
  bodyHtml: string;
  bodyText?: string;
}): Promise<{ sent: number; failed: number }> {
  if (!ENV.sendgridApiKey) {
    console.warn("[Campaign] SENDGRID_API_KEY not set — skipping send");
    return { sent: 0, failed: 0 };
  }

  // SendGrid supports up to 1000 personalizations per request
  // Chunk into batches of 500 to stay well within limits
  const BATCH_SIZE = 500;
  const chunks: typeof opts.recipients[] = [];
  for (let i = 0; i < opts.recipients.length; i += BATCH_SIZE) {
    chunks.push(opts.recipients.slice(i, i + BATCH_SIZE));
  }

  let sent = 0;
  let failed = 0;

  for (const chunk of chunks) {
    try {
      const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ENV.sendgridApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: chunk.map((r) => ({
            to: [{ email: r.email, name: r.name ?? undefined }],
          })),
          from: { email: "hello@cityrizz.com", name: "CityRizz" },
          reply_to: { email: "hello@cityrizz.com", name: "CityRizz" },
          subject: opts.subject,
          content: [
            ...(opts.bodyText ? [{ type: "text/plain", value: opts.bodyText }] : []),
            { type: "text/html", value: opts.bodyHtml },
          ],
        }),
      });

      if (res.ok) {
        sent += chunk.length;
      } else {
        const body = await res.text();
        console.error("[Campaign] SendGrid batch error:", res.status, body);
        failed += chunk.length;
      }
    } catch (err) {
      console.error("[Campaign] Batch send error:", err);
      failed += chunk.length;
    }
  }

  return { sent, failed };
}

export const campaignsRouter = router({
  /** List all campaigns */
  list: adminProcedure.query(async () => {
    return listCampaigns();
  }),

  /** Create a new campaign draft */
  create: adminProcedure
    .input(
      z.object({
        subject: z.string().min(3).max(255),
        previewText: z.string().max(255).optional(),
        bodyHtml: z.string().min(10),
        bodyText: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const id = await createCampaign({
        subject: input.subject,
        previewText: input.previewText ?? null,
        bodyHtml: input.bodyHtml,
        bodyText: input.bodyText ?? null,
      });
      return { success: true, id };
    }),

  /** Send a test email to a single address */
  sendTest: adminProcedure
    .input(
      z.object({
        campaignId: z.number().int().positive(),
        testEmail: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      const campaign = await getCampaignById(input.campaignId);
      if (!campaign) throw new Error("Campaign not found");

      const { sent, failed } = await sendCampaignEmail({
        recipients: [{ email: input.testEmail, name: "Test Recipient" }],
        subject: `[TEST] ${campaign.subject}`,
        bodyHtml: campaign.bodyHtml,
        bodyText: campaign.bodyText ?? undefined,
      });

      if (failed > 0) {
        return { success: false, message: `Failed to send test email to ${input.testEmail}.` };
      }
      return { success: true, message: `Test email sent to ${input.testEmail}.` };
    }),

  /** Send a campaign to all active subscribers */
  send: adminProcedure
    .input(
      z.object({
        campaignId: z.number().int().positive(),
      })
    )
    .mutation(async ({ input }) => {
      const campaign = await getCampaignById(input.campaignId);
      if (!campaign) throw new Error("Campaign not found");
      if (campaign.status === "sent") throw new Error("Campaign has already been sent");

      // Fetch all active subscribers
      const { subscribers } = await listSubscribers({ limit: 100000, status: "active" });
      if (subscribers.length === 0) {
        return { success: false, message: "No active subscribers to send to." };
      }

      const recipients = subscribers.map((s) => ({ email: s.email, name: s.name }));

      const { sent, failed } = await sendCampaignEmail({
        recipients,
        subject: campaign.subject,
        bodyHtml: campaign.bodyHtml,
        bodyText: campaign.bodyText ?? undefined,
      });

      await markCampaignSent(campaign.id, sent);

      return {
        success: true,
        sent,
        failed,
        message: `Campaign sent to ${sent} subscriber${sent !== 1 ? "s" : ""}${failed > 0 ? ` (${failed} failed)` : ""}.`,
      };
    }),
});
