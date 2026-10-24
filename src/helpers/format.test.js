import { describe, it, expect } from "vitest";
import { formatDateTime, formatRupiah, safeRedirect, statusLabel } from "./format.js";

describe("format", () => {
  it("formatRupiah", () => {
    expect(formatRupiah(0)).toBe("Gratis");
    expect(formatRupiah(15000)).toMatch(/^Rp15[.,]000$/);
  });
  it("formatDateTime menghasilkan string", () => {
    expect(formatDateTime("2030-01-02T03:04:00.000Z")).toMatch(/2030|Jan|\d/);
  });
  it("statusLabel dengan fallback", () => {
    expect(statusLabel("pending")).toBe("Menunggu");
    expect(statusLabel("aneh")).toBe("aneh");
  });
  it("safeRedirect", () => {
    expect(safeRedirect("/bookings")).toBe("/bookings");
    expect(safeRedirect("//evil.com")).toBe("/rides");
    expect(safeRedirect("http://evil.com")).toBe("/rides");
    expect(safeRedirect(undefined)).toBe("/rides");
    expect(safeRedirect(["/a"])).toBe("/rides");
  });
});
