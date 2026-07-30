import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, LayoutDashboard, ShieldCheck, CheckCircle2, ChevronRight, Activity, ScanLine, FileText, Smartphone, Fingerprint, Lock } from "lucide-react";

import { useAuth } from "../../lib/AuthContext";
import { supabase } from "../../lib/supabase";

gsap.registerPlugin(ScrollTrigger);

const funFacts = [
  "Tahukah Anda? Indonesia memiliki kawasan hutan hujan tropis terbesar ketiga di dunia, mencakup sekitar 95,6 juta hektar.",
  "Tahukah Anda? Adaptasi smartphone di Indonesia mencapai 73% pada tahun 2024, memungkinkan pelacakan hutan dari genggaman.",
  "Tahukah Anda? EUDR menetapkan batas akhir evaluasi deforestasi pada 30 Desember 2020.",
  "Tahukah Anda? HijauLog mampu mereduksi waktu verifikasi asal kayu dari 14 hari menjadi kurang dari 24 jam.",
  "Tahukah Anda? Teknologi GPS seluler modern dalam sistem kami menekan margin of error spasial di bawah 10 meter."
];

export function Dashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cinematicWrapperRef = useRef<HTMLDivElement>(null);
  const philosophyRef = useRef<HTMLDivElement>(null);
  const protocolRef = useRef<HTMLDivElement>(null);
  const [randomFact, setRandomFact] = useState("");
  
  const { session } = useAuth();

  useEffect(() => {
    // Pick a random fun fact on mount
    const fact = funFacts[Math.floor(Math.random() * funFacts.length)];
    setRandomFact(fact);
  }, []);

  useGSAP(
    () => {
      // Navbar Morphing
      ScrollTrigger.create({
        start: "top -50",
        end: 99999,
        toggleClass: { className: "navbar-scrolled", targets: ".navbar-island" },
      });

      // Cinematic Pinning and Crossfade Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cinematicWrapperRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1, // Add some smoothing to the scrub
        }
      });

      // Initially, section 1 is visible, opacity 1, y 0.
      // Transition from 1 to 2
      tl.to(".cinematic-section-1 .anim-elem", { y: -50, opacity: 0, duration: 1, stagger: 0.1 })
        .to(".cinematic-bg-2", { opacity: 1, duration: 1 }, "<")
        .fromTo(".cinematic-section-2 .anim-elem", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.1 }, "<0.3")

        // Wait a bit (simulated by empty space in timeline)
        .to({}, { duration: 0.5 })

        // Transition from 2 to 3
        .to(".cinematic-section-2 .anim-elem", { y: -50, opacity: 0, duration: 1, stagger: 0.1 })
        .to(".cinematic-bg-3", { opacity: 1, duration: 1 }, "<")
        .fromTo(".cinematic-section-3 .anim-elem", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.1 }, "<0.3")
        
        // Wait at the end before unpinning
        .to({}, { duration: 0.5 });


      // Philosophy Parallax & Text Reveal (Original)
      gsap.from(".phil-text-1", {
        scrollTrigger: {
          trigger: philosophyRef.current,
          start: "top 70%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
      
      gsap.from(".phil-text-2", {
        scrollTrigger: {
          trigger: philosophyRef.current,
          start: "top 40%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.3,
      });

      // Protocol Stacking (Original)
      const cards = gsap.utils.toArray(".protocol-card") as HTMLElement[];
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        
        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          endTrigger: cards[i + 1],
          end: "top top",
          pin: true,
          pinSpacing: false,
        });

        gsap.to(card, {
          scale: 0.9,
          opacity: 0.5,
          filter: "blur(20px)",
          scrollTrigger: {
            trigger: cards[i + 1],
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });

    },
    { scope: containerRef }
  );

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    e.preventDefault();
    if (!cinematicWrapperRef.current) return;
    
    // We pinned it for 300% of height.
    // Index 0 -> top
    // Index 1 -> 150vh down
    // Index 2 -> 300vh down
    const wrapperTop = cinematicWrapperRef.current.offsetTop;
    const windowHeight = window.innerHeight;
    const targetScroll = wrapperTop + (index * windowHeight * 1.5);
    
    window.scrollTo({
      top: targetScroll,
      behavior: "smooth"
    });
  };

  return (
    <div ref={containerRef} className="bg-black relative overflow-x-hidden text-white font-sans">
      
      {/* Floating Navbar Island */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <nav className="navbar-island flex items-center justify-between px-6 py-4 rounded-[2rem] transition-all duration-500 bg-transparent text-white border border-transparent">
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <MapPin className="size-5" />
            HijauLog
          </Link>
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <a href="#urgensi" onClick={(e) => scrollToSection(e, 0)} className="hover:opacity-70 transition-opacity">Urgensi</a>
            <a href="#solusi" onClick={(e) => scrollToSection(e, 1)} className="hover:opacity-70 transition-opacity">Solusi</a>
            <a href="#integritas" onClick={(e) => scrollToSection(e, 2)} className="hover:opacity-70 transition-opacity">Integritas</a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium hidden md:block opacity-80">
              Hai, {session?.user?.user_metadata?.full_name?.split(' ')[0] || session?.user?.email?.split('@')[0] || "Pengguna"}
            </span>
            <Link 
              to="/dashboard/lands" 
              className="hidden sm:block text-sm font-medium bg-[var(--color-moss)] text-[var(--color-cream)] px-5 py-2 rounded-full hover:scale-105 transition-transform duration-300 shadow-lg shadow-[var(--color-moss)]/20"
            >
              Buka Dashboard
            </Link>
            <button 
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = '/';
              }} 
              className="text-sm font-medium bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full transition-all duration-300 backdrop-blur-md"
            >
              Keluar
            </button>
          </div>
        </nav>
      </div>

      {/* Cinematic Main Page Section (Replaces Hero) */}
      <section ref={cinematicWrapperRef} className="relative h-[100dvh] overflow-hidden bg-black">
        
        {/* Background Layers */}
        <div className="absolute inset-0 z-0">
          {/* BG 1: Urgensi */}
          <div className="cinematic-bg-1 absolute inset-0 z-10 opacity-100">
            <img 
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000&auto=format&fit=crop" 
              alt="Deep Forest Canopy" 
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          </div>
          
          {/* BG 2: Solusi */}
          <div className="cinematic-bg-2 absolute inset-0 z-20 opacity-0">
            <img 
              src="https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?q=80&w=2000&auto=format&fit=crop" 
              alt="Forest Path" 
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/70 to-transparent"></div>
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* BG 3: Integritas */}
          <div className="cinematic-bg-3 absolute inset-0 z-30 opacity-0">
            <img 
              src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2000&auto=format&fit=crop" 
              alt="Misty Woods" 
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 backdrop-blur-[2px]"></div>
          </div>
        </div>

        {/* Content Layers */}
        <div className="relative z-40 h-full">
          
          {/* Section 1: Urgensi */}
          <div className="cinematic-section-1 absolute inset-0 flex items-center px-8 md:px-24 pt-32">
            <div className="max-w-2xl mt-8">
              <div className="anim-elem flex items-center gap-3 mb-4">
                <div className="w-12 h-[1px] bg-[var(--color-clay)]"></div>
                <span className="font-mono text-sm tracking-widest text-[var(--color-clay)] uppercase">Urgensi Global</span>
              </div>
              <h1 className="anim-elem text-5xl md:text-7xl font-sans font-bold leading-[1.1] tracking-tight mb-2">
                Nature is the Asset.
              </h1>
              <h2 className="anim-elem text-3xl md:text-5xl font-serif italic mb-4">
                Kepatuhan EUDR <br/>di Jantung Tropis
              </h2>
              <p className="anim-elem font-outfit text-lg md:text-xl text-white/80 mb-6 leading-relaxed">
                Sektor ekspor kayu Indonesia berada pada titik krusial. Setiap unit produk wajib terverifikasi tidak berasal dari lahan yang mengalami deforestasi setelah batas waktu 30 Desember 2020. 
              </p>
              
              {/* Fun Fact */}
              <div className="anim-elem mt-6 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-moss)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <h4 className="font-sans font-bold text-sm text-[var(--color-moss)] mb-2 flex items-center gap-2">
                  <Activity className="size-4" /> Fakta Menarik
                </h4>
                <p className="font-outfit text-sm text-white/70 italic leading-relaxed">
                  "{randomFact}"
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Solusi */}
          <div className="cinematic-section-2 absolute inset-0 flex items-center justify-end px-8 md:px-24 pt-32">
            <div className="max-w-2xl text-right flex flex-col items-end mt-8">
              <div className="anim-elem opacity-0 translate-y-[50px] flex items-center gap-3 mb-3 justify-end">
                <span className="font-mono text-sm tracking-widest text-emerald-400 uppercase">Ekosistem HijauLog</span>
                <div className="w-12 h-[1px] bg-emerald-400"></div>
              </div>
              <h2 className="anim-elem opacity-0 translate-y-[50px] text-3xl md:text-4xl lg:text-5xl font-serif italic mb-3">
                Sinkronisasi Luring <br/>di Garis Depan
              </h2>
              <p className="anim-elem opacity-0 translate-y-[50px] font-outfit text-base md:text-lg text-white/80 mb-4 leading-relaxed text-right">
                Kami merespons kesenjangan literasi teknologi dengan pendekatan <strong>Offline-First</strong>. Melalui aplikasi mobile di lapangan, petugas dapat melakukan geotagging yang presisi meski tanpa koneksi internet (blank spot). Data akan tersinkronisasi otomatis segera setelah sinyal terdeteksi.
              </p>
              
              <div className="anim-elem opacity-0 translate-y-[50px] grid grid-cols-2 gap-3 mt-2 w-full max-w-lg mb-5">
                <div className="bg-black/40 border border-white/5 p-3 rounded-xl backdrop-blur-md flex flex-col items-center text-center">
                  <Smartphone className="size-8 text-emerald-400 mb-3" />
                  <span className="font-bold text-sm mb-1">Mobile Field App</span>
                  <span className="text-xs text-white/50">Geotagging luring di tengah hutan lebat.</span>
                </div>
                <div className="bg-black/40 border border-white/5 p-4 rounded-xl backdrop-blur-md flex flex-col items-center text-center">
                  <Activity className="size-8 text-emerald-400 mb-3" />
                  <span className="font-bold text-sm mb-1">Auto-Sync</span>
                  <span className="text-xs text-white/50">Resolusi konflik data otomatis ke cloud.</span>
                </div>
              </div>
              </div>
            </div>
          </div>

          {/* Section 3: Integritas */}
          <div className="cinematic-section-3 absolute inset-0 flex items-center justify-center px-8 text-center pt-32">
            <div className="max-w-3xl flex flex-col items-center mt-8">
              <div className="anim-elem opacity-0 translate-y-[50px] flex items-center justify-center mb-6">
                <div className="p-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20">
                  <Lock className="size-8 text-[var(--color-cream)]" />
                </div>
              </div>
              <h2 className="anim-elem opacity-0 translate-y-[50px] text-3xl md:text-5xl font-serif italic mb-4">
                Integritas Tak Terbantahkan
              </h2>
              <p className="anim-elem opacity-0 translate-y-[50px] font-outfit text-base md:text-lg text-white/70 mb-8 max-w-2xl leading-relaxed">
                Setiap poligon lahan diukur dengan margin of error <strong>&lt; 10 meter</strong>. Kami menerapkan <strong>Digital Fingerprint (SHA-256)</strong> pada setiap rekaman batch. Jika data diubah secara ilegal, hash akan hancur, mencegah praktik <em>timber laundering</em>.
              </p>
              
              <div className="anim-elem opacity-0 translate-y-[50px] flex items-center gap-6 md:gap-12 text-[var(--color-cream)]/60 font-mono text-xs md:text-sm mb-8">
                <div className="flex flex-col items-center gap-2">
                  <Fingerprint className="size-6" />
                  <span>SHA-256 HASH</span>
                </div>
                <div className="w-[1px] h-8 bg-white/20"></div>
                <div className="flex flex-col items-center gap-2">
                  <ScanLine className="size-6" />
                  <span>DYNAMIC QR</span>
                </div>
                <div className="w-[1px] h-8 bg-white/20"></div>
                <div className="flex flex-col items-center gap-2">
                  <MapPin className="size-6" />
                  <span>POSTGIS AUTH</span>
                </div>
              </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-charcoal)] text-[var(--color-cream)] rounded-t-[4rem] pt-20 pb-10 px-8 md:px-16 mt-20 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 border-b border-white/10 pb-12 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-2xl mb-6">
              <MapPin className="size-6 text-[var(--color-moss)]" />
              HijauLog
            </Link>
            <p className="font-outfit text-[var(--color-cream)]/50 max-w-sm">
              Infrastruktur pelacakan komoditas tingkat lanjut untuk menjamin kepatuhan pasar global.
            </p>
          </div>
            <div className="flex flex-col md:flex-row gap-12 md:gap-24">
              <div className="flex flex-col gap-4 font-outfit">
                <span className="font-bold mb-2">Perusahaan</span>
                <Link to="/about" className="text-[var(--color-cream)]/60 hover:text-[var(--color-cream)] transition-colors">Tentang Kami</Link>
              </div>
              <div className="flex flex-col gap-4 font-outfit">
                <span className="font-bold mb-2">Legal</span>
                <Link to="/privacy" className="text-[var(--color-cream)]/60 hover:text-[var(--color-cream)] transition-colors">Privacy Policy</Link>
                <a href="https://environment.ec.europa.eu/topics/forests/deforestation/regulation-deforestation-free-products_en" target="_blank" rel="noopener noreferrer" className="text-[var(--color-cream)]/60 hover:text-[var(--color-cream)] transition-colors">EUDR Statement</a>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-mono text-[var(--color-cream)]/40">
            <p>© 2026 HijauLog Core Systems.</p>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full">
              <span className="w-2 h-2 bg-[var(--color-moss)] rounded-full animate-pulse"></span>
              SYSTEM OPERATIONAL
            </div>
          </div>
        </footer>

      {/* CSS for Navbar Morph */}
      <style>{`
        .navbar-scrolled {
          background-color: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(16px);
          color: white;
          border-color: rgba(255,255,255,0.1);
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
}

