import { describe, it, expect, vi } from "vitest";
import { mountPage } from "../../../test-utils.js";

vi.mock("../api/ridesApi.js");
import { myRides } from "../api/ridesApi.js";
import MyRidesPage from "./MyRidesPage.vue";

describe("MyRidesPage", () => {
  it("daftar", async () => {
    myRides.mockResolvedValue([{ id: 1, origin: "A", destination: "B", departure_time: "2030-01-01T05:00:00.000Z", status: "open", driver_name: "Me", seats_available: 1, price: 1000 }]);
    const { wrapper } = await mountPage(MyRidesPage);
    expect(wrapper.text()).toContain("Me");
  });
  it("kosong", async () => {
    myRides.mockResolvedValue([]);
    const { wrapper } = await mountPage(MyRidesPage);
    expect(wrapper.text()).toContain("Belum ada tumpangan");
  });
  it("error", async () => {
    myRides.mockRejectedValue(new Error("boom"));
    const { wrapper } = await mountPage(MyRidesPage);
    expect(wrapper.find("[role=alert]").text()).toBe("boom");
  });
  it("memuat", async () => {
    myRides.mockReturnValue(new Promise(() => {}));
    const { wrapper } = await mountPage(MyRidesPage);
    expect(wrapper.text()).toContain("Memuat");
  });
});
