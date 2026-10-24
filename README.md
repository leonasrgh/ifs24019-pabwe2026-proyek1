# NebengKampus — Frontend (ifs24019-pabwe2026-proyek1)

Vue 3 + Vite + Pinia + Vue Router + Tailwind CSS v4. Backend terpisah: `ifs24019-pabwe2026-proyek1-api`.

```bash
cp .env.example .env      # isi VITE_API_BASEURL dengan URL backend
bun install
bun run dev               # http://localhost:3000
bun run test:coverage     # threshold 100%
bun run build
```

Rute publik: `/`, `/auth/login`, `/auth/register`.
Rute setelah login: `/rides`, `/rides/new`, `/rides/:id`, `/my-rides`, `/bookings`, `/profile`.

`VITE_API_BASEURL` dibaca saat build (lihat `vite.config.js`, konstanta `API_BASEURL`). Karena paket Jenkins tidak menyertakan `.env*`,
ubah nilai default di `vite.config.js` ke URL backend produksi sebelum push ke GitHub.
