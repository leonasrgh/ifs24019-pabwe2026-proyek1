import { createRouter, createWebHistory } from "vue-router";
import { getToken } from "./helpers/apiHelper.js";
import HomePage from "./features/common/pages/HomePage.vue";
import AuthLayout from "./features/auth/layouts/AuthLayout.vue";
import LoginPage from "./features/auth/pages/LoginPage.vue";
import RegisterPage from "./features/auth/pages/RegisterPage.vue";
import AppLayout from "./features/common/layouts/AppLayout.vue";
import RideSearchPage from "./features/rides/pages/RideSearchPage.vue";
import RideFormPage from "./features/rides/pages/RideFormPage.vue";
import RideDetailPage from "./features/rides/pages/RideDetailPage.vue";
import MyRidesPage from "./features/rides/pages/MyRidesPage.vue";
import MyBookingsPage from "./features/bookings/pages/MyBookingsPage.vue";
import ProfilePage from "./features/users/pages/ProfilePage.vue";

export const routes = [
  { path: "/", component: HomePage },
  {
    path: "/auth",
    component: AuthLayout,
    meta: { guestOnly: true },
    children: [
      { path: "login", component: LoginPage },
      { path: "register", component: RegisterPage },
    ],
  },
  {
    path: "/",
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "rides", component: RideSearchPage },
      { path: "rides/new", component: RideFormPage },
      { path: "rides/:id(\\d+)", component: RideDetailPage },
      { path: "my-rides", component: MyRidesPage },
      { path: "bookings", component: MyBookingsPage },
      { path: "profile", component: ProfilePage },
    ],
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

export function createAppRouter(history = createWebHistory()) {
  const router = createRouter({ history, routes });

  router.beforeEach((to) => {
    const authed = Boolean(getToken());
    if (to.meta.requiresAuth && !authed) {
      return { path: "/auth/login", query: { redirect: to.fullPath } };
    }
    if (to.meta.guestOnly && authed) return "/rides";
    return true;
  });

  return router;
}

export default createAppRouter();
