/**
 * SendGrid API key validation test
 * Validates that the SENDGRID_API_KEY is set and accepted by SendGrid
 */

import { describe, it, expect } from "vitest";
import { config } from "dotenv";

// Load env for local test runs
config();

describe("SendGrid API key validation", () => {
  it("should have SENDGRID_API_KEY set in environment", () => {
    const key = process.env.SENDGRID_API_KEY;
    expect(key).toBeDefined();
    expect(key).not.toBe("");
    // SendGrid keys start with "SG."
    expect(key).toMatch(/^SG\./);
  });

  it("should be accepted by SendGrid API (validate key via /v3/user/profile)", async () => {
    const key = process.env.SENDGRID_API_KEY;
    if (!key) {
      console.warn("SENDGRID_API_KEY not set — skipping live validation");
      return;
    }

    const res = await fetch("https://api.sendgrid.com/v3/user/profile", {
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
    });

    // 200 = valid key, 401 = invalid key
    expect(res.status).toBe(200);
  }, 15000); // 15s timeout for network call
});
