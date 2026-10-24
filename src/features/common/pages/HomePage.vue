<script setup>
import { RouterLink } from "vue-router";
import { Car, ShieldCheck, Star, Wallet } from "lucide-vue-next";
import { useAuthStore } from "../../auth/states/authStore.js";

const auth = useAuthStore();
const features = [
  { icon: Wallet, title: "Hemat", text: "Patungan ongkos bensin dengan teman satu kampus." },
  { icon: ShieldCheck, title: "Terpercaya", text: "Pengemudi menyetujui setiap pemesanan sebelum berangkat." },
  { icon: Star, title: "Transparan", text: "Rating setelah perjalanan selesai membantu semua orang." },
];
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-100">
    <div class="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
      <span class="flex items-center gap-2 font-extrabold text-indigo-700 text-lg"><Car class="size-6" /> NebengKampus</span>
      <RouterLink :to="auth.isAuthenticated ? '/rides' : '/auth/login'" class="text-sm font-semibold text-indigo-700">
        {{ auth.isAuthenticated ? "Buka aplikasi" : "Masuk" }}
      </RouterLink>
    </div>
    <section class="max-w-3xl mx-auto px-4 pt-16 pb-12 text-center">
      <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight">Pulang dan pergi kampus, <span class="text-indigo-600">bareng</span>.</h1>
      <p class="mt-4 text-lg text-slate-600">Tawarkan kursi kosongmu atau cari tumpangan ke arah yang sama.</p>
      <div class="mt-8 flex justify-center gap-3">
        <RouterLink to="/auth/register" class="rounded-lg bg-indigo-600 text-white font-semibold px-5 py-2.5 hover:bg-indigo-700">Mulai sekarang</RouterLink>
        <RouterLink to="/auth/login" class="rounded-lg border border-slate-300 bg-white font-semibold px-5 py-2.5 hover:bg-slate-50">Masuk</RouterLink>
      </div>
    </section>
    <section class="max-w-5xl mx-auto px-4 pb-20 grid gap-4 sm:grid-cols-3">
      <div v-for="f in features" :key="f.title" class="rounded-2xl bg-white border border-slate-200 p-5">
        <component :is="f.icon" class="size-6 text-indigo-600" />
        <h2 class="mt-3 font-bold">{{ f.title }}</h2>
        <p class="text-sm text-slate-600 mt-1">{{ f.text }}</p>
      </div>
    </section>
  </div>
</template>
