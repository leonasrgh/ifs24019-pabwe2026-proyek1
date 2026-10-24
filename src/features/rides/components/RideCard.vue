<script setup>
import { RouterLink } from "vue-router";
import { ArrowRight, Clock, Users } from "lucide-vue-next";
import StatusBadge from "../../common/components/StatusBadge.vue";
import { formatDateTime, formatRupiah } from "../../../helpers/format.js";

defineProps({ ride: { type: Object, required: true } });
</script>

<template>
  <RouterLink :to="`/rides/${ride.id}`"
    class="block rounded-2xl bg-white border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-sm transition">
    <div class="flex items-start justify-between gap-3">
      <p class="font-bold flex flex-wrap items-center gap-2">
        {{ ride.origin }} <ArrowRight class="size-4 text-slate-400" /> {{ ride.destination }}
      </p>
      <StatusBadge :status="ride.status" />
    </div>
    <p class="mt-2 text-sm text-slate-600 flex items-center gap-1"><Clock class="size-4" /> {{ formatDateTime(ride.departure_time) }}</p>
    <div class="mt-3 flex items-center justify-between text-sm">
      <span class="text-slate-600">{{ ride.driver_name }}</span>
      <span class="flex items-center gap-3">
        <span class="flex items-center gap-1 text-slate-600"><Users class="size-4" /> {{ ride.seats_available }} kursi</span>
        <span class="font-bold text-indigo-700">{{ formatRupiah(ride.price) }}</span>
      </span>
    </div>
  </RouterLink>
</template>
