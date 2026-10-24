import { defineStore } from "pinia";
import { clearToken, getToken, setToken } from "../../../helpers/apiHelper.js";
import { fetchProfile, loginUser, registerUser } from "../api/authApi.js";

export const useAuthStore = defineStore("auth", {
  state: () => ({ token: getToken(), user: null }),
  getters: {
    isAuthenticated: (s) => Boolean(s.token),
  },
  actions: {
    async login(username, password) {
      const { token } = await loginUser({ username, password });
      setToken(token);
      this.token = token;
    },
    register(payload) {
      return registerUser(payload);
    },
    async loadProfile() {
      this.user = await fetchProfile();
    },
    logout() {
      clearToken();
      this.token = null;
      this.user = null;
    },
  },
});
