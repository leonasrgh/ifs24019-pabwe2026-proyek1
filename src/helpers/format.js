export const formatRupiah = (n) =>
  n > 0 ? `Rp${Number(n).toLocaleString("id-ID")}` : "Gratis";

export const formatDateTime = (iso) =>
  new Date(iso).toLocaleString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const LABELS = {
  open: "Terbuka",
  completed: "Selesai",
  cancelled: "Dibatalkan",
  pending: "Menunggu",
  approved: "Disetujui",
  rejected: "Ditolak",
};
export const statusLabel = (s) => LABELS[s] || s;

// Hanya izinkan redirect internal (cegah open redirect)
export const safeRedirect = (target) =>
  typeof target === "string" && target.startsWith("/") && !target.startsWith("//")
    ? target
    : "/rides";
