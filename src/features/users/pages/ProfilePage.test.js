import { describe, it, expect, vi } from "vitest";
import { mountPage } from "../../../test-utils.js";
import { setToken, getToken } from "../../../helpers/apiHelper.js";

vi.mock("../../auth/api/authApi.js", () => ({ fetchProfile: vi.fn(), loginUser: vi.fn(), registerUser: vi.fn() }));
import { fetchProfile } from "../../auth/api/authApi.js";
import ProfilePage from "./ProfilePage.vue";

describe("ProfilePage", () => {
  it("dengan rating dan telepon", async () => {
    fetchProfile.mockResolvedValue({ name: "Leona", username: "leona", phone: "0812", rating_avg: 4.5, rating_count: 2 });
    const { wrapper } = await mountPage(ProfilePage);
    expect(wrapper.text()).toContain("Leona");
    expect(wrapper.text()).toContain("0812");
    expect(wrapper.text()).toContain("4.5 (2 ulasan)");
  });

  it("tanpa rating dan telepon", async () => {
    fetchProfile.mockResolvedValue({ name: "Leona", username: "leona", phone: null, rating_avg: null, rating_count: 0 });
    const { wrapper } = await mountPage(ProfilePage);
    expect(wrapper.text()).toContain("Belum ada rating");
  });

  it("error", async () => {
    fetchProfile.mockRejectedValue(new Error("gagal"));
    const { wrapper } = await mountPage(ProfilePage);
    expect(wrapper.find("[role=alert]").text()).toBe("gagal");
  });

  it("memuat", async () => {
    fetchProfile.mockReturnValue(new Promise(() => {}));
    const { wrapper } = await mountPage(ProfilePage);
    expect(wrapper.text()).toContain("Memuat");
  });

  it("logout", async () => {
    setToken("t");
    fetchProfile.mockResolvedValue({ name: "L", username: "l", rating_count: 0 });
    const { wrapper, router } = await mountPage(ProfilePage);
    await wrapper.find("#btn-profile-logout").trigger("click");
    await new Promise((r) => setTimeout(r));
    expect(getToken()).toBeNull();
    expect(router.currentRoute.value.path).toBe("/auth/login");
  });
});
