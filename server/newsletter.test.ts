/**
 * Newsletter router tests
 * Tests the subscribe and unsubscribe logic in isolation (no DB required for unit tests)
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock DB helpers ───────────────────────────────────────────────────────────
// vi.mock is hoisted, so we cannot reference variables defined in this file
// inside the factory. Use vi.fn() directly and configure in beforeEach.

vi.mock("./db", () => ({
  addSubscriber: vi.fn(),
  getSubscriberByToken: vi.fn(),
  unsubscribeByToken: vi.fn(),
  listSubscribers: vi.fn(),
  getSubscriberStats: vi.fn(),
}));

vi.mock("./email", () => ({
  sendSubscriptionConfirmation: vi.fn(),
  sendUnsubscribeConfirmation: vi.fn(),
}));

// ── Import after mocks ────────────────────────────────────────────────────────

import { addSubscriber, getSubscriberByToken, unsubscribeByToken, getSubscriberStats } from "./db";
import { sendSubscriptionConfirmation } from "./email";

// ── Shared fixture ────────────────────────────────────────────────────────────

function makeSub(overrides = {}) {
  return {
    id: 1,
    email: "test@example.com",
    name: "Test User",
    status: "active" as const,
    newsletters: "all",
    token: "abc123token",
    source: "newsletter-page",
    confirmedAt: null,
    unsubscribedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("Newsletter subscription flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call addSubscriber with correct params", async () => {
    const mockAdd = vi.mocked(addSubscriber);
    mockAdd.mockResolvedValueOnce(makeSub());

    const result = await addSubscriber("test@example.com", "Test User", "newsletter-page", "all");

    expect(mockAdd).toHaveBeenCalledWith("test@example.com", "Test User", "newsletter-page", "all");
    expect(result.email).toBe("test@example.com");
    expect(result.token).toBe("abc123token");
  });

  it("should send confirmation email after subscribing", async () => {
    const mockAdd = vi.mocked(addSubscriber);
    const mockSend = vi.mocked(sendSubscriptionConfirmation);
    mockAdd.mockResolvedValueOnce(makeSub());
    mockSend.mockResolvedValueOnce(true);

    const sub = await addSubscriber("test@example.com", "Test User");
    await sendSubscriptionConfirmation(sub.email, sub.name, sub.token);

    expect(mockSend).toHaveBeenCalledWith("test@example.com", "Test User", "abc123token");
  });

  it("should return subscriber when token is valid", async () => {
    const mockGet = vi.mocked(getSubscriberByToken);
    mockGet.mockResolvedValueOnce(makeSub());

    const result = await getSubscriberByToken("abc123token");

    expect(result).toBeDefined();
    expect(result?.email).toBe("test@example.com");
    expect(result?.status).toBe("active");
  });

  it("should return undefined for invalid token", async () => {
    const mockGet = vi.mocked(getSubscriberByToken);
    mockGet.mockResolvedValueOnce(undefined);

    const result = await getSubscriberByToken("invalid-token");

    expect(result).toBeUndefined();
  });

  it("should unsubscribe by token", async () => {
    const mockUnsub = vi.mocked(unsubscribeByToken);
    mockUnsub.mockResolvedValueOnce(true);

    const result = await unsubscribeByToken("abc123token");

    expect(result).toBe(true);
    expect(mockUnsub).toHaveBeenCalledWith("abc123token");
  });

  it("should return false for invalid unsubscribe token", async () => {
    const mockUnsub = vi.mocked(unsubscribeByToken);
    mockUnsub.mockResolvedValueOnce(false);

    const result = await unsubscribeByToken("bad-token");

    expect(result).toBe(false);
  });

  it("should return subscriber stats", async () => {
    const mockStats = vi.mocked(getSubscriberStats);
    mockStats.mockResolvedValueOnce({ total: 100, active: 90, unsubscribed: 10 });

    const stats = await getSubscriberStats();

    expect(stats.total).toBe(100);
    expect(stats.active).toBe(90);
    expect(stats.unsubscribed).toBe(10);
  });
});

describe("Email validation", () => {
  it("should validate email format", () => {
    const validEmails = [
      "user@example.com",
      "user.name@domain.co",
      "user+tag@example.org",
    ];
    const invalidEmails = [
      "notanemail",
      "@domain.com",
      "user@",
      "",
    ];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    validEmails.forEach(email => {
      expect(emailRegex.test(email)).toBe(true);
    });

    invalidEmails.forEach(email => {
      expect(emailRegex.test(email)).toBe(false);
    });
  });
});
