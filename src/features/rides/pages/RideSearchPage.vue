<script setup>
import { onMounted, reactive, ref } from "vue";
import { searchRides } from "../api/ridesApi.js";
import RideCard from "../components/RideCard.vue";

const filters = reactive({ origin: "", destination: "", date: "" });
const rides = ref([]);
const loading = ref(true);
const error = ref("");

async function load() {
  loading.value = true;
  error.value = "";
  try {
    rides.value = await searchRides({ ...filters });
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <h1 class="text-2xl font-extrabold">Cari Tumpangan</h1>
  <form class="mt-4 grid gap-3 sm:grid-cols-4" @submit.prevent="load">
    <input v-model="filters.origin" name="origin" placeholder="Asal" aria-label="Asal"
      class="rounded-lg border border-slate-300 px-3 py-2 bg-white" />
    <input v-model="filters.destination" name="destination" placeholder="Tujuan" aria-label="Tujuan"
      class="rounded-lg border border-slate-300 px-3 py-2 bg-white" />
    <input v-model="filters.date" name="date" type="date" aria-label="Tanggal"
      class="rounded-lg border border-slate-300 px-3 py-2 bg-white" />
    <button type="submit" class="rounded-lg bg-indigo-600 text-white font-semibold px-4 py-2 hover:bg-indigo-700">Cari</button>
  </form>

  <p v-if="loading" class="mt-8 text-slate-500">Memuat...</p>
  <p v-else-if="error" role="alert" class="mt-8 rounded-lg bg-red-50 text-red-700 px-3 py-2">{{ error }}</p>
  <p v-else-if="!rides.length" class="mt-8 text-slate-500">Belum ada tumpangan yang cocok.</p>
  <div v-else class="mt-6 grid gap-4 sm:grid-cols-2">
    <RideCard v-for="r in rides" :key="r.id" :ride="r" />
  </div>
</template>
