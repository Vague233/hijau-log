import { Link } from "react-router";
import { Info, ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-charcoal)] pt-32 pb-20 px-4 md:px-16 font-outfit">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-[var(--color-moss)] hover:opacity-80 transition-opacity mb-8 font-semibold">
          <ArrowLeft className="size-4" />
          Kembali ke Beranda
        </Link>
        
        <div className="flex items-center gap-3 mb-6">
          <Info className="size-8 text-[var(--color-clay)]" />
          <h1 className="text-4xl md:text-5xl font-serif italic text-[var(--color-charcoal)]">Tentang HijauLog</h1>
        </div>
        
        <div className="space-y-10 text-lg leading-relaxed opacity-90 mt-12">
          
          <section>
            <h2 className="text-2xl font-serif italic font-bold mb-4 text-[var(--color-moss)]">Misi Kami</h2>
            <p className="mb-4">
              HijauLog dibangun dengan satu tujuan utama: <strong>memberikan infrastruktur pelacakan komoditas tingkat lanjut</strong> yang tidak hanya sekadar menyimpan data, tetapi menjamin kepatuhan terhadap regulasi pasar global, khususnya <em>European Union Deforestation Regulation</em> (EUDR).
            </p>
            <p>
              Kami percaya bahwa kelestarian alam dan kepatuhan hukum adalah fondasi dari bisnis masa depan. Oleh karena itu, kami menyediakan alat telemetri spasial yang presisi untuk memverifikasi bahwa komoditas yang Anda perdagangkan sepenuhnya bebas dari deforestasi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif italic font-bold mb-4 text-[var(--color-moss)]">Mengapa HijauLog?</h2>
            <p className="mb-4">
              Peraturan pasar global yang semakin ketat mengharuskan pelaku industri untuk membuktikan asal-usul produk mereka. Pendekatan tradisional yang hanya mengandalkan dokumen kertas tidak lagi cukup.
            </p>
            <p className="mb-4">
              Di sinilah HijauLog mengambil peran:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Geo-Tagging Akurat:</strong> Pemetaan poligon dan titik koordinat lahan secara digital untuk memverifikasi asal komoditas.</li>
              <li><strong>Due Diligence Statement:</strong> Pembuatan pernyataan uji tuntas yang tervalidasi dan siap diserahkan kepada otoritas pasar global.</li>
              <li><strong>Keamanan Data:</strong> Infrastruktur berbasis cloud yang mengamankan setiap titik data rantai pasok Anda dari manipulasi.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif italic font-bold mb-4 text-[var(--color-moss)]">Filosofi Kami</h2>
            <div className="bg-[var(--color-moss)]/5 p-6 rounded-2xl border border-[var(--color-moss)]/20 italic">
              "Nature is the Asset. Compliance is the Algorithm."
            </div>
            <p className="mt-4">
              Kami memandang alam sebagai aset berharga yang harus dijaga. Kepatuhan (compliance) bukanlah sebuah beban, melainkan algoritma operasional yang memastikan bisnis Anda berjalan seimbang dengan kelestarian bumi.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
