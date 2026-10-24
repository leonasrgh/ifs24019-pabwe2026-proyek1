<script setup>
import { computed } from "vue";
import { statusLabel } from "../../../helpers/format.js";

const props = defineProps({ status: { type: String, required: true } });

const COLORS = {
  open: "bg-sky-100 text-sky-700",
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  completed: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-slate-200 text-slate-600",
};
const color = computed(() => COLORS[props.status]);
</script>

<template>
  <span class="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="color">
    {{ statusLabel(status) }}
  </span>
</template>
