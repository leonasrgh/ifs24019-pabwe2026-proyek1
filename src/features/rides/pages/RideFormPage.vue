<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { createRide } from "../api/ridesApi.js";

const router = useRouter();
const form = reactive({ origin: "", destination: "", departure_time: "", seats_total: 2, price: 0, notes: "" });
const error = ref("");
const loading = ref(false);

async function submit() {
  error.value = "";
  loading.value = true;
  try {
    const { id } = await createRide({
      ...form,
      departure_time: new Date(form.departure_time).toISOString(),
      seats_total: Number(form.seats_total),
      price: Number(form.price),
    });
    await router.push(`/rides/${id}`);
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <h1 class="text-2xl font-extrabold">Tawarkan Tumpangan</h1>
  <form class="mt-6 max-w-xl space-y-4 bg-white border border-slate-200 rounded-2xl p-6" @submit.prevent="submit">
    <p v-if="error" role="alert" class="rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{{ error }}</p>
    <div class="grid gap-4 sm:grid-cols-2">
      <label class="block text-sm font-medium">Asal
        <input v-model="form.origin" name="origin" required class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
      </label>
      <label class="block text-sm font-medium">Tujuan
        <input v-model="form.destination" name="destination" required class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
      </label>
    </div>
    <label class="block text-sm font-medium">Waktu berangkat
      <input v-model="form.departure_time" name="departure_time" type="datetime-local" required
        class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
    </label>
    <div class="grid gap-4 sm:grid-cols-2">
      <label class="block text-sm font-medium">Jumlah kursi
        <input v-model="form.seats_total" name="seats_total" type="number" min="1" max="8" required
          class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
      </label>
      <label class="block text-sm font-medium">Harga per kursi (Rp)
        <input v-model="form.price" name="price" type="number" min="0" step="500" required
          class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
      </label>
    </div>
    <label class="block text-sm font-medium">Catatan (opsional)
      <textarea v-model="form.notes" name="notes" rows="3" class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
    </label>
    <button type="submit" :disabled="loading"
      class="rounded-lg bg-indigo-600 text-white font-semibold px-5 py-2.5 hover:bg-indigo-700 disabled:opacity-60">
      {{ loading ? "Menyimpan..." : "Tawarkan" }}
    </button>
  </form>
</template>
