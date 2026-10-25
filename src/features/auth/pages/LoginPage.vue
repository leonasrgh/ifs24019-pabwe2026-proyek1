<script setup>
import { ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../states/authStore.js";
import { safeRedirect } from "../../../helpers/format.js";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const username = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

async function submit() {
  error.value = "";
  loading.value = true;
  try {
    await auth.login(username.value, password.value);
    await router.push(safeRedirect(route.query.redirect));
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <h1 class="text-xl font-bold mb-1">Masuk</h1>
  <p class="text-sm text-slate-500 mb-6">Cari atau tawarkan tumpangan sesama mahasiswa.</p>

  <form class="space-y-4" @submit.prevent="submit">
    <p v-if="error" role="alert" class="rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{{ error }}</p>
    <label class="block text-sm font-medium">
      Username
        <input id="username" v-model="username" type="text" required autocomplete="username"
        class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-2 focus:outline-indigo-500" />
    </label>
    <label class="block text-sm font-medium">
      Password
      <input id="password" v-model="password" type="password" required autocomplete="current-password"
        class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-2 focus:outline-indigo-500" />
    </label>
    <button id="btn-submit" type="submit" :disabled="loading"
      class="w-full rounded-lg bg-indigo-600 text-white font-semibold py-2.5 hover:bg-indigo-700 disabled:opacity-60">
      {{ loading ? "Memproses..." : "Masuk" }}
    </button>
  </form>

  <p class="text-sm text-center text-slate-500 mt-6">
    Belum punya akun?
    <RouterLink to="/auth/register" class="text-indigo-600 font-semibold">Daftar</RouterLink>
  </p>
</template>
