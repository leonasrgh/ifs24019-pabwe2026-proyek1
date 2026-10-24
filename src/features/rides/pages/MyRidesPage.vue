<script setup>
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { myRides } from "../api/ridesApi.js";
import RideCard from "../components/RideCard.vue";

const rides = ref([]);
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    rides.value = await myRides();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <h1 class="text-2xl font-extrabold">Tumpanganku</h1>
  <p v-if="loading" class="mt-8 text-slate-500">Memuat...</p>
  <p v-else-if="error" role="alert" class="mt-8 rounded-lg bg-red-50 text-red-700 px-3 py-2">{{ error }}</p>
  <p v-else-if="!rides.length" class="mt-8 text-slate-500">
    Belum ada tumpangan. <RouterLink to="/rides/new" class="text-indigo-600 font-semibold">Tawarkan sekarang</RouterLink>
  </p>
  <div v-else class="mt-6 grid gap-4 sm:grid-cols-2">
    <RideCard v-for="r in rides" :key="r.id" :ride="r" />
  </div>
</template>
