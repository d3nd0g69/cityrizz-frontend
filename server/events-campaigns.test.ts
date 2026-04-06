/**
 * Events and Campaigns router unit tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock DB helpers ───────────────────────────────────────────────────────────

vi.mock("./db", () => ({
  // subscriber helpers (used by campaigns router)
  addSubscriber: vi.fn(),
  getSubscriberByToken: vi.fn(),
  unsubscribeByToken: vi.fn(),
  listSubscribers: vi.fn(),
  getSubscriberStats: vi.fn(),
  // event helpers
  listEvents: vi.fn(),
  getEventBySlug: vi.fn(),
  submitEvent: vi.fn(),
  adminListEvents: vi.fn(),
  updateEventStatus: vi.fn(),
  // campaign helpers
  createCampaign: vi.fn(),
  markCampaignSent: vi.fn(),
  listCampaigns: vi.fn(),
  getCampaignById: vi.fn(),
}));

import {
  listEvents,
  getEventBySlug,
  submitEvent,
  createCampaign,
  markCampaignSent,
  listCampaigns,
  getCampaignById,
  listSubscribers,
} from "./db";

// ── Fixtures ──────────────────────────────────────────────────────────────────

function makeEvent(overrides = {}) {
  return {
    id: 1,
    title: "Test Event",
    slug: "test-event-abc123",
    description: "A test event",
    eventDate: "2026-05-01",
    eventTime: "7:00 PM",
    venue: "Test Venue",
    location: "Starkville, MS",
    category: "Music",
    price: "Free",
    imageUrl: null,
    externalUrl: null,
    featured: false,
    status: "published" as const,
    contactName: null,
    contactEmail: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function makeCampaign(overrides = {}) {
  return {
    id: 1,
    subject: "Test Campaign",
    previewText: "Test preview",
    bodyHtml: "<h1>Hello</h1>",
    bodyText: "Hello",
    status: "draft" as const,
    recipientCount: 0,
    sentAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

// ── Event tests ───────────────────────────────────────────────────────────────

describe("Events data layer", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should list published events", async () => {
    const mockList = vi.mocked(listEvents);
    mockList.mockResolvedValueOnce({ events: [makeEvent()], total: 1 });

    const result = await listEvents({ page: 1, limit: 20 });

    expect(result.events).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.events[0].status).toBe("published");
  });

  it("should return empty list when no events", async () => {
    const mockList = vi.mocked(listEvents);
    mockList.mockResolvedValueOnce({ events: [], total: 0 });

    const result = await listEvents({ featuredOnly: true });

    expect(result.events).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it("should get event by slug", async () => {
    const mockGet = vi.mocked(getEventBySlug);
    mockGet.mockResolvedValueOnce(makeEvent());

    const event = await getEventBySlug("test-event-abc123");

    expect(event).toBeDefined();
    expect(event?.slug).toBe("test-event-abc123");
    expect(event?.title).toBe("Test Event");
  });

  it("should return undefined for non-existent slug", async () => {
    const mockGet = vi.mocked(getEventBySlug);
    mockGet.mockResolvedValueOnce(undefined);

    const event = await getEventBySlug("does-not-exist");

    expect(event).toBeUndefined();
  });

  it("should submit an event with pending status", async () => {
    const mockSubmit = vi.mocked(submitEvent);
    mockSubmit.mockResolvedValueOnce(undefined);

    await submitEvent({
      title: "New Event",
      slug: "new-event-xyz",
      description: "Description",
      eventDate: "2026-06-01",
      eventTime: "8:00 PM",
      venue: "Some Venue",
      location: "Columbus, MS",
      category: "Music",
      price: "$10",
      imageUrl: null,
      externalUrl: null,
      featured: false,
      contactName: "John",
      contactEmail: "john@example.com",
    });

    expect(mockSubmit).toHaveBeenCalledOnce();
  });
});

// ── Campaign tests ────────────────────────────────────────────────────────────

describe("Campaign data layer", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should create a campaign and return an ID", async () => {
    const mockCreate = vi.mocked(createCampaign);
    mockCreate.mockResolvedValueOnce(42);

    const id = await createCampaign({
      subject: "Weekly Newsletter",
      previewText: "This week in NE Mississippi",
      bodyHtml: "<h1>Hello!</h1>",
      bodyText: "Hello!",
    });

    expect(id).toBe(42);
    expect(mockCreate).toHaveBeenCalledOnce();
  });

  it("should mark a campaign as sent", async () => {
    const mockMark = vi.mocked(markCampaignSent);
    mockMark.mockResolvedValueOnce(undefined);

    await markCampaignSent(42, 150);

    expect(mockMark).toHaveBeenCalledWith(42, 150);
  });

  it("should list all campaigns", async () => {
    const mockList = vi.mocked(listCampaigns);
    mockList.mockResolvedValueOnce([
      makeCampaign({ id: 1, status: "sent", recipientCount: 100 }),
      makeCampaign({ id: 2, status: "draft" }),
    ]);

    const campaigns = await listCampaigns();

    expect(campaigns).toHaveLength(2);
    expect(campaigns[0].status).toBe("sent");
    expect(campaigns[1].status).toBe("draft");
  });

  it("should get campaign by ID", async () => {
    const mockGet = vi.mocked(getCampaignById);
    mockGet.mockResolvedValueOnce(makeCampaign({ id: 5, subject: "Special Edition" }));

    const campaign = await getCampaignById(5);

    expect(campaign).toBeDefined();
    expect(campaign?.subject).toBe("Special Edition");
  });

  it("should return undefined for non-existent campaign ID", async () => {
    const mockGet = vi.mocked(getCampaignById);
    mockGet.mockResolvedValueOnce(undefined);

    const campaign = await getCampaignById(9999);

    expect(campaign).toBeUndefined();
  });
});

// ── Slug generation ───────────────────────────────────────────────────────────

describe("Event slug generation", () => {
  it("should generate URL-safe slugs from event titles", () => {
    function generateSlug(title: string): string {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 80);
    }

    expect(generateSlug("Live Music at The Warehouse!")).toBe("live-music-at-the-warehouse");
    expect(generateSlug("5K Run & Walk for Charity")).toBe("5k-run-walk-for-charity");
    expect(generateSlug("Arts & Culture: Spring Exhibition")).toBe("arts-culture-spring-exhibition");
    expect(generateSlug("  Spaces  Everywhere  ")).toBe("spaces-everywhere");
  });
});
