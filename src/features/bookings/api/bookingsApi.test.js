import { describe, it, expect, vi } from "vitest";

vi.mock("../../../helpers/apiHelper.js", () => ({ api: vi.fn().mockResolvedValue("ok") }));
import { api } from "../../../helpers/apiHelper.js";
import { cancelBooking, decideBooking, myBookings, rateBooking } from "./bookingsApi.js";

describe("bookingsApi", () => {
  it("memanggil endpoint yang tepat", async () => {
    await myBookings();
    expect(api).toHaveBeenLastCalledWith("/bookings/mine");
    await decideBooking(5, "approved");
    expect(api).toHaveBeenLastCalledWith("/bookings/5", { method: "PATCH", body: { status: "approved" } });
    await cancelBooking(5);
    expect(api).toHaveBeenLastCalledWith("/bookings/5/cancel", { method: "POST" });
    await rateBooking(5, 4, "ok");
    expect(api).toHaveBeenLastCalledWith("/bookings/5/rating", { method: "POST", body: { rating: 4, review: "ok" } });
  });
});
