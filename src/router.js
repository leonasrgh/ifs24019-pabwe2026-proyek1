import { createRouter, createWebHistory } from "vue-router";
import { getToken } from "./helpers/apiHelper.js";

export const routes = [
  { path: "/", component: () => import("./features/common/pages/HomePage.vue") },
  {
    path: "/auth",
    component: () => import("./features/auth/layouts/AuthLayout.vue"),
    meta: { guestOnly: true },
    children: [
      { path: "login", component: () => import("./features/auth/pages/LoginPage.vue") },
      { path: "register", component: () => import("./features/auth/pages/RegisterPage.vue") },
    ],
  },
  {
    path: "/",
    component: () => import("./features/common/layouts/AppLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      { path: "rides", component: () => import("./features/rides/pages/RideSearchPage.vue") },
      { path: "rides/new", component: () => import("./features/rides/pages/RideFormPage.vue") },
      { path: "rides/:id(\\d+)", component: () => import("./features/rides/pages/RideDetailPage.vue") },
      { path: "my-rides", component: () => import("./features/rides/pages/MyRidesPage.vue") },
      { path: "bookings", component: () => import("./features/bookings/pages/MyBookingsPage.vue") },
      { path: "profile", component: () => import("./features/users/pages/ProfilePage.vue") },
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
