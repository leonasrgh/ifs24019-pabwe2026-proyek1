<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import StatusBadge from "../../common/components/StatusBadge.vue";
import { completeRide, createBooking, getRide, rideBookings } from "../api/ridesApi.js";
import { cancelBooking, decideBooking, rateBooking } from "../../bookings/api/bookingsApi.js";
import { formatDateTime, formatRupiah } from "../../../helpers/format.js";

const route = useRoute();
const id = route.params.id;

const ride = ref(null);
const bookings = ref([]);
const loading = ref(true);
const error = ref("");
const seats = ref(1);
const rating = ref(5);
const review = ref("");

const mine = computed(() => ride.value?.my_booking);
const isOpen = computed(() => ride.value?.status === "open");
const canBook = computed(() => !mine.value && isOpen.value && ride.value.seats_available > 0);
const canCancel = computed(() => ["pending", "approved"].includes(mine.value?.status) && isOpen.value);
const canRate = computed(
  () => mine.value?.status === "approved" && ride.value.status === "completed" && mine.value.rating === null,
);

async function load() {
  try {
    ride.value = await getRide(id);
    bookings.value = ride.value.is_driver ? await rideBookings(id) : [];
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

// Jalankan aksi lalu muat ulang; error ditampilkan tanpa membuang data.
async function run(action) {
  error.value = "";
  try {
    await action();
    await load();
  } catch (e) {
    error.value = e.message;
  }
}

const book = () => run(() => createBooking(id, Number(seats.value)));
const cancel = () => run(() => cancelBooking(mine.value.id));
const rate = () => run(() => rateBooking(mine.value.id, Number(rating.value), review.value));
const decide = (bookingId, status) => run(() => decideBooking(bookingId, status));
const complete = () => run(() => completeRide(id));

onMounted(load);
</script>

<template>
  <p v-if="loading" class="text-slate-500">Memuat...</p>
  <template v-else>
    <p v-if="error" role="alert" class="mb-4 rounded-lg bg-red-50 text-red-700 px-3 py-2">{{ error }}</p>

    <div v-if="ride" class="space-y-6">
      <section class="rounded-2xl bg-white border border-slate-200 p-6">
        <div class="flex items-start justify-between gap-3">
          <h1 class="text-2xl font-extrabold">{{ ride.origin }} → {{ ride.destination }}</h1>
          <StatusBadge :status="ride.status" />
        </div>
        <dl class="mt-4 grid gap-3 sm:grid-cols-4 text-sm">
          <div><dt class="text-slate-500">Berangkat</dt><dd class="font-semibold">{{ formatDateTime(ride.departure_time) }}</dd></div>
          <div><dt class="text-slate-500">Pengemudi</dt><dd class="font-semibold">{{ ride.driver_name }}</dd></div>
          <div><dt class="text-slate-500">Kursi tersedia</dt><dd class="font-semibold">{{ ride.seats_available }} / {{ ride.seats_total }}</dd></div>
          <div><dt class="text-slate-500">Harga</dt><dd class="font-semibold">{{ formatRupiah(ride.price) }}</dd></div>
        </dl>
        <p v-if="ride.notes" class="mt-4 text-sm text-slate-600">{{ ride.notes }}</p>
      </section>

      <!-- Penumpang -->
      <section v-if="!ride.is_driver" class="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
        <form v-if="canBook" class="flex items-end gap-3" @submit.prevent="book">
          <label class="text-sm font-medium">Jumlah kursi
            <input v-model="seats" name="seats" type="number" min="1" :max="ride.seats_available"
              class="mt-1 block w-24 rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <button id="btn-book" type="submit" class="rounded-lg bg-indigo-600 text-white font-semibold px-5 py-2.5 hover:bg-indigo-700">
            Pesan tumpangan
          </button>
        </form>

        <div v-else-if="mine" class="space-y-3">
          <p class="flex items-center gap-2 text-sm">Status pemesanan Anda: <StatusBadge :status="mine.status" /></p>
          <button v-if="canCancel" id="btn-cancel" class="text-sm font-semibold text-red-600" @click="cancel">Batalkan pemesanan</button>
          <p v-if="mine.rating !== null" class="text-sm text-amber-600 font-semibold">Rating Anda: {{ mine.rating }}/5</p>
          <form v-if="canRate" class="space-y-3" @submit.prevent="rate">
            <label class="block text-sm font-medium">Rating
              <select v-model="rating" name="rating" class="mt-1 block rounded-lg border border-slate-300 px-3 py-2">
                <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
              </select>
            </label>
            <label class="block text-sm font-medium">Ulasan (opsional)
              <textarea v-model="review" name="review" rows="2" class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
            </label>
            <button id="btn-rate" type="submit" class="rounded-lg bg-amber-500 text-white font-semibold px-5 py-2">Kirim rating</button>
          </form>
        </div>

        <p v-else class="text-sm text-slate-500">Tumpangan ini sudah tidak tersedia untuk dipesan.</p>
      </section>

      <!-- Pengemudi -->
      <section v-else class="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
        <h2 class="font-bold">Pemesan</h2>
        <p v-if="!bookings.length" class="text-sm text-slate-500">Belum ada pemesan.</p>
        <ul v-else class="divide-y divide-slate-100">
          <li v-for="b in bookings" :key="b.id" class="py-3 flex flex-wrap items-center justify-between gap-3">
            <span class="text-sm"><b>{{ b.passenger_name }}</b> · {{ b.seats }} kursi</span>
            <span class="flex items-center gap-3">
              <StatusBadge :status="b.status" />
              <template v-if="b.status === 'pending' && isOpen">
                <button class="btn-approve text-sm font-semibold text-emerald-600" @click="decide(b.id, 'approved')">Setujui</button>
                <button class="btn-reject text-sm font-semibold text-red-600" @click="decide(b.id, 'rejected')">Tolak</button>
              </template>
            </span>
          </li>
        </ul>
        <button v-if="isOpen" id="btn-complete" class="rounded-lg bg-emerald-600 text-white font-semibold px-5 py-2.5 hover:bg-emerald-700"
          @click="complete">Selesaikan perjalanan</button>
      </section>
    </div>
  </template>
</template>
