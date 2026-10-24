import { describe, it, expect, vi, beforeEach } from "vitest";
import { mountPage, flushPromises } from "../../../test-utils.js";

vi.mock("../api/ridesApi.js");
vi.mock("../../bookings/api/bookingsApi.js");
import { completeRide, createBooking, getRide, rideBookings } from "../api/ridesApi.js";
import { cancelBooking, decideBooking, rateBooking } from "../../bookings/api/bookingsApi.js";
import RideDetailPage from "./RideDetailPage.vue";

const ride = (over = {}) => ({
  id: 5, origin: "Del", destination: "Balige", departure_time: "2030-01-01T05:00:00.000Z",
  seats_total: 3, seats_available: 2, price: 5000, notes: "bawa helm", status: "open",
  driver_name: "Budi", is_driver: false, my_booking: null, ...over,
});
const booking = (over = {}) => ({ id: 11, status: "pending", rating: null, ...over });
const mountDetail = () => mountPage(RideDetailPage, { path: "/rides/:id", route: "/rides/5" });

beforeEach(() => {
  rideBookings.mockResolvedValue([]);
});

describe("RideDetailPage - umum", () => {
  it("memuat", async () => {
    getRide.mockReturnValue(new Promise(() => {}));
    const { wrapper } = await mountDetail();
    expect(wrapper.text()).toContain("Memuat");
  });

  it("gagal memuat", async () => {
    getRide.mockRejectedValue(new Error("Tumpangan tidak ditemukan"));
    const { wrapper } = await mountDetail();
    expect(wrapper.find("[role=alert]").text()).toBe("Tumpangan tidak ditemukan");
    expect(wrapper.text()).not.toContain("Kursi tersedia");
  });

  it("tanpa catatan", async () => {
    getRide.mockResolvedValue(ride({ notes: null }));
    const { wrapper } = await mountDetail();
    expect(wrapper.text()).not.toContain("bawa helm");
  });
});

describe("RideDetailPage - penumpang", () => {
  it("memesan", async () => {
    getRide.mockResolvedValue(ride());
    createBooking.mockResolvedValue({ id: 1 });
    const { wrapper } = await mountDetail();
    expect(wrapper.text()).toContain("bawa helm");
    await wrapper.find("[name=seats]").setValue("2");
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(createBooking).toHaveBeenCalledWith("5", 2);
    expect(getRide).toHaveBeenCalledTimes(2);
  });

  it("gagal memesan", async () => {
    getRide.mockResolvedValue(ride());
    createBooking.mockRejectedValue(new Error("Kursi tidak mencukupi"));
    const { wrapper } = await mountDetail();
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(wrapper.find("[role=alert]").text()).toBe("Kursi tidak mencukupi");
    expect(wrapper.text()).toContain("Kursi tersedia");
  });

  it("tidak tersedia saat ride tidak open", async () => {
    getRide.mockResolvedValue(ride({ status: "completed" }));
    const { wrapper } = await mountDetail();
    expect(wrapper.text()).toContain("sudah tidak tersedia");
  });

  it("tidak tersedia saat kursi habis", async () => {
    getRide.mockResolvedValue(ride({ seats_available: 0 }));
    const { wrapper } = await mountDetail();
    expect(wrapper.find("#btn-book").exists()).toBe(false);
    expect(wrapper.text()).toContain("sudah tidak tersedia");
  });

  it("pending: bisa dibatalkan", async () => {
    getRide.mockResolvedValue(ride({ my_booking: booking() }));
    cancelBooking.mockResolvedValue(null);
    const { wrapper } = await mountDetail();
    expect(wrapper.text()).toContain("Menunggu");
    expect(wrapper.text()).not.toContain("Rating Anda");
    await wrapper.find("#btn-cancel").trigger("click");
    await flushPromises();
    expect(cancelBooking).toHaveBeenCalledWith(11);
  });

  it("approved & ride open: bisa batal, belum bisa rating", async () => {
    getRide.mockResolvedValue(ride({ my_booking: booking({ status: "approved" }) }));
    const { wrapper } = await mountDetail();
    expect(wrapper.find("#btn-cancel").exists()).toBe(true);
    expect(wrapper.find("#btn-rate").exists()).toBe(false);
  });

  it("rejected: tanpa aksi", async () => {
    getRide.mockResolvedValue(ride({ my_booking: booking({ status: "rejected" }) }));
    const { wrapper } = await mountDetail();
    expect(wrapper.find("#btn-cancel").exists()).toBe(false);
    expect(wrapper.find("#btn-rate").exists()).toBe(false);
  });

  it("pending tetapi ride sudah selesai: tidak bisa batal", async () => {
    getRide.mockResolvedValue(ride({ status: "completed", my_booking: booking() }));
    const { wrapper } = await mountDetail();
    expect(wrapper.find("#btn-cancel").exists()).toBe(false);
  });

  it("memberi rating setelah perjalanan selesai", async () => {
    getRide.mockResolvedValue(ride({ status: "completed", my_booking: booking({ status: "approved" }) }));
    rateBooking.mockResolvedValue(null);
    const { wrapper } = await mountDetail();
    expect(wrapper.find("#btn-cancel").exists()).toBe(false);
    await wrapper.find("[name=rating]").setValue("3");
    await wrapper.find("[name=review]").setValue("Ramah");
    await wrapper.find("form").trigger("submit");
    await flushPromises();
    expect(rateBooking).toHaveBeenCalledWith(11, 3, "Ramah");
  });

  it("sudah dirating", async () => {
    getRide.mockResolvedValue(ride({ status: "completed", my_booking: booking({ status: "approved", rating: 4 }) }));
    const { wrapper } = await mountDetail();
    expect(wrapper.text()).toContain("Rating Anda: 4/5");
    expect(wrapper.find("#btn-rate").exists()).toBe(false);
  });

  it("approved pada ride dibatalkan: tidak ada form rating", async () => {
    getRide.mockResolvedValue(ride({ status: "cancelled", my_booking: booking({ status: "approved" }) }));
    const { wrapper } = await mountDetail();
    expect(wrapper.find("#btn-rate").exists()).toBe(false);
  });
});

