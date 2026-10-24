import { describe, it, expect } from "vitest";
import { mountPage } from "../../../test-utils.js";
import AppLayout from "./AppLayout.vue";
import { setToken, getToken } from "../../../helpers/apiHelper.js";

describe("AppLayout", () => {
  it("menampilkan menu navigasi", async () => {
    const { wrapper } = await mountPage(AppLayout);
    const hrefs = wrapper.find("nav").findAll("a").map((a) => a.attributes("href"));
    expect(hrefs).toEqual(["/rides", "/rides/new", "/my-rides", "/bookings", "/profile"]);
  });

  it("logout menghapus token dan menuju login", async () => {
    setToken("t");
    const { wrapper, router } = await mountPage(AppLayout);
    await wrapper.find("#btn-logout").trigger("click");
    await new Promise((r) => setTimeout(r));
    expect(getToken()).toBeNull();
    expect(router.currentRoute.value.path).toBe("/auth/login");
  });
});
