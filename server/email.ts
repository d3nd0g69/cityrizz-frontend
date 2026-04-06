/*
 * CityRizz Email Service — SendGrid integration
 * Sends transactional emails: subscription confirmation, unsubscribe confirmation
 */

import { ENV } from "./_core/env";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

async function sendEmail(opts: SendEmailOptions): Promise<boolean> {
  if (!ENV.sendgridApiKey) {
    console.warn("[Email] SENDGRID_API_KEY not set — skipping email send");
    return false;
  }

  try {
    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ENV.sendgridApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: opts.to }] }],
        from: { email: "hello@cityrizz.com", name: "CityRizz" },
        reply_to: { email: "hello@cityrizz.com", name: "CityRizz" },
        subject: opts.subject,
        content: [
          ...(opts.text ? [{ type: "text/plain", value: opts.text }] : []),
          { type: "text/html", value: opts.html },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[Email] SendGrid error:", res.status, body);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[Email] Failed to send:", err);
    return false;
  }
}

/** Send subscription confirmation email */
export async function sendSubscriptionConfirmation(
  email: string,
  name: string | null | undefined,
  unsubscribeToken: string
): Promise<boolean> {
  const unsubscribeUrl = `${ENV.frontendUrl}/unsubscribe?token=${unsubscribeToken}`;
  const greeting = name ? `Hi ${name},` : "Hi there,";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Welcome to CityRizz!</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background:#1a1a2e;padding:24px 40px;text-align:center;">
              <span style="font-family:Georgia,serif;font-size:32px;font-weight:900;color:#ffffff;">City</span><span style="font-family:Georgia,serif;font-size:32px;font-weight:900;color:#c0392b;">Rizz</span>
            </td>
          </tr>
          <!-- Red accent bar -->
          <tr><td style="background:#c0392b;height:4px;"></td></tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="font-size:16px;color:#1a1a2e;margin:0 0 16px;">${greeting}</p>
              <p style="font-size:16px;color:#1a1a2e;margin:0 0 16px;">
                <strong>Welcome to CityRizz!</strong> You're now subscribed to the best local news and culture coverage in Northeast Mississippi.
              </p>
              <p style="font-size:14px;color:#555;margin:0 0 24px;">
                Here's what you'll be getting:
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${[
                  ["☀️", "The Daily Rizz", "Top stories every morning"],
                  ["🍽️", "Food & Drink Weekly", "Best restaurants & events, every Thursday"],
                  ["🎉", "Things To Do", "Your weekend guide, every Friday"],
                  ["🏈", "Sports Roundup", "Local sports coverage, every Monday"],
                ].map(([icon, title, desc]) => `
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
                    <span style="font-size:20px;margin-right:12px;">${icon}</span>
                    <strong style="color:#1a1a2e;font-size:14px;">${title}</strong>
                    <span style="color:#777;font-size:13px;"> — ${desc}</span>
                  </td>
                </tr>`).join("")}
              </table>
              <div style="margin:32px 0;text-align:center;">
                <a href="${ENV.frontendUrl}" style="display:inline-block;background:#c0392b;color:#ffffff;text-decoration:none;padding:14px 32px;font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;font-family:Arial,sans-serif;">
                  Read Today's Stories →
                </a>
              </div>
              <p style="font-size:12px;color:#999;margin:0;">
                You're receiving this because you signed up at cityrizz.com.
                <a href="${unsubscribeUrl}" style="color:#c0392b;">Unsubscribe anytime</a>.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f5f5f5;padding:20px 40px;text-align:center;">
              <p style="font-size:11px;color:#aaa;margin:0;">
                © ${new Date().getFullYear()} CityRizz · Northeast Mississippi's Local News Source<br>
                <a href="${unsubscribeUrl}" style="color:#aaa;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `${greeting}

Welcome to CityRizz! You're now subscribed to the best local news and culture coverage in Northeast Mississippi.

What you'll receive:
- The Daily Rizz (every morning)
- Food & Drink Weekly (every Thursday)
- Things To Do (every Friday)
- Sports Roundup (every Monday)

Read today's stories: ${ENV.frontendUrl}

To unsubscribe, visit: ${unsubscribeUrl}

© ${new Date().getFullYear()} CityRizz`;

  return sendEmail({
    to: email,
    subject: "Welcome to CityRizz! 🎉 You're subscribed",
    html,
    text,
  });
}

/** Send unsubscribe confirmation email */
export async function sendUnsubscribeConfirmation(email: string): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Unsubscribed from CityRizz</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;width:100%;">
          <tr>
            <td style="background:#1a1a2e;padding:24px 40px;text-align:center;">
              <span style="font-family:Georgia,serif;font-size:32px;font-weight:900;color:#ffffff;">City</span><span style="font-family:Georgia,serif;font-size:32px;font-weight:900;color:#c0392b;">Rizz</span>
            </td>
          </tr>
          <tr><td style="background:#c0392b;height:4px;"></td></tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#1a1a2e;font-size:22px;margin:0 0 16px;">You've been unsubscribed</h2>
              <p style="font-size:14px;color:#555;margin:0 0 16px;">
                We've removed <strong>${email}</strong> from all CityRizz newsletters. You won't receive any more emails from us.
              </p>
              <p style="font-size:14px;color:#555;margin:0 0 24px;">
                Changed your mind? You can always <a href="${ENV.frontendUrl}/newsletter" style="color:#c0392b;">re-subscribe here</a>.
              </p>
              <p style="font-size:12px;color:#999;margin:0;">
                © ${new Date().getFullYear()} CityRizz · Northeast Mississippi
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return sendEmail({
    to: email,
    subject: "You've been unsubscribed from CityRizz",
    html,
  });
}
