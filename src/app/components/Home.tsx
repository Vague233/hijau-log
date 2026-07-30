import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, LayoutDashboard, ShieldCheck, CheckCircle2, ChevronRight, Activity, ScanLine, FileText, Smartphone, Fingerprint, Lock } from "lucide-react";

import { useAuth } from "../../lib/AuthContext";

gsap.registerPlugin(ScrollTrigger);

const funFacts = [
  "Tahukah Anda? Indonesia memiliki kawasan hutan hujan tropis terbesar ketiga di dunia, mencakup sekitar 95,6 juta hektar.",
  "Tahukah Anda? Adaptasi smartphone di Indonesia mencapai 73% pada tahun 2024, memungkinkan pelacakan hutan dari genggaman.",
  "Tahukah Anda? EUDR menetapkan batas akhir evaluasi deforestasi pada 30 Desember 2020.",
  "Tahukah Anda? HijauLog mampu mereduksi waktu verifikasi asal kayu dari 14 hari menjadi kurang dari 24 jam.",
  "Tahukah Anda? Teknologi GPS seluler modern dalam sistem kami menekan margin of error spasial di bawah 10 meter."
];

export function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cinematicWrapperRef = useRef<HTMLDivElement>(null);
  const [randomFact, setRandomFact] = useState("");
  
  const { session } = useAuth();

  useEffect(() => {
    // Pick a random fun fact on mount
    const fact = funFacts[Math.floor(Math.random() * funFacts.length)];
    setRandomFact(fact);
  }, []);

  useGSAP(
    () => {
      // Hero Animations
      const tl = gsap.timeline();
      tl.from(".hero-text", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out",
        delay: 0.2,
      });

      // Navbar Morphing
      ScrollTrigger.create({
        start: "top -50",
        end: 99999,
        toggleClass: { className: "navbar-scrolled", targets: ".navbar-island" },
      });

      // Cinematic Pinning and Crossfade
      const sections = gsap.utils.toArray(".cinematic-section") as HTMLElement[];
      const bgs = gsap.utils.toArray(".cinematic-bg") as HTMLElement[];
      
      // Pin the entire cinematic wrapper
      ScrollTrigger.create({
        trigger: cinematicWrapperRef.current,
        start: "top top",
        end: `+=${sections.length * 100}%`,
        pin: true,
        scrub: true,
        id: "cinematic-pin"
      });

      // Animate sections and backgrounds based on scroll
      sections.forEach((section, i) => {
        // Animate text elements inside section
        gsap.fromTo(section.querySelectorAll(".anim-elem"), 
          { y: 50, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 1, 
            stagger: 0.1,
            scrollTrigger: {
              trigger: cinematicWrapperRef.current,
              start: `top ${-100 * (i - 0.2)}%`, 
              end: `top ${-100 * (i - 0.8)}%`,
              scrub: 1,
              // toggleActions: "play reverse play reverse",
            }
          }
        );
        
        // Hide the section text when moving to the next one
        if (i < sections.length - 1) {
          gsap.to(section.querySelectorAll(".anim-elem"), {
            y: -50,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
              trigger: cinematicWrapperRef.current,
              start: `top ${-100 * (i + 0.2)}%`,
              end: `top ${-100 * (i + 0.8)}%`,
              scrub: 1,
            }
          });
        }

        // Crossfade backgrounds
        if (i > 0) {
          gsap.fromTo(bgs[i], 
            { opacity: 0 },
            { 
              opacity: 1,
              scrollTrigger: {
                trigger: cinematicWrapperRef.current,
                start: `top ${-100 * (i - 0.5)}%`, // Start fading in midway through previous section
                end: `top ${-100 * (i - 0.1)}%`, // Fully faded in by the time we hit the section
                scrub: true,
              }
            }
          );
        }
      });
    },
    { scope: containerRef }
  );

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    e.preventDefault();
    if (!cinematicWrapperRef.current) return;
    
    // Calculate scroll position based on pin height
    // Since we pinned it for sections.length * 100%, 
    // each section represents 100vh of scroll inside the pin.
    const wrapperTop = cinematicWrapperRef.current.offsetTop;
    const windowHeight = window.innerHeight;
    const targetScroll = wrapperTop + (index * windowHeight);
    
    window.scrollTo({
      top: targetScroll,
      behavior: "smooth"
    });
  };

  return (
    <div ref={containerRef} className="bg-black relative overflow-x-hidden text-white font-sans">
      
      {/* Floating Navbar Island */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
        <nav className="navbar-island flex items-center justify-between px-6 py-4 rounded-[2rem] transition-all duration-500 bg-transparent text-white border border-transparent">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <MapPin className="size-5" />
            HijauLog
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#urgensi" onClick={(e) => scrollToSection(e, 0)} className="hover:opacity-70 transition-opacity">Urgensi</a>
            <a href="#solusi" onClick={(e) => scrollToSection(e, 1)} className="hover:opacity-70 transition-opacity">Solusi</a>
            <a href="#integritas" onClick={(e) => scrollToSection(e, 2)} className="hover:opacity-70 transition-opacity">Integritas</a>
          </div>
          <div className="flex items-center gap-3">
            {session ? (
              <Link to="/dashboard" className="text-sm font-medium bg-[var(--color-moss)] text-[var(--color-cream)] px-5 py-2 rounded-full hover:scale-105 transition-transform duration-300">
                Buka Dashboard
              </Link>
            ) : (
              <Link to="/access" className="text-sm font-medium bg-[var(--color-moss)] text-[var(--color-cream)] px-6 py-2.5 rounded-full hover:scale-105 transition-all duration-300 shadow-lg shadow-[var(--color-moss)]/20">
                Akses Sistem
              </Link>
            )}
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[100dvh] flex items-end pb-24 px-8 md:px-16 overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2000&auto=format&fit=crop" 
            alt="Dark Forest" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl text-white">
          <p className="hero-text text-sm md:text-base font-outfit uppercase tracking-[0.2em] mb-4 text-[var(--color-cream)]/80 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-clay)] animate-pulse"></span>
            EUDR Compliance Telemetry
          </p>
          <h1 className="hero-text text-5xl md:text-8xl font-sans font-bold leading-[1.1] tracking-tight mb-2">
            Nature is the Asset.
          </h1>
          <h2 className="hero-text text-5xl md:text-8xl font-serif italic font-light text-[var(--color-cream)] leading-[1.1]">
            Compliance is the Algorithm.
          </h2>
        </div>
      </section>

      {/* Cinematic Main Page Section */}
      <section ref={cinematicWrapperRef} className="relative h-[100dvh] overflow-hidden bg-black">
        
        {/* Background Layers */}
        <div className="absolute inset-0 z-0">
          {/* BG 1: Urgensi */}
          <div className="cinematic-bg absolute inset-0 z-10 opacity-100">
            <img 
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000&auto=format&fit=crop" 
              alt="Deep Forest Canopy" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          </div>
          
          {/* BG 2: Solusi */}
          <div className="cinematic-bg absolute inset-0 z-20 opacity-0">
            <img 
              src="https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?q=80&w=2000&auto=format&fit=crop" 
              alt="Forest Path" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/70 to-transparent"></div>
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* BG 3: Integritas */}
          <div className="cinematic-bg absolute inset-0 z-30 opacity-0">
            <img 
              src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2000&auto=format&fit=crop" 
              alt="Misty Woods" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 backdrop-blur-[2px]"></div>
          </div>
        </div>

        {/* Content Layers */}
        <div className="relative z-40 h-full">
          
          {/* Section 1: Urgensi */}
          <div id="urgensi" className="cinematic-section absolute inset-0 flex items-center px-8 md:px-24">
            <div className="max-w-2xl">
              <div className="anim-elem flex items-center gap-3 mb-6">
                <div className="w-12 h-[1px] bg-[var(--color-clay)]"></div>
                <span className="font-mono text-sm tracking-widest text-[var(--color-clay)] uppercase">Urgensi Global</span>
              </div>
              <h2 className="anim-elem text-4xl md:text-6xl font-serif italic mb-6">
                Tantangan Kepatuhan <br/>di Jantung Tropis
              </h2>
              <p className="anim-elem font-outfit text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
                Sektor ekspor kayu Indonesia berada pada titik krusial seiring diberlakukannya European Union Deforestation Regulation (EUDR). Setiap unit produk wajib terverifikasi tidak berasal dari lahan yang mengalami deforestasi setelah 30 Desember 2020. 
              </p>
              
              {/* Fun Fact */}
              <div className="anim-elem mt-12 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden group">
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
          <div id="solusi" className="cinematic-section absolute inset-0 flex items-center justify-end px-8 md:px-24">
            <div className="max-w-2xl text-right flex flex-col items-end">
              <div className="anim-elem flex items-center gap-3 mb-6 justify-end">
                <span className="font-mono text-sm tracking-widest text-emerald-400 uppercase">Ekosistem HijauLog</span>
                <div className="w-12 h-[1px] bg-emerald-400"></div>
              </div>
              <h2 className="anim-elem text-4xl md:text-6xl font-serif italic mb-6">
                Sinkronisasi Luring <br/>di Garis Depan
              </h2>
              <p className="anim-elem font-outfit text-lg md:text-xl text-white/80 mb-8 leading-relaxed text-right">
                Kami merespons kesenjangan literasi teknologi dengan pendekatan <strong>Offline-First</strong>. Melalui aplikasi mobile di lapangan, petugas dapat melakukan geotagging yang presisi meski tanpa koneksi internet (blank spot). Data akan tersinkronisasi otomatis segera setelah sinyal terdeteksi.
              </p>
              
              <div className="anim-elem grid grid-cols-2 gap-4 mt-8 w-full max-w-lg">
                <div className="bg-black/40 border border-white/5 p-4 rounded-xl backdrop-blur-md flex flex-col items-center text-center">
                  <Smartphone className="size-8 text-emerald-400 mb-3" />
                  <span className="font-bold text-sm mb-1">Mobile Field App</span>
                  <span className="text-xs text-white/50">Geotagging luring di tengah hutan lebat.</span>
                </div>
                <div className="bg-black/40 border border-white/5 p-4 rounded-xl backdrop-blur-md flex flex-col items-center text-center">
                  <LayoutDashboard className="size-8 text-emerald-400 mb-3" />
                  <span className="font-bold text-sm mb-1">Web Dashboard</span>
                  <span className="text-xs text-white/50">Manajemen visual dan validasi lahan.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Integritas */}
          <div id="integritas" className="cinematic-section absolute inset-0 flex items-center justify-center px-8 text-center">
            <div className="max-w-3xl flex flex-col items-center">
              <div className="anim-elem flex items-center justify-center mb-8">
                <div className="p-4 rounded-full bg-white/10 backdrop-blur-lg border border-white/20">
                  <Lock className="size-10 text-[var(--color-cream)]" />
                </div>
              </div>
              <h2 className="anim-elem text-4xl md:text-6xl font-serif italic mb-6">
                Integritas Tak Terbantahkan
              </h2>
              <p className="anim-elem font-outfit text-lg text-white/70 mb-12 max-w-2xl leading-relaxed">
                Setiap poligon lahan diukur dengan margin of error <strong>&lt; 10 meter</strong>. Kami menerapkan <span className="text-white font-bold">Digital Fingerprint (SHA-256)</span> pada setiap rekaman batch. Jika data diubah secara ilegal, hash akan hancur, mencegah praktik <em>timber laundering</em>.
              </p>
              
              <div className="anim-elem flex items-center justify-center gap-8 w-full">
                <div className="flex flex-col items-center gap-3">
                  <Fingerprint className="size-8 text-[var(--color-moss)]" />
                  <span className="font-mono text-xs tracking-widest uppercase">SHA-256 Hash</span>
                </div>
                <div className="h-12 w-[1px] bg-white/20"></div>
                <div className="flex flex-col items-center gap-3">
                  <ScanLine className="size-8 text-[var(--color-moss)]" />
                  <span className="font-mono text-xs tracking-widest uppercase">Dynamic QR</span>
                </div>
                <div className="h-12 w-[1px] bg-white/20"></div>
                <div className="flex flex-col items-center gap-3">
                  <MapPin className="size-8 text-[var(--color-moss)]" />
                  <span className="font-mono text-xs tracking-widest uppercase">PostGIS Auth</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <section className="bg-black relative z-50">
        <footer className="bg-black text-[var(--color-cream)] pt-20 pb-10 px-8 md:px-16 border-t border-white/10">
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
      </section>

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