describe("RideDetailPage - pengemudi", () => {
  it("tanpa pemesan; bisa menyelesaikan", async () => {
    getRide.mockResolvedValue(ride({ is_driver: true }));
    completeRide.mockResolvedValue(null);
    const { wrapper } = await mountDetail();
    expect(wrapper.text()).toContain("Belum ada pemesan");
    await wrapper.find("#btn-complete").trigger("click");
    await flushPromises();
    expect(completeRide).toHaveBeenCalledWith("5");
  });

  it("menyetujui dan menolak pemesan", async () => {
    getRide.mockResolvedValue(ride({ is_driver: true }));
    rideBookings.mockResolvedValue([
      { id: 1, passenger_name: "Ani", seats: 1, status: "pending" },
      { id: 2, passenger_name: "Dedi", seats: 2, status: "approved" },
    ]);
    decideBooking.mockResolvedValue(null);
    const { wrapper } = await mountDetail();
    expect(wrapper.findAll(".btn-approve")).toHaveLength(1);
    await wrapper.find(".btn-approve").trigger("click");
    await flushPromises();
    expect(decideBooking).toHaveBeenLastCalledWith(1, "approved");
    await wrapper.find(".btn-reject").trigger("click");
    await flushPromises();
    expect(decideBooking).toHaveBeenLastCalledWith(1, "rejected");
  });

  it("ride selesai: tanpa tombol aksi walau ada pending", async () => {
    getRide.mockResolvedValue(ride({ is_driver: true, status: "completed" }));
    rideBookings.mockResolvedValue([{ id: 1, passenger_name: "Ani", seats: 1, status: "pending" }]);
    const { wrapper } = await mountDetail();
    expect(wrapper.find(".btn-approve").exists()).toBe(false);
    expect(wrapper.find("#btn-complete").exists()).toBe(false);
  });

  it("gagal menyelesaikan menampilkan error", async () => {
    getRide.mockResolvedValue(ride({ is_driver: true }));
    completeRide.mockRejectedValue(new Error("Tumpangan sudah tidak aktif"));
    const { wrapper } = await mountDetail();
    await wrapper.find("#btn-complete").trigger("click");
    await flushPromises();
    expect(wrapper.find("[role=alert]").text()).toBe("Tumpangan sudah tidak aktif");
  });
});
