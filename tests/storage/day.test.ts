import { describe, expect, it } from "vitest";
import { daysBetween, todayKey, yesterdayKey } from "@/lib/date/day";

describe("todayKey", () => {
  it("matches YYYY-MM-DD format", () => {
    expect(todayKey()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("yesterdayKey", () => {
  it("returns previous day", () => {
    expect(yesterdayKey("2025-01-01")).toBe("2024-12-31");
  });
  it("rolls back month correctly", () => {
    expect(yesterdayKey("2025-03-01")).toBe("2025-02-28");
  });
});

describe("daysBetween", () => {
  it("same day = 0", () => {
    expect(daysBetween("2025-04-20", "2025-04-20")).toBe(0);
  });
  it("consecutive days = 1", () => {
    expect(daysBetween("2025-04-20", "2025-04-21")).toBe(1);
  });
  it("is symmetric", () => {
    expect(daysBetween("2025-04-15", "2025-04-20")).toBe(
      daysBetween("2025-04-20", "2025-04-15"),
    );
  });
  it("5-day gap", () => {
    expect(daysBetween("2025-04-15", "2025-04-20")).toBe(5);
  });
});
