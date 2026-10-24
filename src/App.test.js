import { describe, it, expect } from "vitest";
import { mountPage } from "./test-utils.js";
import App from "./App.vue";

describe("App", () => {
  it("merender RouterView", async () => {
    const { wrapper } = await mountPage(App);
    expect(wrapper.exists()).toBe(true);
  });
});
