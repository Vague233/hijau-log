import { Link } from "react-router";
import { ShieldCheck, MapPin, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "../../lib/AuthContext";

export function PrivacyPolicy() {
  const { session } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-charcoal)] pt-32 pb-20 px-4 md:px-16 font-outfit">
      <div className="max-w-4xl mx-auto">
        <Link to={session ? "/dashboard" : "/"} className="inline-flex items-center gap-2 text-[var(--color-moss)] hover:opacity-80 transition-opacity mb-8 font-semibold">
          <ArrowLeft className="size-4" />
          Kembali ke Beranda
        </Link>
        
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="size-8 text-[var(--color-clay)]" />
          <h1 className="text-4xl md:text-5xl font-serif italic text-[var(--color-charcoal)]">Kebijakan Privasi</h1>
        </div>
        
        <p className="text-sm opacity-60 mb-12 font-mono">Pembaruan Terakhir: 30 Juli 2026</p>

        <div className="space-y-10 text-lg leading-relaxed opacity-90">
          
          <section>
            <h2 className="text-2xl font-sans font-bold mb-4 text-[var(--color-moss)]">1. Pendahuluan</h2>
            <p>
              Selamat datang di <strong>HijauLog</strong>. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, memproses, dan melindungi informasi dan data pribadi Anda saat menggunakan platform telemetri spasial dan sistem traceability geo-tagging kami. Sistem kami dirancang khusus untuk memfasilitasi kepatuhan terhadap <em>European Union Deforestation Regulation</em> (EUDR) dan regulasi pasar global lainnya.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-sans font-bold mb-4 text-[var(--color-moss)]">2. Informasi yang Kami Kumpulkan</h2>
            <p className="mb-3">Untuk menyediakan layanan traceability yang presisi, kami mengumpulkan berbagai jenis data, termasuk namun tidak terbatas pada:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Data Identitas Perusahaan & Pengguna:</strong> Nama lengkap, alamat email, nomor telepon, nama perusahaan, dan kredensial otentikasi.</li>
              <li><strong>Data Geospasial & Operasional:</strong> Titik koordinat GPS (geo-tagging), poligon lahan, batas area hutan, luasan area, dan data satelit historis yang terkait dengan lahan yang didaftarkan.</li>
              <li><strong>Data Rantai Pasok (Supply Chain):</strong> Riwayat kepemilikan komoditas (kayu), catatan perpindahan logistik, dokumen legalitas, dan <em>Due Diligence Statement</em>.</li>
              <li><strong>Data Telemetri Sistem:</strong> Log aktivitas sistem, alamat IP, jenis perangkat, waktu akses, dan interaksi pengguna di dalam dashboard.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-sans font-bold mb-4 text-[var(--color-moss)]">3. Penggunaan Data</h2>
            <p className="mb-3">Data yang dikumpulkan digunakan untuk tujuan berikut:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Verifikasi Kepatuhan EUDR:</strong> Melakukan analisis geospasial mendalam untuk memastikan poligon lahan bebas dari indikasi deforestasi pasca 31 Desember 2020.</li>
              <li><strong>Traceability Terenkripsi:</strong> Menghasilkan kode QR terenkripsi (menggunakan algoritma seperti SHA-256) yang membuktikan riwayat asal-usul komoditas untuk keperluan inspeksi otoritas di pelabuhan tujuan.</li>
              <li><strong>Penyediaan & Peningkatan Layanan:</strong> Mengoperasikan platform, memelihara keamanan sistem, menyediakan dukungan teknis, dan mengembangkan algoritma <em>audit scheduler</em> yang lebih cerdas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-sans font-bold mb-4 text-[var(--color-moss)]">4. Perlindungan & Keamanan Data</h2>
            <p>
              Keamanan data adalah prioritas utama infrastruktur kami. Kami menerapkan standar enkripsi industri untuk melindungi data rantai pasok dan kredensial Anda baik saat transit maupun saat disimpan (data-at-rest). Akses terhadap data geospasial sensitif dibatasi hanya kepada pihak-pihak yang memiliki hak akses yang sah dalam rantai pasok Anda dan otoritas regulasi yang relevan sesuai persetujuan Anda.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-sans font-bold mb-4 text-[var(--color-moss)]">5. Berbagi Data dengan Pihak Ketiga</h2>
            <p>
              Kami tidak menjual data Anda kepada pihak ketiga. Data Anda hanya akan dibagikan dalam kondisi berikut:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Kepada otoritas pemerintah atau regulator (seperti bea cukai atau badan pengawas Eropa) sebagai bagian dari proses <em>Due Diligence</em> yang Anda inisiasi melalui platform kami.</li>
              <li>Kepada penyedia layanan cloud dan infrastruktur yang terikat oleh perjanjian kerahasiaan data yang ketat untuk mengoperasikan HijauLog.</li>
              <li>Jika diwajibkan oleh hukum atau proses peradilan yang berlaku.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-sans font-bold mb-4 text-[var(--color-moss)]">6. Hak Pengguna</h2>
            <p>
              Anda memiliki hak penuh untuk mengakses, memperbarui, atau meminta penghapusan data operasional dan akun Anda di HijauLog. Namun, perlu diperhatikan bahwa penghapusan titik geolokasi atau poligon yang telah tercatat dalam rantai pasok yang diterbitkan mungkin dibatasi oleh kewajiban penyimpanan data secara hukum atau audit EUDR.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-sans font-bold mb-4 text-[var(--color-moss)]">7. Hubungi Kami</h2>
            <p>
              Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini, praktik keamanan data kami, atau implementasi EUDR pada platform kami, silakan hubungi tim kepatuhan kami melalui email di <strong>compliance@hijaulog.com</strong>.
            </p>
          </section>
          
        </div>
        
        <div className="mt-20 pt-8 border-t border-[var(--color-charcoal)]/10 text-center flex flex-col items-center">
          <MapPin className="size-6 text-[var(--color-moss)] mb-4" />
          <p className="font-mono text-sm opacity-50">© 2026 HijauLog Core Systems. Infrastruktur Pelacakan Komoditas Berkelanjutan.</p>
        </div>
      </div>
    </div>
  );
}
