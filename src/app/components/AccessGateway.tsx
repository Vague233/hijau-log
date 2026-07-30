import { Link } from "react-router";
import { MapPin, LogIn, UserPlus, ArrowLeft } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export function AccessGateway() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(".gateway-bg", {
      scale: 1.1,
      opacity: 0,
      duration: 1.5,
      ease: "power3.out",
    })
    .from(".gateway-content", {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
    }, "-=1");
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden font-sans">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0 gateway-bg">
        <img 
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2000&auto=format&fit=crop" 
          alt="Dark Forest" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-[#2E4036]/90 to-black/80 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl px-6 py-12 flex flex-col items-center">
        {/* Header / Logo */}
        <div className="gateway-content flex flex-col items-center text-center mb-16 text-[var(--color-cream)]">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="size-10 text-[var(--color-moss)]" />
            <span className="text-4xl font-bold tracking-tight">HijauLog</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif italic mb-4">Gerbang Akses</h1>
          <p className="font-outfit opacity-80 max-w-md">
            Pilih jalur akses Anda ke dalam infrastruktur pelacakan komoditas tingkat lanjut.
          </p>
        </div>

        {/* Options */}
        <div className="w-full grid md:grid-cols-2 gap-6 max-w-3xl mb-16">
          <Link to="/login" className="gateway-content group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--color-moss)]/20">
            <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-moss)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <LogIn className="size-10 text-[var(--color-moss)] mb-6 transition-transform group-hover:scale-110" />
            <h2 className="text-2xl font-bold text-white mb-2">Masuk</h2>
            <p className="text-white/60 font-outfit text-sm">
              Sudah memiliki akun? Masuk ke sistem untuk mengakses instrumen telemetri Anda.
            </p>
          </Link>

          <Link to="/register" className="gateway-content group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--color-clay)]/20">
            <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-clay)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <UserPlus className="size-10 text-[var(--color-clay)] mb-6 transition-transform group-hover:scale-110" />
            <h2 className="text-2xl font-bold text-white mb-2">Daftar</h2>
            <p className="text-white/60 font-outfit text-sm">
              Bergabung dengan platform kami untuk memulai pelaporan dan verifikasi EUDR.
            </p>
          </Link>
        </div>

        {/* Back to Features */}
        <div className="gateway-content">
          <Link to="/#features" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors font-outfit text-sm px-6 py-3 rounded-full hover:bg-white/5">
            <ArrowLeft className="size-4" />
            Kembali ke penjelasan fitur
          </Link>
        </div>
      </div>
    </div>
  );
}
