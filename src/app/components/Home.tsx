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
          <div className="cinematic-section-1 absolute inset-0 flex items-center px-8 md:px-24">
            <div className="max-w-2xl">
              <div className="anim-elem flex items-center gap-3 mb-6">
                <div className="w-12 h-[1px] bg-[var(--color-clay)]"></div>
                <span className="font-mono text-sm tracking-widest text-[var(--color-clay)] uppercase">Urgensi Global</span>
              </div>
              <h1 className="anim-elem text-5xl md:text-8xl font-sans font-bold leading-[1.1] tracking-tight mb-2">
                Nature is the Asset.
              </h1>
              <h2 className="anim-elem text-4xl md:text-6xl font-serif italic mb-6">
                Kepatuhan EUDR <br/>di Jantung Tropis
              </h2>
              <p className="anim-elem font-outfit text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
                Sektor ekspor kayu Indonesia berada pada titik krusial. Setiap unit produk wajib terverifikasi tidak berasal dari lahan yang mengalami deforestasi setelah batas waktu 30 Desember 2020. 
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
          <div className="cinematic-section-2 absolute inset-0 flex items-center justify-end px-8 md:px-24">
            <div className="max-w-2xl text-right flex flex-col items-end">
              <div className="anim-elem opacity-0 translate-y-[50px] flex items-center gap-3 mb-6 justify-end">
                <span className="font-mono text-sm tracking-widest text-emerald-400 uppercase">Ekosistem HijauLog</span>
                <div className="w-12 h-[1px] bg-emerald-400"></div>
              </div>
              <h2 className="anim-elem opacity-0 translate-y-[50px] text-4xl md:text-6xl font-serif italic mb-6">
                Sinkronisasi Luring <br/>di Garis Depan
              </h2>
              <p className="anim-elem opacity-0 translate-y-[50px] font-outfit text-lg md:text-xl text-white/80 mb-8 leading-relaxed text-right">
                Kami merespons kesenjangan literasi teknologi dengan pendekatan <strong>Offline-First</strong>. Melalui aplikasi mobile di lapangan, petugas dapat melakukan geotagging yang presisi meski tanpa koneksi internet (blank spot). Data akan tersinkronisasi otomatis segera setelah sinyal terdeteksi.
              </p>
              
              <div className="anim-elem opacity-0 translate-y-[50px] grid grid-cols-2 gap-4 mt-8 w-full max-w-lg">
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
          <div className="cinematic-section-3 absolute inset-0 flex items-center justify-center px-8 text-center">
            <div className="max-w-3xl flex flex-col items-center">
              <div className="anim-elem opacity-0 translate-y-[50px] flex items-center justify-center mb-8">
                <div className="p-4 rounded-full bg-white/10 backdrop-blur-lg border border-white/20">
                  <Lock className="size-10 text-[var(--color-cream)]" />
                </div>
              </div>
              <h2 className="anim-elem opacity-0 translate-y-[50px] text-4xl md:text-6xl font-serif italic mb-6">
                Integritas Tak Terbantahkan
              </h2>
              <p className="anim-elem opacity-0 translate-y-[50px] font-outfit text-lg text-white/70 mb-12 max-w-2xl leading-relaxed">
                Setiap poligon lahan diukur dengan margin of error <strong>&lt; 10 meter</strong>. Kami menerapkan <span className="text-white font-bold">Digital Fingerprint (SHA-256)</span> pada setiap rekaman batch. Jika data diubah secara ilegal, hash akan hancur, mencegah praktik <em>timber laundering</em>.
              </p>
              
              <div className="anim-elem opacity-0 translate-y-[50px] flex items-center justify-center gap-8 w-full">
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

      {/* Features: The Precision Micro-UI Dashboard (Restored) */}
      <section id="features" className="py-32 px-4 md:px-16 bg-[var(--color-cream)] text-[var(--color-charcoal)] relative z-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="font-serif italic text-4xl md:text-6xl mb-6">Instrumen Presisi</h2>
            <p className="font-outfit text-lg max-w-xl opacity-70">
              Bukan sekadar form input. HijauLog adalah dashboard telemetri spasial yang dirancang untuk audit deforestasi tingkat lanjut.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Card 1: Diagnostic Shuffler */}
            <div className="bg-white rounded-[2rem] p-8 h-[400px] flex flex-col justify-between shadow-sm relative overflow-hidden group">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-sans font-bold text-xl">Audit Intelligence</h3>
                  <ShieldCheck className="text-[var(--color-moss)]" />
                </div>
                <DiagnosticShuffler />
              </div>
              <p className="text-sm font-outfit opacity-60 mt-auto">Analisis spasial berlapis untuk setiap poligon lahan.</p>
            </div>

            {/* Card 2: Telemetry Typewriter */}
            <div className="bg-[var(--color-charcoal)] text-[var(--color-cream)] rounded-[2rem] p-8 h-[400px] flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-sans font-bold text-xl">Data Stream</h3>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-xs font-mono">LIVE FEED</span>
                  </div>
                </div>
                <TelemetryTypewriter />
              </div>
              <p className="text-sm font-outfit opacity-60 mt-auto text-white/50">Koneksi real-time dengan database geospasial.</p>
            </div>

            {/* Card 3: Adaptive Regimen (Audit Scheduler) */}
            <div className="bg-[#e4e2da] rounded-[2rem] p-8 h-[400px] flex flex-col justify-between shadow-sm relative overflow-hidden">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="font-sans font-bold text-xl">Audit Scheduler</h3>
                  <LayoutDashboard className="text-[var(--color-clay)]" />
                </div>
               <MockCursorScheduler />
               <p className="text-sm font-outfit opacity-60 mt-auto relative z-10">Jadwal verifikasi otomatis berbasis AI.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Philosophy: The Manifesto (Restored) */}
      <section id="philosophy" ref={philosophyRef} className="relative py-40 px-4 md:px-16 bg-[var(--color-charcoal)] text-white overflow-hidden z-50">
        {/* Parallax Texture */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <img 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000&auto=format&fit=crop" 
            alt="Organic Texture" 
            className="w-full h-full object-cover grayscale"
          />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h2 className="phil-text-1 text-4xl md:text-6xl font-sans font-medium text-white/50 mb-12">
            Logistik tradisional bertanya:<br/>
            <span className="text-white">"Ke mana kayu ini pergi?"</span>
          </h2>
          <h2 className="phil-text-2 text-5xl md:text-8xl font-serif italic text-[var(--color-clay)]">
            Kita bertanya:<br/>"Dari mana ia berasal?"
          </h2>
        </div>
      </section>

      {/* Protocol: Sticky Stacking Archive (Restored) */}
      <section id="protocol" ref={protocolRef} className="bg-[var(--color-cream)] relative z-50">
        <ProtocolCard 
          bg="bg-[#EAE8E0]"
          title="Fase 01: Akuisisi Spasial"
          desc="Poligon ditarik langsung dari lapangan menggunakan instrumen GPS presisi. Ketidakcocokan area akan langsung ditolak oleh algoritma kami."
          icon={<ScanLine className="size-24 text-[var(--color-moss)] opacity-20" />}
          animation="rotate"
        />
        <ProtocolCard 
          bg="bg-[#DFDCD4]"
          title="Fase 02: Analisis Deforestasi"
          desc="Tumpang susun (overlay) dengan data satelit historis untuk membuktikan tidak ada deforestasi pasca 31 Desember 2020."
          icon={<Activity className="size-24 text-[var(--color-clay)] opacity-20" />}
          animation="pulse"
        />
        <ProtocolCard 
          bg="bg-[#D4D1C7]"
          title="Fase 03: Due Diligence Statement"
          desc="Sistem menerbitkan sertifikat DDS dan QR Code terenkripsi SHA-256 yang siap dipindai oleh otoritas Eropa di pelabuhan tujuan."
          icon={<FileText className="size-24 text-[var(--color-charcoal)] opacity-20" />}
          animation="scan"
        />
      </section>

      {/* Membership & Footer */}
      <section className="pt-16 bg-[var(--color-cream)] px-4 z-50 relative">

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

// --- Micro UI Components ---

function DiagnosticShuffler() {
  const [cards, setCards] = useState([
    { id: 1, title: "Deforestation Risk", value: "Low", color: "text-[var(--color-moss)]" },
    { id: 2, title: "Canopy Density", value: "84%", color: "text-[var(--color-moss)]" },
    { id: 3, title: "Geo-Accuracy", value: "±2.1m", color: "text-[var(--color-clay)]" }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards(prev => {
        const newCards = [...prev];
        const first = newCards.shift();
        if (first) newCards.push(first);
        return newCards;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-40 font-mono text-sm">
      {cards.map((card, index) => (
        <div 
          key={card.id}
          className="absolute w-full bg-[var(--color-cream)] border border-[var(--color-charcoal)]/5 rounded-xl p-4 flex justify-between items-center transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            top: index * 20,
            scale: 1 - (index * 0.05),
            zIndex: 10 - index,
            opacity: 1 - (index * 0.2),
          }}
        >
          <span className="text-[var(--color-charcoal)]/60">{card.title}</span>
          <span className={`font-bold ${card.color}`}>{card.value}</span>
        </div>
      ))}
    </div>
  );
}

function TelemetryTypewriter() {
  const messages = [
    "Syncing Polygon Telemetry...",
    "Verifying EUDR Guidelines...",
    "Encrypting SHA-256 Hash...",
    "Connecting to Satellite DB..."
  ];
  const [text, setText] = useState("");
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    let i = 0;
    const currentMsg = messages[msgIndex];
    
    const typeInterval = setInterval(() => {
      setText(currentMsg.substring(0, i + 1));
      i++;
      if (i > currentMsg.length) {
        clearInterval(typeInterval);
        setTimeout(() => {
          setMsgIndex((prev) => (prev + 1) % messages.length);
        }, 2000);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [msgIndex]);

  return (
    <div className="font-mono text-sm h-32 text-[var(--color-moss)]">
      <p className="opacity-50 mb-2 text-white/50">{'>'} INIT_SECURE_CONNECTION</p>
      <p className="opacity-50 mb-2 text-white/50">{'>'} ESTABLISHED</p>
      <p className="flex items-center text-green-400">
        {'>'} <span className="ml-2">{text}</span>
        <span className="w-2 h-4 bg-[var(--color-clay)] ml-1 animate-pulse"></span>
      </p>
    </div>
  );
}

function MockCursorScheduler() {
  return (
    <div className="absolute inset-0 pt-20 px-8 pb-8 pointer-events-none">
      {/* Grid */}
      <div className="grid grid-cols-7 gap-2 mb-4 text-center text-xs font-bold opacity-30 text-[var(--color-charcoal)]">
        <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({length: 14}).map((_, i) => (
          <div key={i} className={`aspect-square rounded-md ${i === 10 ? 'bg-[var(--color-moss)]' : 'bg-black/5'} transition-colors duration-500`}></div>
        ))}
      </div>
      
      {/* SVG Cursor Animation via CSS Keyframes inside */}
      <svg className="absolute w-6 h-6 z-20 cursor-anim" viewBox="0 0 24 24" fill="none" stroke="var(--color-charcoal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" fill="white"/>
      </svg>
      <style>{`
        @keyframes cursorMove {
          0% { transform: translate(0, 50px) scale(1); opacity: 0; }
          20% { transform: translate(120px, 30px) scale(1); opacity: 1; }
          40% { transform: translate(120px, 30px) scale(0.8); }
          50% { transform: translate(120px, 30px) scale(1); }
          80% { transform: translate(200px, -20px) scale(1); opacity: 1; }
          100% { transform: translate(200px, -20px) scale(1); opacity: 0; }
        }
        .cursor-anim {
          animation: cursorMove 4s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}

function ProtocolCard({ bg, title, desc, icon, animation }: { bg: string, title: string, desc: string, icon: React.ReactNode, animation: string }) {
  return (
    <div className={`protocol-card relative z-10 w-full h-[100dvh] flex items-center justify-center ${bg} p-8`} style={{ transform: 'translateZ(0)' }}>
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-16">
        <div className={`relative flex items-center justify-center size-64 rounded-full bg-white/30 shadow-2xl backdrop-blur-sm
          ${animation === 'rotate' ? 'animate-[spin_10s_linear_infinite]' : ''}
          ${animation === 'pulse' ? 'animate-pulse' : ''}
        `}>
          {icon}
        </div>
        <div className="flex-1">
          <h2 className="text-4xl md:text-6xl font-serif italic mb-6 text-[var(--color-charcoal)]">{title}</h2>
          <p className="text-xl font-outfit text-[var(--color-charcoal)]/80">{desc}</p>
        </div>
      </div>
    </div>
  );
}
