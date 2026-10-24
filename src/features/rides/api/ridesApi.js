import { api } from "../../../helpers/apiHelper.js";

export const searchRides = (query) => api("/rides", { query });
export const getRide = (id) => api(`/rides/${id}`);
export const createRide = (payload) => api("/rides", { method: "POST", body: payload });
export const myRides = () => api("/rides/mine");
export const rideBookings = (id) => api(`/rides/${id}/bookings`);
export const completeRide = (id) => api(`/rides/${id}/complete`, { method: "POST" });
export const createBooking = (rideId, seats) =>
  api(`/rides/${rideId}/bookings`, { method: "POST", body: { seats } });
