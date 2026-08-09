import { describe, expect, it, vi } from "vitest";
import type { ExerciseItem } from "@/lib/content/schema";
import { buildModulePlaylist } from "@/lib/session/module-playlist";

function item(id: string, groupId?: string): ExerciseItem {
  return {
    id,
    engine: "cloze",
    prompt: "Fill in:",
    answer: "x",
    metadata: {
      cefr: "B1",
      system: "nominal",
      module: "fake",
      tier: 1,
      tags: [],
      ...(groupId ? { groupId } : {}),
    },
  };
}

// Two-item group (g1) + four standalone items, all in tier 1 of a fake module.
// Mocking the content loader keeps this test independent of real curriculum
// content, which changes over time.
const FAKE_ITEMS = [
  item("g1-a", "g1"),
  item("g1-b", "g1"),
  item("solo-1"),
  item("solo-2"),
  item("solo-3"),
  item("solo-4"),
];

vi.mock("@/lib/content/loader", () => ({
  getModuleBySlug: (slug: string) =>
    slug === "fake"
      ? {
          id: "fake",
          slug: "fake",
          systemId: "nominal",
          title: "Fake",
          description: "",
          tiers: { 1: FAKE_ITEMS, 2: [], 3: [] },
        }
      : undefined,
}));

describe("buildModulePlaylist — new mode", () => {
  it("returns an empty array for an unknown module slug", () => {
    expect(buildModulePlaylist("does-not-exist", "new", new Map())).toEqual([]);
  });

  it("only returns groups where every item is unseen", () => {
    const seen = new Map([["g1-a", { due: 0, lastReview: null }]]);
    const result = buildModulePlaylist("fake", "new", seen, 10);
    // g1 has a seen item, so the whole group is excluded from "new".
    expect(result.some((i) => i.id.startsWith("g1"))).toBe(false);
    expect(result).toHaveLength(4);
  });

  it("keeps whole groups together instead of splitting them", () => {
    const result = buildModulePlaylist("fake", "new", new Map(), 10);
    const ids = result.map((i) => i.id);
    if (ids.includes("g1-a")) {
      expect(ids).toEqual(expect.arrayContaining(["g1-a", "g1-b"]));
    }
  });

  it("caps the number of returned items at newCardBudget", () => {
    const result = buildModulePlaylist("fake", "new", new Map(), {
      target: 10,
      newCardBudget: 1,
    });
    // budget=1 still returns at least one whole group (>=1 item), but no more
    // than needed to satisfy that budget.
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThanOrEqual(2);
  });

  it("returns nothing when the new-card budget is exhausted", () => {
    const result = buildModulePlaylist("fake", "new", new Map(), {
      target: 10,
      newCardBudget: 0,
    });
    expect(result).toEqual([]);
  });
});

describe("buildModulePlaylist — review mode", () => {
  it("only includes groups with at least one item actually due", () => {
    const now = 1_000_000;
    const seen = new Map([
      ["solo-1", { due: now - 1000, lastReview: now - 5000 }], // due
      ["solo-2", { due: now + 100_000, lastReview: now - 5000 }], // not due yet
    ]);
    const result = buildModulePlaylist("fake", "review", seen, { now });
    const ids = result.map((i) => i.id);
    expect(ids).toContain("solo-1");
    expect(ids).not.toContain("solo-2");
  });

  it("sorts due groups earliest-due first", () => {
    const now = 1_000_000;
    const seen = new Map([
      ["solo-2", { due: now - 500, lastReview: null }],
      ["solo-1", { due: now - 5000, lastReview: null }],
    ]);
    const result = buildModulePlaylist("fake", "review", seen, { now });
    expect(result.map((i) => i.id)).toEqual(["solo-1", "solo-2"]);
  });

  it("returns nothing when no cards are due", () => {
    const now = 1_000_000;
    const seen = new Map([["solo-1", { due: now + 5000, lastReview: null }]]);
    expect(buildModulePlaylist("fake", "review", seen, { now })).toEqual([]);
  });
});

describe("buildModulePlaylist — mixed mode", () => {
  it("falls back to all-review when there are no new items left", () => {
    const now = 1_000_000;
    const allSeen = new Map(
      FAKE_ITEMS.map((i) => [i.id, { due: now - 1000, lastReview: null }]),
    );
    const result = buildModulePlaylist("fake", "mixed", allSeen, {
      now,
      target: 6,
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((i) => allSeen.has(i.id))).toBe(true);
  });

  it("falls back to all-new when there is nothing due for review", () => {
    const result = buildModulePlaylist("fake", "mixed", new Map(), {
      target: 6,
    });
    expect(result.length).toBeGreaterThan(0);
  });
});
