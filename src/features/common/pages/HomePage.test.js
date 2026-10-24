import { describe, it, expect } from "vitest";
import { mountPage } from "../../../test-utils.js";
import { setToken } from "../../../helpers/apiHelper.js";
import HomePage from "./HomePage.vue";

describe("HomePage", () => {
  it("tamu: tautan Masuk", async () => {
    const { wrapper } = await mountPage(HomePage);
    expect(wrapper.text()).toContain("Pulang dan pergi kampus");
    expect(wrapper.findAll("a")[0].attributes("href")).toBe("/auth/login");
    expect(wrapper.text()).toContain("Masuk");
    expect(wrapper.findAll("section")[1].findAll("h2")).toHaveLength(3);
  });

  it("sudah login: tautan Buka aplikasi", async () => {
    setToken("t");
    const { wrapper } = await mountPage(HomePage);
    expect(wrapper.text()).toContain("Buka aplikasi");
    expect(wrapper.findAll("a")[0].attributes("href")).toBe("/rides");
  });
});
