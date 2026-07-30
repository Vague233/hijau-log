import { useState } from "react";
import { Link } from "react-router";
import { Button } from "./ui/button";

const panels = [
  {
    id: "01",
    title: "Peta & Lahan",
    subtitle: "Manajemen Area Hutan",
    desc: "Registrasi lahan baru, pemetaan poligon koordinat GPS, dan pemantauan luasan area hutan secara real-time.",
    cta: "Kelola Lahan",
    link: "/dashboard/lands",
    image: "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "02",
    title: "Verifikasi EUDR",
    subtitle: "Due Diligence Statement",
    desc: "Analisis geospasial mendalam yang memastikan poligon lahan bebas dari indikasi deforestasi pasca 31 Desember 2020.",
    cta: "Cek Kepatuhan",
    link: "/dashboard/export",
    image: "https://images.unsplash.com/photo-1470115636405-2d3924bea9e5?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "03",
    title: "Traceability",
    subtitle: "Enkripsi Data Rantai Pasok",
    desc: "Pembuatan kode QR terenkripsi yang berisi riwayat titik geolokasi, kepemilikan, dan status kepatuhan kayu untuk inspeksi otoritas Eropa.",
    cta: "Buat QR Code",
    link: "/dashboard/lands",
    image: "https://images.unsplash.com/photo-1416879598555-25916029584d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "04",
    title: "Aktivitas Sistem",
    subtitle: "Log & Telemetri",
    desc: "Pantau seluruh riwayat pendaftaran lahan, pembuatan QR, dan penarikan data secara real-time oleh berbagai aktor rantai pasok.",
    cta: "Lihat Log",
    link: "/dashboard", // Currently points back to dashboard as placeholder
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
  },
];

export function Dashboard() {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  return (
    <div className="bg-[var(--color-charcoal)] min-h-[calc(100vh-4rem)] p-4 md:p-8 flex flex-col items-center justify-center">
      
      <div className="w-full max-w-7xl mb-8 text-center md:text-left text-[var(--color-cream)]">
        <h1 className="text-3xl md:text-5xl font-serif italic mb-2">Sistem Telemetri</h1>
        <p className="font-outfit opacity-70">Pilih instrumen operasional Anda.</p>
      </div>

      {/* Expanding Accordion Container */}
      <div 
        className="flex flex-col md:flex-row w-full max-w-7xl h-[80vh] min-h-[600px] gap-2 md:gap-4 overflow-hidden"
        onMouseLeave={() => setActivePanel(null)}
      >
        {panels.map((panel) => {
          const isActive = activePanel === panel.id;
          const isAnyActive = activePanel !== null;
          
          return (
            <div
              key={panel.id}
              onMouseEnter={() => setActivePanel(panel.id)}
              className={`group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                ${isActive ? 'md:flex-[4] flex-[3]' : 'md:flex-[1] flex-[1]'}
                ${!isActive && isAnyActive ? 'opacity-80' : 'opacity-100'}
              `}
            >
              {/* Background Image */}
              <img 
                src={panel.image} 
                alt={panel.title} 
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-[800ms] ease-in-out
                  ${isActive ? 'grayscale-0 brightness-[0.6] scale-100' : 'grayscale brightness-[0.4] scale-110'}
                `}
              />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-700
                ${isActive ? 'opacity-90' : 'opacity-60'}
              `}></div>

              {/* Collapsed State Content (Vertical Text) */}
              <div 
                className={`absolute inset-0 p-6 flex flex-col items-center justify-between transition-opacity duration-500
                  ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100 delay-200'}
                `}
              >
                <span className="text-[var(--color-cream)] font-mono text-sm md:text-lg opacity-60">
                  {panel.id}
                </span>
                
                {/* Horizontal on mobile, Vertical on desktop */}
                <span className="text-[var(--color-cream)] font-serif italic text-2xl md:text-3xl whitespace-nowrap md:rotate-180 md:[writing-mode:vertical-rl] tracking-wide">
                  {panel.title}
                </span>
              </div>

              {/* Expanded State Content */}
              <div 
                className={`absolute inset-x-0 bottom-0 p-6 md:p-12 flex flex-col justify-end transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
                  ${isActive ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-10 pointer-events-none'}
                `}
              >
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-[var(--color-clay)] font-mono text-xs md:text-sm tracking-widest">{panel.id}</span>
                  <span className="h-[1px] w-12 bg-[var(--color-clay)]/50"></span>
                  <p className="text-[var(--color-clay)] font-mono text-xs md:text-sm uppercase tracking-widest">
                    {panel.subtitle}
                  </p>
                </div>
                
                <h2 className="text-[var(--color-cream)] text-3xl md:text-5xl font-serif italic mb-4 leading-tight">
                  {panel.title}
                </h2>
                
                <p className="text-[var(--color-cream)]/70 font-outfit text-sm md:text-base max-w-lg mb-8 line-clamp-3 md:line-clamp-none">
                  {panel.desc}
                </p>
                
                <Link to={panel.link} className="w-fit">
                  <Button className="bg-[var(--color-moss)] hover:bg-[var(--color-moss)]/80 text-[var(--color-cream)] rounded-full px-6 md:px-8 py-6 text-sm md:text-base transition-transform hover:scale-105 duration-300">
                    {panel.cta}
                  </Button>
                </Link>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}