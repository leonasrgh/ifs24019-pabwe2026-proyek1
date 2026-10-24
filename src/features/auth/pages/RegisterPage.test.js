import { describe, it, expect, vi } from "vitest";
import { mountPage, flushPromises } from "../../../test-utils.js";

vi.mock("../api/authApi.js", () => ({ loginUser: vi.fn(), registerUser: vi.fn(), fetchProfile: vi.fn() }));
import { registerUser } from "../api/authApi.js";
import RegisterPage from "./RegisterPage.vue";

async function fill(wrapper) {
  await wrapper.find("#name").setValue("Leona");
  await wrapper.find("#username").setValue("leona");
  await wrapper.find("#phone").setValue("0812");
  await wrapper.find("#password").setValue("secret1");
  await wrapper.find("form").trigger("submit");
}

describe("RegisterPage", () => {
  it("daftar sukses -> halaman login", async () => {
    registerUser.mockResolvedValue({ id: 1 });
    const { wrapper, router } = await mountPage(RegisterPage, { path: "/auth/register", route: "/auth/register" });
    await fill(wrapper);
    await flushPromises();
    expect(registerUser).toHaveBeenCalledWith({ name: "Leona", username: "leona", phone: "0812", password: "secret1" });
    expect(router.currentRoute.value.path).toBe("/auth/login");
  });

  it("daftar gagal menampilkan pesan", async () => {
    registerUser.mockRejectedValue(new Error("Username sudah digunakan"));
    const { wrapper } = await mountPage(RegisterPage, { path: "/auth/register", route: "/auth/register" });
    await fill(wrapper);
    await flushPromises();
    expect(wrapper.find("[role=alert]").text()).toBe("Username sudah digunakan");
  });

  it("status memproses", async () => {
    let resolve;
    registerUser.mockReturnValue(new Promise((r) => (resolve = r)));
    const { wrapper } = await mountPage(RegisterPage, { path: "/auth/register", route: "/auth/register" });
    await fill(wrapper);
    expect(wrapper.find("#btn-submit").text()).toBe("Memproses...");
    resolve({});
    await flushPromises();
  });
});
