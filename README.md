# HijauLog - Core Systems

![HijauLog](https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2000&auto=format&fit=crop)

**HijauLog** adalah infrastruktur pelacakan komoditas tingkat lanjut (Sustainable Commodity Traceability Infrastructure) dan sistem *Geo-Tagging* yang dirancang secara khusus untuk kepatuhan pasar global, khususnya **EUDR (European Union Deforestation Regulation)**.

Sistem ini membantu manajemen aset hutan berkelanjutan dengan telemetri spasial presisi, audit deforestasi otomatis, dan penerbitan *Due Diligence Statement (DDS)*.

## 🌟 Fitur Utama

- **Audit Intelligence**: Analisis spasial berlapis untuk setiap poligon lahan, mendeteksi risiko deforestasi historis dan kepadatan tutupan kanopi (Canopy Density).
- **Data Stream**: Konektivitas sinkronisasi *real-time* dengan database telemetri satelit untuk verifikasi garis panduan EUDR.
- **Audit Scheduler**: Jadwal verifikasi otomatis untuk memastikan aset Anda terus mematuhi regulasi deforestasi.
- **Database & Ekspor Laporan**: Fitur manajemen poligon lahan secara interaktif serta ekspor laporan komprehensif ke PDF, CSV, atau JSON yang memenuhi standar audit DDS Eropa (dilengkapi enkripsi SHA-256).
- **UI/UX Modern (Glassmorphism & Micro-Interactions)**: Antarmuka cantik yang responsif dengan efek kaca, *dark mode*, serta animasi GSAP yang presisi dan mulus.

## 🚀 Teknologi

Proyek ini dibangun di atas *stack* pengembangan web modern:
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [GSAP (GreenSock Animation Platform)](https://gsap.com/)
- [React Router](https://reactrouter.com/)
- [Lucide Icons](https://lucide.dev/)

## 🛠️ Menjalankan Proyek Secara Lokal

Ikuti langkah berikut untuk menjalankan HijauLog di mesin lokal Anda:

1. **Kloning Repositori:**
   ```bash
   git clone https://github.com/Vague233/hijau-log.git
   cd hijau-log
   ```

2. **Instalasi Dependensi:**
   ```bash
   npm install
   ```
   *(Atau gunakan `yarn install` / `pnpm install`)*

3. **Jalankan Server Development:**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan pada [http://localhost:5173/](http://localhost:5173/).

4. **Build untuk Production:**
   ```bash
   npm run build
   ```

## 📄 Lisensi

&copy; 2026 HijauLog Core Systems. All rights reserved.