<script setup>
import { RouterLink, RouterView } from "vue-router";
import { Car } from "lucide-vue-next";
</script>

<template>
  <main class="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-indigo-50 to-slate-100">
    <div class="w-full max-w-md">
      <RouterLink to="/" class="flex items-center justify-center gap-2 mb-6 text-indigo-700 font-extrabold text-2xl">
        <Car class="size-7" /> NebengKampus
      </RouterLink>
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <RouterView />
      </div>
    </div>
  </main>
</template>
