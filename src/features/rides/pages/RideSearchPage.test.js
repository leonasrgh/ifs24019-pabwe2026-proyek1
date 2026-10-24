import { describe, it, expect, vi } from "vitest";
import { mountPage, flushPromises } from "../../../test-utils.js";

vi.mock("../api/ridesApi.js");
import { searchRides } from "../api/ridesApi.js";
import RideSearchPage from "./RideSearchPage.vue";

const ride = { id: 1, origin: "Del", destination: "Balige", departure_time: "2030-01-01T05:00:00.000Z", status: "open", driver_name: "Budi", seats_available: 2, price: 0 };

describe("RideSearchPage", () => {
  it("memuat dan menampilkan daftar", async () => {
    searchRides.mockResolvedValue([ride]);
    const { wrapper } = await mountPage(RideSearchPage);
    expect(wrapper.text()).toContain("Budi");
  });

  it("kosong", async () => {
    searchRides.mockResolvedValue([]);
    const { wrapper } = await mountPage(RideSearchPage);
    expect(wrapper.text()).toContain("Belum ada tumpangan");
  });

  it("error", async () => {
    searchRides.mockRejectedValue(new Error("Gagal memuat"));
    const { wrapper } = await mountPage(RideSearchPage);
    expect(wrapper.find("[role=alert]").text()).toBe("Gagal memuat");
  });

  it("indikator memuat", async () => {
    searchRides.mockReturnValue(new Promise(() => {}));
    const { wrapper } = await mountPage(RideSearchPage);
    expect(wrapper.text()).toContain("Memuat");
  });

  it("filter dikirim saat submit", async () => {
    searchRides.mockResolvedValue([]);
    const { wrapper } = await mountPage(RideSearchPage);
    await wrapper.find("[name=origin]").setValue("Del");
    await wrapper.find("[name=destination]").setValue("Balige");
    await wrapper.find("[name=date]").setValue("2030-01-01");
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(searchRides).toHaveBeenLastCalledWith({ origin: "Del", destination: "Balige", date: "2030-01-01" });
  });
});
