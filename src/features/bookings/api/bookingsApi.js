import { api } from "../../../helpers/apiHelper.js";

export const myBookings = () => api("/bookings/mine");
export const decideBooking = (id, status) => api(`/bookings/${id}`, { method: "PATCH", body: { status } });
export const cancelBooking = (id) => api(`/bookings/${id}/cancel`, { method: "POST" });
export const rateBooking = (id, rating, review) =>
  api(`/bookings/${id}/rating`, { method: "POST", body: { rating, review } });
