import { describe, it, expect, vi } from "vitest";

vi.mock("../../../helpers/apiHelper.js", () => ({ api: vi.fn().mockResolvedValue("ok") }));
import { api } from "../../../helpers/apiHelper.js";
import { completeRide, createBooking, createRide, getRide, myRides, rideBookings, searchRides } from "./ridesApi.js";

describe("ridesApi", () => {
  it("memanggil endpoint yang tepat", async () => {
    await searchRides({ origin: "a" });
    expect(api).toHaveBeenLastCalledWith("/rides", { query: { origin: "a" } });
    await getRide(3);
    expect(api).toHaveBeenLastCalledWith("/rides/3");
    await createRide({ x: 1 });
    expect(api).toHaveBeenLastCalledWith("/rides", { method: "POST", body: { x: 1 } });
    await myRides();
    expect(api).toHaveBeenLastCalledWith("/rides/mine");
    await rideBookings(3);
    expect(api).toHaveBeenLastCalledWith("/rides/3/bookings");
    await completeRide(3);
    expect(api).toHaveBeenLastCalledWith("/rides/3/complete", { method: "POST" });
    await createBooking(3, 2);
    expect(api).toHaveBeenLastCalledWith("/rides/3/bookings", { method: "POST", body: { seats: 2 } });
  });
});
