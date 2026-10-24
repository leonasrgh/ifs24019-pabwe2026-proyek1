import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import StatusBadge from "./StatusBadge.vue";

describe("StatusBadge", () => {
  it.each([
    ["open", "Terbuka", "bg-sky-100"],
    ["pending", "Menunggu", "bg-amber-100"],
    ["approved", "Disetujui", "bg-emerald-100"],
    ["rejected", "Ditolak", "bg-red-100"],
    ["cancelled", "Dibatalkan", "bg-slate-200"],
    ["completed", "Selesai", "bg-emerald-100"],
  ])("%s", (status, label, cls) => {
    const w = mount(StatusBadge, { props: { status } });
    expect(w.text()).toBe(label);
    expect(w.classes()).toContain(cls);
  });
});
