<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { Star } from "lucide-vue-next";
import { useAuthStore } from "../../auth/states/authStore.js";

const auth = useAuthStore();
const router = useRouter();
const error = ref("");

onMounted(async () => {
  try {
    await auth.loadProfile();
  } catch (e) {
    error.value = e.message;
  }
});

async function logout() {
  auth.logout();
  await router.push("/auth/login");
}
</script>

<template>
  <h1 class="text-2xl font-extrabold">Profil</h1>
  <p v-if="error" role="alert" class="mt-6 rounded-lg bg-red-50 text-red-700 px-3 py-2">{{ error }}</p>
  <div v-else-if="auth.user" class="mt-6 max-w-md rounded-2xl bg-white border border-slate-200 p-6 space-y-2">
    <p class="text-xl font-bold">{{ auth.user.name }}</p>
    <p class="text-slate-500">@{{ auth.user.username }}</p>
    <p v-if="auth.user.phone" class="text-slate-600">{{ auth.user.phone }}</p>
    <p class="flex items-center gap-1 text-amber-600 font-semibold">
      <Star class="size-4" />
      <span v-if="auth.user.rating_count">{{ auth.user.rating_avg }} ({{ auth.user.rating_count }} ulasan)</span>
      <span v-else class="text-slate-500 font-normal">Belum ada rating sebagai pengemudi</span>
    </p>
    <button id="btn-profile-logout" class="mt-4 rounded-lg border border-slate-300 px-4 py-2 font-semibold hover:bg-slate-50"
      @click="logout">Keluar</button>
  </div>
  <p v-else class="mt-6 text-slate-500">Memuat...</p>
</template>
