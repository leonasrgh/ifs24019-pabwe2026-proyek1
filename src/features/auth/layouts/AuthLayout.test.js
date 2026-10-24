import { describe, it, expect } from "vitest";
import { mountPage } from "../../../test-utils.js";
import AuthLayout from "./AuthLayout.vue";

describe("AuthLayout", () => {
  it("menampilkan brand dan tautan beranda", async () => {
    const { wrapper } = await mountPage(AuthLayout);
    expect(wrapper.text()).toContain("NebengKampus");
    expect(wrapper.find("a").attributes("href")).toBe("/");
  });
});
