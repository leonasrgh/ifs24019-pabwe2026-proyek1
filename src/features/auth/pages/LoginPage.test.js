import { describe, it, expect, vi } from "vitest";
import { mountPage, flushPromises } from "../../../test-utils.js";

vi.mock("../api/authApi.js", () => ({ loginUser: vi.fn(), registerUser: vi.fn(), fetchProfile: vi.fn() }));
import { loginUser } from "../api/authApi.js";
import LoginPage from "./LoginPage.vue";

async function fill(wrapper) {
  await wrapper.find("#username").setValue("leona");
  await wrapper.find("#password").setValue("secret1");
  await wrapper.find("form").trigger("submit");
}

describe("LoginPage", () => {
  it("memiliki selector yang diwajibkan", async () => {
    const { wrapper } = await mountPage(LoginPage, { path: "/auth/login", route: "/auth/login" });
    expect(wrapper.find("#username").exists()).toBe(true);
    expect(wrapper.find("#password").exists()).toBe(true);
    expect(wrapper.find("#btn-submit").exists()).toBe(true);
  });

  it("login sukses -> /rides", async () => {
    loginUser.mockResolvedValue({ token: "t" });
    const { wrapper, router } = await mountPage(LoginPage, { path: "/auth/login", route: "/auth/login" });
    await fill(wrapper);
    await flushPromises();
    expect(loginUser).toHaveBeenCalledWith({ username: "leona", password: "secret1" });
    expect(router.currentRoute.value.path).toBe("/rides");
  });

  it("menghormati redirect aman", async () => {
    loginUser.mockResolvedValue({ token: "t" });
    const { wrapper, router } = await mountPage(LoginPage, { path: "/auth/login", route: "/auth/login?redirect=/bookings" });
    await fill(wrapper);
    await flushPromises();
    expect(router.currentRoute.value.path).toBe("/bookings");
  });

  it("login gagal menampilkan pesan dan tombol aktif kembali", async () => {
    loginUser.mockRejectedValue(new Error("Username atau password salah"));
    const { wrapper } = await mountPage(LoginPage, { path: "/auth/login", route: "/auth/login" });
    await fill(wrapper);
    await flushPromises();
    expect(wrapper.find("[role=alert]").text()).toBe("Username atau password salah");
    expect(wrapper.find("#btn-submit").attributes("disabled")).toBeUndefined();
  });

  it("menampilkan status memproses selama request", async () => {
    let resolve;
    loginUser.mockReturnValue(new Promise((r) => (resolve = r)));
    const { wrapper } = await mountPage(LoginPage, { path: "/auth/login", route: "/auth/login" });
    await fill(wrapper);
    expect(wrapper.find("#btn-submit").text()).toBe("Memproses...");
    resolve({ token: "t" });
    await flushPromises();
  });
});
