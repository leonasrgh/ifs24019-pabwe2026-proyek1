import { describe, it, expect, vi } from "vitest";
import { mountPage, flushPromises } from "../../../test-utils.js";

vi.mock("../api/bookingsApi.js");
import { cancelBooking, myBookings } from "../api/bookingsApi.js";
import MyBookingsPage from "./MyBookingsPage.vue";

const base = { id: 1, ride_id: 10, origin: "A", destination: "B", departure_time: "2030-01-01T05:00:00.000Z", price: 1000, seats: 2, driver_name: "Budi", rating: null };

describe("MyBookingsPage", () => {
  it("pending bisa dibatalkan, lalu daftar dimuat ulang", async () => {
    myBookings.mockResolvedValueOnce([{ ...base, status: "pending", ride_status: "open" }]).mockResolvedValueOnce([]);
    cancelBooking.mockResolvedValue(null);
    const { wrapper } = await mountPage(MyBookingsPage);
    expect(wrapper.find(".link-rate").exists()).toBe(false);
    await wrapper.find(".btn-cancel").trigger("click");
    await flushPromises();
    expect(cancelBooking).toHaveBeenCalledWith(1);
    expect(wrapper.text()).toContain("Belum ada pemesanan");
  });

  it("gagal batal menampilkan error", async () => {
    myBookings.mockResolvedValue([{ ...base, status: "approved", ride_status: "open" }]);
    cancelBooking.mockRejectedValue(new Error("tidak bisa"));
    const { wrapper } = await mountPage(MyBookingsPage);
    await wrapper.find(".btn-cancel").trigger("click");
    await flushPromises();
    expect(wrapper.find("[role=alert]").text()).toBe("tidak bisa");
  });

  it("selesai & belum dirating -> tautan rating", async () => {
    myBookings.mockResolvedValue([{ ...base, status: "approved", ride_status: "completed" }]);
    const { wrapper } = await mountPage(MyBookingsPage);
    expect(wrapper.find(".link-rate").attributes("href")).toBe("/rides/10");
    expect(wrapper.find(".btn-cancel").exists()).toBe(false);
  });

  it("sudah dirating menampilkan nilai", async () => {
    myBookings.mockResolvedValue([{ ...base, status: "approved", ride_status: "completed", rating: 5 }]);
    const { wrapper } = await mountPage(MyBookingsPage);
    expect(wrapper.text()).toContain("Rating Anda: 5/5");
    expect(wrapper.find(".link-rate").exists()).toBe(false);
  });

  it("ditolak: tidak ada aksi", async () => {
    myBookings.mockResolvedValue([{ ...base, status: "rejected", ride_status: "open" }]);
    const { wrapper } = await mountPage(MyBookingsPage);
    expect(wrapper.find(".btn-cancel").exists()).toBe(false);
    expect(wrapper.find(".link-rate").exists()).toBe(false);
  });

  it("approved tetapi ride belum selesai: tidak ada tautan rating", async () => {
    myBookings.mockResolvedValue([{ ...base, status: "approved", ride_status: "cancelled" }]);
    const { wrapper } = await mountPage(MyBookingsPage);
    expect(wrapper.find(".link-rate").exists()).toBe(false);
    expect(wrapper.find(".btn-cancel").exists()).toBe(false);
  });

  it("error muat", async () => {
    myBookings.mockRejectedValue(new Error("gagal"));
    const { wrapper } = await mountPage(MyBookingsPage);
    expect(wrapper.find("[role=alert]").text()).toBe("gagal");
    expect(wrapper.text()).not.toContain("Belum ada pemesanan");
  });

  it("memuat", async () => {
    myBookings.mockReturnValue(new Promise(() => {}));
    const { wrapper } = await mountPage(MyBookingsPage);
    expect(wrapper.text()).toContain("Memuat");
  });
});
