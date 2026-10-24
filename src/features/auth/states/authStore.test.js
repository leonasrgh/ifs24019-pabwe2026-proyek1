import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";

vi.mock("../api/authApi.js", () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
  fetchProfile: vi.fn(),
}));
import { fetchProfile, loginUser, registerUser } from "../api/authApi.js";
import { getToken } from "../../../helpers/apiHelper.js";
import { useAuthStore } from "./authStore.js";

beforeEach(() => setActivePinia(createPinia()));

describe("authStore", () => {
  it("awalnya belum login; membaca token tersimpan", () => {
    expect(useAuthStore().isAuthenticated).toBe(false);
    localStorage.setItem("nk_token", "t");
    setActivePinia(createPinia());
    expect(useAuthStore().isAuthenticated).toBe(true);
  });

  it("login menyimpan token", async () => {
    loginUser.mockResolvedValue({ token: "abc" });
    const s = useAuthStore();
    await s.login("u", "p");
    expect(loginUser).toHaveBeenCalledWith({ username: "u", password: "p" });
    expect(s.token).toBe("abc");
    expect(getToken()).toBe("abc");
    expect(s.isAuthenticated).toBe(true);
  });

  it("register meneruskan payload", async () => {
    registerUser.mockResolvedValue({ id: 1 });
    expect(await useAuthStore().register({ a: 1 })).toEqual({ id: 1 });
  });

  it("loadProfile & logout", async () => {
    fetchProfile.mockResolvedValue({ name: "A" });
    const s = useAuthStore();
    s.token = "x";
    localStorage.setItem("nk_token", "x");
    await s.loadProfile();
    expect(s.user).toEqual({ name: "A" });
    s.logout();
    expect(s.user).toBeNull();
    expect(s.token).toBeNull();
    expect(getToken()).toBeNull();
  });
});
