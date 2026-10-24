<script setup>
import { RouterLink, RouterView, useRouter } from "vue-router";
import { Car } from "lucide-vue-next";
import { useAuthStore } from "../../auth/states/authStore.js";

const auth = useAuthStore();
const router = useRouter();

const links = [
  { to: "/rides", label: "Cari Tumpangan" },
  { to: "/rides/new", label: "Tawarkan" },
  { to: "/my-rides", label: "Tumpanganku" },
  { to: "/bookings", label: "Pemesananku" },
  { to: "/profile", label: "Profil" },
];

async function logout() {
  auth.logout();
  await router.push("/auth/login");
}
</script>

<template>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-10">
    <div class="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
      <RouterLink to="/rides" class="flex items-center gap-2 font-extrabold text-indigo-700">
        <Car class="size-5" /> NebengKampus
      </RouterLink>
      <nav class="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-slate-600 grow">
        <RouterLink v-for="l in links" :key="l.to" :to="l.to" active-class="text-indigo-700"
          exact-active-class="text-indigo-700" class="hover:text-indigo-700">
          {{ l.label }}
        </RouterLink>
      </nav>
      <button id="btn-logout" class="text-sm font-semibold text-slate-500 hover:text-red-600" @click="logout">
        Keluar
      </button>
    </div>
  </header>
  <main class="max-w-5xl mx-auto px-4 py-8">
    <RouterView />
  </main>
</template>
