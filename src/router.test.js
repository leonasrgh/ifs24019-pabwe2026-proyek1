import { describe, it, expect } from "vitest";
import { createMemoryHistory } from "vue-router";
import defaultRouter, { createAppRouter } from "./router.js";
import { setToken } from "./helpers/apiHelper.js";

const make = () => createAppRouter(createMemoryHistory());

describe("router", () => {
  it("router default tersedia", () => {
    expect(defaultRouter.getRoutes().length).toBeGreaterThan(5);
  });

  it("halaman publik terbuka tanpa login", async () => {
    for (const p of ["/", "/auth/login", "/auth/register"]) {
      const r = make();
      await r.push(p);
      expect(r.currentRoute.value.path).toBe(p);
    }
  });

  it("halaman privat tanpa login -> login + redirect", async () => {
    const r = make();
    await r.push("/bookings");
    expect(r.currentRoute.value.path).toBe("/auth/login");
    expect(r.currentRoute.value.query.redirect).toBe("/bookings");
  });

  it("halaman privat dengan login", async () => {
    setToken("t");
    for (const p of ["/rides", "/rides/new", "/rides/12", "/my-rides", "/bookings", "/profile"]) {
      const r = make();
      await r.push(p);
      expect(r.currentRoute.value.path).toBe(p);
    }
  });

  it("sudah login tidak bisa ke halaman auth", async () => {
    setToken("t");
    const r = make();
    await r.push("/auth/login");
    expect(r.currentRoute.value.path).toBe("/rides");
  });

  it("path tidak dikenal -> beranda; id non-angka juga", async () => {
    const r = make();
    await r.push("/tidak-ada");
    expect(r.currentRoute.value.path).toBe("/");
    setToken("t");
    await r.push("/rides/abc");
    expect(r.currentRoute.value.path).toBe("/");
  });
});
