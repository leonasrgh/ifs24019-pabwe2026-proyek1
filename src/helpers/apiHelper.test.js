import { describe, it, expect, vi } from "vitest";
import {
  api,
  ApiError,
  clearToken,
  getToken,
  setToken,
  setUnauthorizedHandler,
} from "./apiHelper.js";

const reply = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  json: () => (body === undefined ? Promise.reject(new Error("no json")) : Promise.resolve(body)),
});

describe("token", () => {
  it("simpan, baca, hapus", () => {
    expect(getToken()).toBeNull();
    setToken("abc");
    expect(getToken()).toBe("abc");
    clearToken();
    expect(getToken()).toBeNull();
  });
});

describe("api", () => {
  it("GET dengan query, menyaring nilai kosong, dan header Authorization", async () => {
    setToken("tok");
    const f = vi.fn().mockResolvedValue(reply(200, { success: true, data: [1] }));
    vi.stubGlobal("fetch", f);
    const data = await api("/rides", { query: { origin: "Del", destination: "", date: undefined, x: null } });
    expect(data).toEqual([1]);
    const [url, opts] = f.mock.calls[0];
    expect(url).toBe("http://localhost:8000/api/rides?origin=Del");
    expect(opts.headers.Authorization).toBe("Bearer tok");
    expect(opts.body).toBeUndefined();
  });

  it("tanpa query dan tanpa token; body di-JSON-kan", async () => {
    const f = vi.fn().mockResolvedValue(reply(201, { success: true, data: { id: 1 } }));
    vi.stubGlobal("fetch", f);
    await api("/auth/login", { method: "POST", body: { a: 1 }, auth: false });
    const [url, opts] = f.mock.calls[0];
    expect(url).toBe("http://localhost:8000/api/auth/login");
    expect(opts.headers.Authorization).toBeUndefined();
    expect(opts.body).toBe('{"a":1}');
  });

  it("tidak mengirim Authorization bila tidak ada token", async () => {
    const f = vi.fn().mockResolvedValue(reply(200, { success: true }));
    vi.stubGlobal("fetch", f);
    expect(await api("/x")).toBeNull();
    expect(f.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it("melempar ApiError dengan pesan server", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(reply(400, { success: false, message: "Salah" })));
    await expect(api("/x")).rejects.toMatchObject({ name: "ApiError", message: "Salah", status: 400 });
  });

  it("pesan default saat respons bukan JSON", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(reply(500)));
    await expect(api("/x")).rejects.toThrow("Permintaan gagal (500)");
  });

  it("success=false walau status 200 tetap error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(reply(200, { success: false, message: "Gagal" })));
    await expect(api("/x")).rejects.toThrow("Gagal");
  });

  it("jaringan putus", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("net")));
    const err = await api("/x").catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(0);
  });

  it("401 dengan token: hapus token dan panggil handler", async () => {
    setToken("tok");
    const handler = vi.fn();
    setUnauthorizedHandler(handler);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(reply(401, { success: false, message: "x" })));
    await expect(api("/x")).rejects.toThrow();
    expect(getToken()).toBeNull();
    expect(handler).toHaveBeenCalledOnce();
  });

  it("401 tanpa handler terdaftar tidak error ekstra", async () => {
    setToken("tok");
    setUnauthorizedHandler(null);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(reply(401, { success: false, message: "x" })));
    await expect(api("/x")).rejects.toThrow("x");
    expect(getToken()).toBeNull();
  });

  it("401 pada login (auth:false) tidak memicu handler", async () => {
    const handler = vi.fn();
    setUnauthorizedHandler(handler);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(reply(401, { success: false, message: "salah" })));
    await expect(api("/auth/login", { method: "POST", auth: false })).rejects.toThrow("salah");
    expect(handler).not.toHaveBeenCalled();
  });

  it("401 tanpa token tersimpan tidak memicu handler", async () => {
    const handler = vi.fn();
    setUnauthorizedHandler(handler);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(reply(401, { success: false, message: "x" })));
    await expect(api("/x")).rejects.toThrow();
    expect(handler).not.toHaveBeenCalled();
  });
});
