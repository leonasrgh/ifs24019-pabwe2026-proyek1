import { api } from "../../../helpers/apiHelper.js";

export const registerUser = (payload) => api("/auth/register", { method: "POST", body: payload, auth: false });
export const loginUser = (payload) => api("/auth/login", { method: "POST", body: payload, auth: false });
export const fetchProfile = () => api("/users/me");
