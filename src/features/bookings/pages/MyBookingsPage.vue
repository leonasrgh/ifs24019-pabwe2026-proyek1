<script setup>
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import StatusBadge from "../../common/components/StatusBadge.vue";
import { cancelBooking, myBookings } from "../api/bookingsApi.js";
import { formatDateTime, formatRupiah } from "../../../helpers/format.js";

const bookings = ref([]);
const loading = ref(true);
const error = ref("");

async function load() {
  try {
    bookings.value = await myBookings();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

async function cancel(id) {
  error.value = "";
  try {
    await cancelBooking(id);
    await load();
  } catch (e) {
    error.value = e.message;
  }
}

const canCancel = (b) => ["pending", "approved"].includes(b.status) && b.ride_status === "open";
const canRate = (b) => b.status === "approved" && b.ride_status === "completed" && b.rating === null;

onMounted(load);
</script>

<template>
  <h1 class="text-2xl font-extrabold">Pemesananku</h1>
  <p v-if="error" role="alert" class="mt-4 rounded-lg bg-red-50 text-red-700 px-3 py-2">{{ error }}</p>
  <p v-if="loading" class="mt-8 text-slate-500">Memuat...</p>
  <p v-else-if="!bookings.length && !error" class="mt-8 text-slate-500">
    Belum ada pemesanan. <RouterLink to="/rides" class="text-indigo-600 font-semibold">Cari tumpangan</RouterLink>
  </p>
  <ul v-else class="mt-6 space-y-4">
    <li v-for="b in bookings" :key="b.id" class="rounded-2xl bg-white border border-slate-200 p-5">
      <div class="flex items-start justify-between gap-3">
        <RouterLink :to="`/rides/${b.ride_id}`" class="font-bold hover:text-indigo-700">
          {{ b.origin }} → {{ b.destination }}
        </RouterLink>
        <StatusBadge :status="b.status" />
      </div>
      <p class="text-sm text-slate-600 mt-1">{{ formatDateTime(b.departure_time) }} · {{ b.driver_name }}</p>
      <p class="text-sm text-slate-600">{{ b.seats }} kursi · {{ formatRupiah(b.price * b.seats) }}</p>
      <div class="mt-3 flex gap-4 text-sm font-semibold">
        <button v-if="canCancel(b)" class="btn-cancel text-red-600" @click="cancel(b.id)">Batalkan</button>
        <RouterLink v-if="canRate(b)" :to="`/rides/${b.ride_id}`" class="link-rate text-indigo-600">Beri rating</RouterLink>
        <span v-if="b.rating !== null" class="text-amber-600">Rating Anda: {{ b.rating }}/5</span>
      </div>
    </li>
  </ul>
</template>
