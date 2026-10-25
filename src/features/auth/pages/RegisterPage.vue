<script setup>
import { reactive, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "../states/authStore.js";

const auth = useAuthStore();
const router = useRouter();

const form = reactive({ name: "", username: "", password: "", phone: "" });
const error = ref("");
const loading = ref(false);

async function submit() {
  error.value = "";
  loading.value = true;
  try {
    await auth.register({ ...form });
    await router.push("/auth/login");
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <h1 class="text-xl font-bold mb-1">Daftar</h1>
  <p class="text-sm text-slate-500 mb-6">Buat akun untuk mulai nebeng.</p>

  <form class="space-y-4" @submit.prevent="submit">
    <p v-if="error" role="alert" class="rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{{ error }}</p>
    <label class="block text-sm font-medium">
      Nama lengkap
      <input id="name" v-model="form.name" required
        class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-2 focus:outline-indigo-500" />
    </label>
    <label class="block text-sm font-medium">
      Username
        <input id="username" v-model="form.username" type="text" required autocomplete="username"
        class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-2 focus:outline-indigo-500" />
    </label>
    <label class="block text-sm font-medium">
      No. HP (opsional)
      <input id="phone" v-model="form.phone" inputmode="tel"
        class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-2 focus:outline-indigo-500" />
    </label>
    <label class="block text-sm font-medium">
      Password (min. 6 karakter)
      <input id="password" v-model="form.password" type="password" required minlength="6" autocomplete="new-password"
        class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-2 focus:outline-indigo-500" />
    </label>
    <button id="btn-submit" type="submit" :disabled="loading"
      class="w-full rounded-lg bg-indigo-600 text-white font-semibold py-2.5 hover:bg-indigo-700 disabled:opacity-60">
      {{ loading ? "Memproses..." : "Daftar" }}
    </button>
  </form>

  <p class="text-sm text-center text-slate-500 mt-6">
    Sudah punya akun?
    <RouterLink to="/auth/login" class="text-indigo-600 font-semibold">Masuk</RouterLink>
  </p>
</template>
