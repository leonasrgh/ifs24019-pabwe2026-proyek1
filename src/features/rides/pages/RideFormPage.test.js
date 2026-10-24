import { describe, it, expect, vi } from "vitest";
import { mountPage, flushPromises } from "../../../test-utils.js";

vi.mock("../api/ridesApi.js");
import { createRide } from "../api/ridesApi.js";
import RideFormPage from "./RideFormPage.vue";

async function fill(wrapper) {
  await wrapper.find("[name=origin]").setValue("Del");
  await wrapper.find("[name=destination]").setValue("Balige");
  await wrapper.find("[name=departure_time]").setValue("2030-01-01T08:00");
  await wrapper.find("[name=seats_total]").setValue("3");
  await wrapper.find("[name=price]").setValue("5000");
  await wrapper.find("[name=notes]").setValue("bawa helm");
  await wrapper.find("form").trigger("submit");
}

describe("RideFormPage", () => {
  it("sukses -> halaman detail", async () => {
    createRide.mockResolvedValue({ id: 9 });
    const { wrapper, router } = await mountPage(RideFormPage);
    await fill(wrapper);
    await flushPromises();
    const payload = createRide.mock.calls[0][0];
    expect(payload).toMatchObject({ origin: "Del", destination: "Balige", seats_total: 3, price: 5000, notes: "bawa helm" });
    expect(payload.departure_time).toBe(new Date("2030-01-01T08:00").toISOString());
    expect(router.currentRoute.value.path).toBe("/rides/9");
  });

  it("gagal menampilkan pesan", async () => {
    createRide.mockRejectedValue(new Error("Waktu keberangkatan harus di masa depan"));
    const { wrapper } = await mountPage(RideFormPage);
    await fill(wrapper);
    await flushPromises();
    expect(wrapper.find("[role=alert]").text()).toContain("masa depan");
  });

  it("status menyimpan", async () => {
    let resolve;
    createRide.mockReturnValue(new Promise((r) => (resolve = r)));
    const { wrapper } = await mountPage(RideFormPage);
    await fill(wrapper);
    expect(wrapper.find("button[type=submit]").text()).toBe("Menyimpan...");
    resolve({ id: 1 });
    await flushPromises();
  });
});
