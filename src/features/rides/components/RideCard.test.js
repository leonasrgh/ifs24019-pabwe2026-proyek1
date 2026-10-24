import { describe, it, expect } from "vitest";
import { mountPage } from "../../../test-utils.js";
import RideCard from "./RideCard.vue";

describe("RideCard", () => {
  it("menampilkan ringkasan tumpangan", async () => {
    const ride = { id: 7, origin: "Del", destination: "Balige", departure_time: "2030-01-01T05:00:00.000Z", status: "open", driver_name: "Budi", seats_available: 2, price: 5000 };
    const { wrapper } = await mountPage(RideCard, { props: { ride } });
    expect(wrapper.attributes("href")).toBe("/rides/7");
    expect(wrapper.text()).toContain("Del");
    expect(wrapper.text()).toContain("Balige");
    expect(wrapper.text()).toContain("Budi");
    expect(wrapper.text()).toContain("2 kursi");
  });
});
